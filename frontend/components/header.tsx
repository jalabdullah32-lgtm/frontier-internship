"use client"

import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0">
      <div className="mx-auto max-w-6xl px-12 py-5 flex items-center">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">NebulaStudy</span>
        </a>
      </div>
    </header>
  )
}
