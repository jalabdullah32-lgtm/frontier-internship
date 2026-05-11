"use client"

import { ArrowRight } from "lucide-react"
import { TypingInput } from "@/components/typing-input"
import { PreviewCard } from "@/components/preview-card"

interface HeroProps {
  url: string
  setUrl: (url: string) => void
  onSubmit: (e: React.FormEvent) => void
  error?: string
}

export function Hero({ url, setUrl, onSubmit, error }: HeroProps) {
  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-[52fr_48fr] gap-10 lg:gap-14 items-center">

          {/* Left */}
          <div className="space-y-7">
            <div className="space-y-5 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-foreground">
                Turn any lecture into a
                <br />
                <span className="italic font-normal text-muted-foreground">complete study session.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Paste a YouTube lecture URL. Our AI agents build your outline, summaries, flashcards, and semantic search — so you can study the 20% that matters, not rewatch 100% of the video.
              </p>
            </div>

            <form onSubmit={onSubmit} className="animate-fade-in-up animation-delay-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <TypingInput value={url} onChange={setUrl} className="flex-1" />
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="h-14 w-14 shrink-0 rounded-2xl bg-primary flex items-center justify-center disabled:opacity-30 transition-all duration-300 hover:scale-[1.05] hover:bg-primary/90"
                >
                  <ArrowRight className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-destructive font-mono">{error}</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground font-mono">
                Public YouTube only · Private or restricted videos not supported
              </p>
            </form>
          </div>

          {/* Right — wider preview card */}
          <div className="hidden lg:block animate-fade-in-up animation-delay-300 w-full">
            <PreviewCard />
          </div>
        </div>
      </div>
    </section>
  )
}
