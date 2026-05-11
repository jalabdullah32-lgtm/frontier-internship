"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TypingInput } from "@/components/typing-input"
import { PreviewCard } from "@/components/preview-card"

interface HeroProps {
  url: string
  setUrl: (url: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function Hero({ url, setUrl, onSubmit }: HeroProps) {
  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Copy */}
          <div className="space-y-8">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-foreground animate-fade-in-up">
              Drop a lecture.
              <br />
              <span className="italic font-normal text-muted-foreground">Get instant notes.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed animate-fade-in-up animation-delay-100">
              Paste any YouTube lecture and we&apos;ll turn it into summaries, flashcards, and searchable notes. No more rewinding. No more stress.
            </p>

            {/* URL Input */}
            <form onSubmit={onSubmit} className="animate-fade-in-up animation-delay-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <TypingInput
                  value={url}
                  onChange={setUrl}
                  className="flex-1"
                />
                <Button 
                  type="submit"
                  size="lg"
                  className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group transition-all duration-300 hover:scale-[1.02]"
                >
                  Let&apos;s go
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground font-mono">
                Public YouTube only · Private or restricted videos not supported
              </p>
            </form>
          </div>

          {/* Right side - Preview */}
          <div className="hidden lg:block animate-fade-in-up animation-delay-300">
            <PreviewCard />
          </div>
        </div>
      </div>
    </section>
  )
}
