"use client"

import { useState, useRef, useEffect } from "react"
import { BookOpen, Layers, CreditCard, Search, ChevronLeft, ChevronRight, Send, Download, RefreshCw, Languages } from "lucide-react"
import { default as ReactMarkdown } from "react-markdown"

interface ResultsViewProps {
  data: {
    videoId: string
    thumbnailUrl: string
    title: string
    channel: string
    outline: string
    summaries: string
    flashcards: string
    compressed?: string
  }
  onBack: () => void
}

// ── parsers ─────────────────────────────────────────────────────────────────

function parseSections(text: string) {
  const sections = text.split(/## SECTION \d+:/).slice(1)
  return sections.map(section => {
    const lines = section.trim().split('\n')
    const titleLine = lines[0].split('—')[0].replace(/^#+\s*/, '').trim()
    const startMatch = lines[0].match(/Start time[:\s]+(\d+:\d+)/i)
    const startTime = startMatch ? startMatch[1] : null

    const bodyLines = lines.slice(1).map(line => {
      if (line.startsWith('###')) {
        return { type: 'subheading' as const, text: line.replace(/^###\s*/, '').trim(), time: null }
      }
      if (line.match(/\*\*\d+:\d+\*\*/)) {
        const timeMatch = line.match(/\*\*(\d+:\d+)\*\*/)
        const time = timeMatch ? timeMatch[1] : null
        const desc = line.replace(/\*\*\d+[\d\s:–-]*\*\*\s*[-–]?\s*/, '').replace(/^[-*⚠️\s]+/, '').trim()
        return { type: 'timestamp' as const, time, text: desc }
      }
if (line.toUpperCase().includes('IMPORTANT') || line.toUpperCase().includes('NOTE:')) {        const text = line.replace(/^[-*⚠️\s]+/, '').replace(/\*\*/g, '').trim()
        return { type: 'important' as const, text, time: null }
      }
      if (line.match(/^[-*]\s/)) {
        const text = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim()
        return { type: 'bullet' as const, text, time: null }
      }
      if (line.trim() === '---' || !line.trim()) return { type: 'divider' as const, text: '', time: null }
      return { type: 'text' as const, text: line.replace(/\*\*/g, '').trim(), time: null }
    }).filter(l => l.text || l.type === 'divider')

    // Extract key terms section
    const keyTermsIdx = bodyLines.findIndex(l => l.text.toLowerCase().includes('key terms'))
    const keyTerms: string[] = []
    if (keyTermsIdx !== -1) {
      for (let i = keyTermsIdx + 1; i < bodyLines.length; i++) {
        if (bodyLines[i].type === 'bullet' || bodyLines[i].type === 'text') {
          const t = bodyLines[i].text.trim()
          if (t) keyTerms.push(t)
        }
      }
    }
    const mainLines = keyTermsIdx !== -1 ? bodyLines.slice(0, keyTermsIdx) : bodyLines

    return { title: titleLine, startTime, bodyLines: mainLines, keyTerms }
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
    const timestamp = card.match(/Timestamp: (.*?)$/m)?.[1]?.trim() || ""
    return { front, back, timestamp }
  }).filter(c => c.front)
}

function timeToSeconds(time: string): number {
  const parts = time.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

// ── Topic Enrichment (calls Claude API) ─────────────────────────────────────

function TopicBubbles({ title, channel, compressed }: { title: string; channel: string; compressed?: string }) {
  const [facts, setFacts] = useState<{ label: string; value: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFacts() {
      try {
        // Extract topic from title — if title is vague, infer from content
        const topicContext = compressed
          ? `Video title: "${title}". Channel: "${channel}". Here is a brief summary of the content: ${compressed.slice(0, 400)}`
          : `Video title: "${title}". Channel: "${channel}".`

        const prompt = `${topicContext}

Based on the main subject of this video, identify the core topic being taught (e.g. "Narcolepsy", "Cloud Networking", "Machine Learning", etc.).

Then return a JSON array of exactly 6 fascinating, concise fact-bubbles about that topic. Each bubble should have a short "label" (e.g. "Discovered") and a punchy "value" (e.g. "1880, by Jean-Baptiste Gélineau").

Focus on facts like: when was it discovered/created, how many people are affected, key symptoms or traits, gender/age differences, a fun or surprising fact, and one real-world impact.

Respond ONLY with a raw JSON array, no markdown fences, no extra text. Example format:
[{"label":"Discovered","value":"1880 by Jean-Baptiste Gélineau"},{"label":"Prevalence","value":"1 in 2,000 people worldwide"}]`

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
          })
        })
        const data = await res.json()
        const text = data.content?.map((b: any) => b.text || "").join("") || ""
        const clean = text.replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(clean)
        setFacts(parsed)
      } catch {
        setFacts([])
      } finally {
        setLoading(false)
      }
    }
    fetchFacts()
  }, [title, channel, compressed])

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 w-40 bg-card border border-border/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!facts.length) return null

  return (
    <div className="flex flex-wrap gap-3">
      {facts.map((f, i) => (
        <div key={i} className="bg-card border border-border/50 rounded-2xl px-5 py-3 hover:border-primary/30 transition-all">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1">{f.label}</p>
          <p className="text-sm font-semibold text-foreground leading-snug">{f.value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Semantic Search ──────────────────────────────────────────────────────────

function SemanticSearch({ videoId, compressed, onSeek }: { videoId: string; compressed?: string; onSeek: (time: string) => void }) {
  const [query, setQuery] = useState("")
  const [answer, setAnswer] = useState<{ text: string; timestamp?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !compressed) return
    setLoading(true)
    setAnswer(null)
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query, transcript: compressed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Search failed")
      // Backend returns { answer, timestamp } or similar — normalise both shapes
      const text: string = data.answer || data.text || JSON.stringify(data)
      const tsMatch = text.match(/TIMESTAMP:\s*(\d+:\d+)/)
      const cleanText = text.replace(/TIMESTAMP:.*$/m, "").trim()
      const timestamp: string | undefined = data.timestamp || tsMatch?.[1]
      setAnswer({ text: cleanText, timestamp })
    } catch {
      setAnswer({ text: "Could not retrieve an answer. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-foreground">Ask the Lecture</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">Type any question — we'll find the answer in the video.</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-5">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. What causes narcolepsy?"
          className="flex-1 h-12 px-4 rounded-2xl bg-white border border-border/50 text-black placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 shrink-0"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            : <Send className="w-4 h-4 text-primary-foreground" />
          }
        </button>
      </form>

      {answer && (
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-3 animate-fade-in-up">
          <p className="text-base text-foreground leading-relaxed">{answer.text}</p>
          {answer.timestamp && (
            <button
              onClick={() => onSeek(answer.timestamp!)}
              className="font-mono text-xs text-accent-foreground bg-accent/30 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Jump to {answer.timestamp}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

// ── Flashcard Deck ───────────────────────────────────────────────────────────

function FlashcardDeck({ cards: initialCards, onSeek, transcript }: { cards: { front: string; back: string; timestamp: string }[]; onSeek: (t: string) => void; transcript?: string }) {
  const [cards, setCards] = useState(initialCards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const card = cards[index]

  const next = () => { setFlipped(false); setTimeout(() => setIndex((i) => (i + 1) % cards.length), 150) }
  const prev = () => { setFlipped(false); setTimeout(() => setIndex((i) => (i - 1 + cards.length) % cards.length), 150) }

  const handleRegenerate = async () => {
    if (!transcript || !card) return
    setRegenerating(true)
    try {
      const cardText = `Front: ${card.front}\nBack: ${card.back}`
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: cardText, transcript }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Backend returns a new card — normalise both possible shapes
      const newFront: string = data.front || data.question || card.front
      const newBack: string = data.back || data.answer || card.back
      const newTs: string = data.timestamp || card.timestamp
      const updated = [...cards]
      updated[index] = { front: newFront, back: newBack, timestamp: newTs }
      setCards(updated)
      setFlipped(false)
    } catch (err) {
      console.error(err)
    } finally {
      setRegenerating(false)
    }
  }

  if (!card) return null

  return (
    <div className="space-y-4">
      {/* Card */}
      <div
        className="cursor-pointer bg-card border border-border/50 rounded-3xl p-8 min-h-[200px] flex flex-col justify-between hover:border-primary/30 transition-all duration-300"
        onClick={() => setFlipped(f => !f)}
      >
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
          {flipped ? "Answer" : "Question — tap to reveal"}
        </p>
        <p className="text-xl font-semibold text-foreground leading-relaxed mt-4">
          {flipped
            ? <div className="prose prose-neutral max-w-none [&>p]:text-xl [&>p]:leading-relaxed [&>strong]:font-bold"><ReactMarkdown>{card.back}</ReactMarkdown></div>
            : card.front
          }
        </p>
        <div className="flex items-center justify-between mt-4">
          {flipped && card.timestamp ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSeek(card.timestamp) }}
              className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {card.timestamp}
            </button>
          ) : <span />}
          <p className="text-xs text-muted-foreground font-mono">{index + 1} / {cards.length}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button onClick={prev} className="w-10 h-10 rounded-2xl border border-border/50 flex items-center justify-center hover:bg-card transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Progress dots (capped at 12) */}
        <div className="flex-1 flex items-center gap-1.5 justify-center flex-wrap">
          {cards.slice(0, Math.min(cards.length, 12)).map((_, i) => (
            <button
              key={i}
              onClick={() => { setFlipped(false); setIndex(i) }}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "bg-primary w-5" : "bg-border w-2"}`}
            />
          ))}
          {cards.length > 12 && <span className="text-xs text-muted-foreground font-mono">+{cards.length - 12}</span>}
        </div>

        <button onClick={next} className="w-10 h-10 rounded-2xl border border-border/50 flex items-center justify-center hover:bg-card transition-colors">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Regenerate */}
      {transcript && (
        <div className="flex justify-end">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 rounded-xl px-3 py-1.5 transition-all disabled:opacity-40"
          >
            {regenerating
              ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <RefreshCw className="w-3 h-3" />
            }
            Regenerate this card
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
]

export function ResultsView({ data, onBack }: ResultsViewProps) {
  const [summaryDepth, setSummaryDepth] = useState<"short" | "medium" | "full">("short")
  const [selectedLang, setSelectedLang] = useState("en")
  const [translatedSummaries, setTranslatedSummaries] = useState<{ short: string; medium: string; full: string } | null>(null)
  const [translating, setTranslating] = useState(false)
  const [exporting, setExporting] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const sections = parseSections(data.outline)
  const summaries = parseSummaries(data.summaries)
  const flashcards = parseFlashcards(data.flashcards)

  const activeSummaries = translatedSummaries || summaries

  const handleLanguageChange = async (lang: string) => {
    setSelectedLang(lang)
    if (lang === "en") { setTranslatedSummaries(null); return }
    setTranslating(true)
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materials: { short: summaries.short, medium: summaries.medium, full: summaries.full },
          language: lang,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      // Backend returns translated materials object — same shape as summaries
      setTranslatedSummaries({
        short: d.short || d.materials?.short || summaries.short,
        medium: d.medium || d.materials?.medium || summaries.medium,
        full: d.full || d.materials?.full || summaries.full,
      })
    } catch {
      setTranslatedSummaries(null)
    } finally {
      setTranslating(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        outline: data.outline,
        summaries: data.summaries,
        flashcards: data.flashcards,
      })
      const res = await fetch(`/api/export?${params.toString()}`)
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "study_pack.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  const seekVideo = (time: string) => {
    const seconds = timeToSeconds(time)
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${data.videoId}?start=${seconds}&autoplay=1`
    }
  }

  const SUMMARY_LABELS = { short: "90-Second Overview", medium: "5-Minute Deep Dive", full: "Full Notes" }
  const SUMMARY_DESCS = {
    short: "A quick snapshot — perfect for a 90-second refresh before class.",
    medium: "The key arguments and structure — ideal for pre-exam review.",
    full: "Complete notes on everything covered in the lecture."
  }

  return (
    <div className="relative z-10">

      {/* VIDEO */}
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
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-16">

        {/* Title */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground leading-tight">{data.title}</h1>
            {data.channel && <p className="text-sm text-muted-foreground font-mono mt-1">{data.channel}</p>}
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 shrink-0 px-4 py-2 rounded-2xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-40"
          >
            {exporting
              ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Download className="w-4 h-4" />
            }
            Export PDF
          </button>
        </div>

        {/* Topic Enrichment */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">About This Topic</h2>
            <p className="text-sm text-muted-foreground mt-1">Key facts about what you're studying.</p>
          </div>
          <TopicBubbles title={data.title} channel={data.channel} compressed={data.compressed} />
        </section>

        {/* Summary */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Summary</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Choose your depth — from a 90-second snapshot to full lecture notes.</p>

          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {(["short", "medium", "full"] as const).map((depth) => (
              <button key={depth} onClick={() => setSummaryDepth(depth)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${summaryDepth === depth
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}>
                {depth === "short" ? "90 sec" : depth === "medium" ? "5 min" : "Full"}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={selectedLang}
                onChange={e => handleLanguageChange(e.target.value)}
                disabled={translating}
                className="text-sm border border-border/50 rounded-xl px-3 py-1.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              {translating && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-1">{SUMMARY_LABELS[summaryDepth]}</p>
            <p className="text-xs text-muted-foreground font-mono mb-4">{SUMMARY_DESCS[summaryDepth]}</p>
            <div className="prose prose-neutral max-w-none text-foreground [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mt-4 [&>p]:leading-8 [&>p]:text-base [&>ul]:space-y-1 [&>ul>li]:text-base [&>strong]:font-semibold"><ReactMarkdown>{activeSummaries[summaryDepth]}</ReactMarkdown></div>
          </div>
        </section>

        {/* Outline */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Outline</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Every section with timestamped concepts. Click any timestamp to jump to that moment.</p>

          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="text-lg font-bold text-foreground">{section.title}</p>
                  {section.startTime && (
                    <button onClick={() => seekVideo(section.startTime!)}
                      className="font-mono text-xs text-accent-foreground bg-accent/30 px-2.5 py-1 rounded shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors">
                      {section.startTime}
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {section.bodyLines.map((line, j) => {
                    if (line.type === 'divider') return null
                    if (line.type === 'subheading') return (
                      <p key={j} className="text-sm font-semibold text-foreground mt-4 mb-1 border-l-2 border-primary/40 pl-3">{line.text}</p>
                    )
                    if (line.type === 'timestamp') return (
                      <div key={j} className="flex items-start gap-3">
                        {line.time && (
                          <button onClick={() => seekVideo(line.time!)}
                            className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-1 rounded shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors mt-0.5">
                            {line.time}
                          </button>
                        )}
                        <span className="text-sm text-foreground leading-relaxed">{line.text}</span>
                      </div>
                    )
                    if (line.type === 'important') return (
                      <div key={j} className="flex items-start gap-2 mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                        <span className="text-sm">⚠️</span>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{line.text}</p>
                      </div>
                    )
                    if (line.type === 'bullet') return (
                      <div key={j} className="flex items-start gap-2 ml-1">
                        <span className="text-primary mt-2 shrink-0 text-xs">▸</span>
                        <p className="text-sm text-foreground leading-relaxed">{line.text}</p>
                      </div>
                    )
                    return <p key={j} className="text-sm text-foreground leading-relaxed">{line.text}</p>
                  })}
                </div>

                {section.keyTerms.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border/30">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">Key Terms</p>
                    <div className="flex flex-wrap gap-2">
                      {section.keyTerms.map((t, k) => (
                        <span key={k} className="text-xs px-3 py-1 bg-accent/20 rounded-full text-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Flashcards */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Flashcards</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Tap a card to flip it. Use the arrows to move through the deck.</p>
          <FlashcardDeck cards={flashcards} onSeek={seekVideo} transcript={data.compressed} />
        </section>

        {/* Semantic Search */}
        <section className="pb-16">
          <SemanticSearch videoId={data.videoId} compressed={data.compressed} onSeek={seekVideo} />
        </section>

      </div>
    </div>
  )
}
