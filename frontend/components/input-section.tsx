"use client"

import { ArrowRight, List, FileText, CreditCard, Search } from "lucide-react"
import { TypingInput } from "@/components/typing-input"

const GOALS = [
  "Prep for my exam",
  "I missed this lecture",
  "Build flashcards",
  "Quick review",
]

const capabilities = [
  {
    icon: List,
    title: "Outline + timestamps",
    description: "Every section linked back to the exact moment. Click any timestamp to jump straight there.",
  },
  {
    icon: FileText,
    title: "Three summary depths",
    description: "90 seconds for a quick refresh. 5 minutes before an exam. Full notes when you need everything.",
  },
  {
    icon: CreditCard,
    title: "Flashcard deck",
    description: "Active recall beats passive reading. Each card is tied to the lecture moment that proves the answer.",
  },
  {
    icon: Search,
    title: "Semantic search",
    description: "Ask anything in plain English. Get the exact timestamp where it's answered.",
  },
]

interface InputSectionProps {
  url: string
  setUrl: (url: string) => void
  onSubmit: (e: React.FormEvent) => void
  error?: string
}

export function InputSection({ url, setUrl, onSubmit, error }: InputSectionProps) {
  return (
    <section id="get-started" className="relative z-10 py-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* Heading */}
        <div className="mb-12">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Ready to start</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Drop a lecture.
            <br />
            <span className="italic font-normal text-muted-foreground">Get instant notes.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
            Paste any public YouTube lecture below. Tell us what you need — we'll tailor the outline, summaries, and flashcards to match.
          </p>
        </div>

        {/* Input + chips stacked, then full-width capability cards below */}
        <form id="url-input" onSubmit={onSubmit} className="mb-10">
          <div className="flex items-center gap-3 max-w-2xl">
            <TypingInput value={url} onChange={setUrl} className="flex-1" />
            <button
              type="submit"
              disabled={!url.trim()}
              className="h-14 w-14 shrink-0 rounded-2xl bg-primary flex items-center justify-center disabled:opacity-30 transition-all duration-300 hover:scale-[1.05] hover:bg-primary/90"
            >
              <ArrowRight className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-destructive font-mono">{error}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            {GOALS.map((g) => (
              <span key={g} className="text-xs px-4 py-2 rounded-full border border-border/60 text-muted-foreground bg-card/60">
                {g}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground font-mono">
            Public YouTube only · Takes about 2 minutes
          </p>
        </form>

        {/* Capability cards — full width 4-col, taller */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap) => (
            <div key={cap.title} className="bg-card rounded-3xl border border-border/50 p-7 hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
                <cap.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-base font-semibold text-foreground mb-2 leading-snug">{cap.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
