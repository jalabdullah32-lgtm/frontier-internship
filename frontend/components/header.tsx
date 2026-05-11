"use client"

import { Sparkles } from "lucide-react"

export function Header() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">NebulaStudy</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scrollTo("mission")}
            className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
          >
            Mission
          </button>
        </nav>

        <button
          onClick={() => scrollTo("get-started")}
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-[1.03]"
        >
          Get Started
        </button>
      </div>
    </header>
  )
}
