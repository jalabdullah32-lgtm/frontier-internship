"use client"

import { useState, useRef } from "react"
import { ArrowLeft, BookOpen, Layers, CreditCard } from "lucide-react"

interface ResultsViewProps {
  data: {
    videoId: string
    thumbnailUrl: string
    title: string
    channel: string
    outline: string
    summaries: string
    flashcards: string
  }
  onBack: () => void
}

function parseOutline(text: string) {
  const sections = text.split(/## SECTION \d+:/).slice(1)
  return sections.map(section => {
    const lines = section.trim().split('\n')
    const titleLine = lines[0].split('—')[0].trim()

    // Render remaining lines — clean up markdown into readable text
    const bodyLines = lines.slice(1).map(line => {
      // Sub-section headers like ### NT1 Diagnostic Criteria (~7:00-9:00):
      if (line.startsWith('###')) {
        const cleaned = line.replace(/^###\s*/, '').trim()
        return { type: 'subheading' as const, text: cleaned }
      }
      // Timestamp lines **X:XX** - desc or **X:XX**
      if (line.match(/\*\*\d+:\d+\*\*/)) {
        const timeMatch = line.match(/\*\*(\d+:\d+)\*\*/)
        const time = timeMatch ? timeMatch[1] : null
        const desc = line.replace(/\*\*\d+:\d+[\d\s:–-]*\*\*\s*[-–]?\s*/, '').replace(/^[-*⚠️\s]+/, '').trim()
        return { type: 'timestamp' as const, time, text: desc }
      }
      // Warning/important lines
      if (line.includes('⚠️') || line.includes('IMPORTANT')) {
        const text = line.replace(/^[-*⚠️\s]+/, '').replace(/\*\*/g, '').trim()
        return { type: 'important' as const, text }
      }
      // Bullet lines
      if (line.match(/^[-*]\s/)) {
        const text = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim()
        return { type: 'bullet' as const, text }
      }
      // Dividers or empty
      if (line.trim() === '---' || line.trim() === '') {
        return { type: 'divider' as const, text: '' }
      }
      return { type: 'text' as const, text: line.replace(/\*\*/g, '').trim() }
    }).filter(l => l.text || l.type === 'divider')

    return { title: titleLine, bodyLines }
  })
}

function parseSummaries(text: string) {
  const short = text.match(/# 90 SECOND SUMMARY:([\s\S]*?)(?=# 5 MINUTE|$)/)?.[1]?.trim() || ""
  const medium = text.match(/# 5 MINUTE SUMMARY:([\s\S]*?)(?=# FULL|$)/)?.[1]?.trim() || ""
  const full = text.match(/# FULL SUMMARY:([\s\S]*?)$/)?.[1]?.trim() || ""
  return { short, medium, full }
}

function parseFlashcards(text: string) {
  const cards = text.split(/CARD \d+[^:]*:/).slice(1)
  return cards.map(card => {
    const front = card.match(/Front: (.*?)$/m)?.[1]?.trim() || ""
    const back = card.match(/Back: ([\s\S]*?)(?=Type:|Timestamp:|$)/)?.[1]?.trim() || ""
    return { front, back }
  }).filter(c => c.front)
}

function timeToSeconds(time: string): number {
  const parts = time.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

export function ResultsView({ data, onBack }: ResultsViewProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [summaryDepth, setSummaryDepth] = useState<"short" | "medium" | "full">("short")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const sections = parseOutline(data.outline)
  const summaries = parseSummaries(data.summaries)
  const flashcards = parseFlashcards(data.flashcards)

  const seekVideo = (time: string) => {
    const seconds = timeToSeconds(time)
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${data.videoId}?start=${seconds}&autoplay=1`
    }
  }

  return (
    <div className="relative z-10">

      {/* VIDEO — large but not overwhelming, like CyberKy */}
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <div className="rounded-2xl overflow-hidden border border-border/50 shadow-xl" style={{ aspectRatio: '16/9' }}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${data.videoId}`}
            title={data.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-14">

        {/* Back + Title */}
        <div className="space-y-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground leading-tight">{data.title}</h1>
            {data.channel && <p className="text-sm text-muted-foreground font-mono mt-1">{data.channel}</p>}
          </div>
        </div>

        {/* Summary */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Summary</h2>
          </div>
          <div className="flex items-center gap-5 mb-5">
            {(["short", "medium", "full"] as const).map((depth) => (
              <button key={depth} onClick={() => setSummaryDepth(depth)}
                className={`text-sm font-mono transition-colors ${summaryDepth === depth ? "text-foreground underline underline-offset-4 font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                {depth === "short" ? "90 sec" : depth === "medium" ? "5 min" : "Full"}
              </button>
            ))}
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-7">
            <p className="text-base text-foreground leading-8 whitespace-pre-wrap">{summaries[summaryDepth]}</p>
          </div>
        </section>

        {/* Outline */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Outline</h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono mb-5">Click any timestamp to jump to that moment</p>
          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                <p className="text-base font-bold text-foreground mb-4">{section.title}</p>
                <div className="space-y-2">
                  {section.bodyLines.map((line, j) => {
                    if (line.type === 'divider') return null
                    if (line.type === 'subheading') return (
                      <p key={j} className="text-sm font-semibold text-foreground mt-4 mb-1">{line.text}</p>
                    )
                    if (line.type === 'timestamp') return (
                      <div key={j} className="flex items-start gap-3">
                        {line.time && (
                          <button onClick={() => seekVideo(line.time!)}
                            className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-1 rounded shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors mt-0.5">
                            {line.time}
                          </button>
                        )}
                        <span className="text-base text-foreground leading-relaxed">{line.text}</span>
                      </div>
                    )
                    if (line.type === 'important') return (
                      <div key={j} className="flex items-start gap-2 mt-3 bg-accent/20 rounded-xl px-3 py-2">
                        <span className="text-sm">⚠️</span>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{line.text}</p>
                      </div>
                    )
                    if (line.type === 'bullet') return (
                      <div key={j} className="flex items-start gap-2 ml-1">
                        <span className="text-muted-foreground mt-2 shrink-0">·</span>
                        <p className="text-base text-foreground leading-relaxed">{line.text}</p>
                      </div>
                    )
                    return <p key={j} className="text-base text-foreground leading-relaxed">{line.text}</p>
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flashcards */}
        <section className="pb-16">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Flashcards</h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono mb-5">Tap any card to reveal the answer</p>
          <div className="space-y-3">
            {flashcards.map((card, i) => (
              <div key={i}
                className="cursor-pointer bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
                onClick={() => {
                  const newSet = new Set(flippedCards)
                  newSet.has(i) ? newSet.delete(i) : newSet.add(i)
                  setFlippedCards(newSet)
                }}>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
                  {flippedCards.has(i) ? "Answer" : "Question — tap to reveal"}
                </p>
                <p className="text-base font-semibold text-foreground leading-relaxed whitespace-pre-wrap">
                  {flippedCards.has(i) ? card.back : card.front}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
