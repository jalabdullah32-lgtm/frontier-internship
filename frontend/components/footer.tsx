"use client"

import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 py-10 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">NebulaStudy</span>
          </button>
          <p className="text-xs text-muted-foreground font-mono">© 2025 NebulaStudy</p>
        </div>
      </div>
    </footer>
  )
}
