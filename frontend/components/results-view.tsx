"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen, Layers, CreditCard, Tag, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Concept {
  time: string
  title: string
  description: string
}

interface Flashcard {
  question: string
  answer: string
}

interface KeyTerm {
  term: string
  definition: string
}

interface ResultsData {
  title: string
  duration: string
  videoId: string
  thumbnailUrl: string
  summary_short: string
  summary_medium: string
  outline: Concept[]
  flashcards: Flashcard[]
  key_terms: KeyTerm[]
}

interface ResultsViewProps {
  data: ResultsData
  onBack: () => void
}

type Tab = "summary" | "outline" | "flashcards" | "terms"

function FlashcardItem({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      className="cursor-pointer bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300"
      onClick={() => setFlipped(!flipped)}
    >
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
        {flipped ? "Answer" : "Question — tap to reveal"}
      </p>
      <p className="text-sm font-semibold text-foreground leading-relaxed">
        {flipped ? card.answer : card.question}
      </p>
    </div>
  )
}

export function ResultsView({ data, onBack }: ResultsViewProps) {
  const [tab, setTab] = useState<Tab>("summary")
  const [summaryDepth, setSummaryDepth] = useState<"short" | "medium">("short")

  const tabs = [
    { id: "summary" as Tab, label: "Summary", icon: BookOpen },
    { id: "outline" as Tab, label: "Outline", icon: Layers },
    { id: "flashcards" as Tab, label: "Flashcards", icon: CreditCard },
    { id: "terms" as Tab, label: "Key Terms", icon: Tag },
  ]

  return (
    <div className="relative z-10 py-10">
      <div className="mx-auto max-w-4xl px-6">

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Video header */}
        <div className="flex gap-5 mb-8 bg-card border border-border/50 rounded-2xl p-5">
          <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0">
            <img src={data.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground mb-1 leading-snug">{data.title}</h1>
            <p className="text-xs text-muted-foreground font-mono">{data.duration}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-4">

          {tab === "summary" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={summaryDepth === "short" ? "default" : "outline"}
                  onClick={() => setSummaryDepth("short")}
                  className="rounded-full text-xs"
                >
                  90 sec read
                </Button>
                <Button
                  size="sm"
                  variant={summaryDepth === "medium" ? "default" : "outline"}
                  onClick={() => setSummaryDepth("medium")}
                  className="rounded-full text-xs"
                >
                  5 min read
                </Button>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <p className="text-sm text-foreground leading-relaxed">
                  {summaryDepth === "short" ? data.summary_short : data.summary_medium}
                </p>
              </div>
            </div>
          )}

          {tab === "outline" && (
            <div className="space-y-3">
              {data.outline.map((item, i) => (
                <div key={i} className="flex gap-4 bg-card border border-border/50 rounded-2xl p-4">
                  <span className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-1 rounded shrink-0 h-fit mt-0.5">
                    {item.time}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "flashcards" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-mono">Tap any card to reveal the answer</p>
              {data.flashcards.map((card, i) => (
                <FlashcardItem key={i} card={card} />
              ))}
            </div>
          )}

          {tab === "terms" && (
            <div className="space-y-3">
              {data.key_terms.map((item, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-foreground mb-1">{item.term}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
