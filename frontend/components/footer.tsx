"use client"

import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 py-20 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-8 text-center">

          {/* CTA block */}
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">Ready to try it?</p>
            <p className="text-muted-foreground text-sm">No signup required. Just paste and go.</p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById("get-started")
              if (el) el.scrollIntoView({ behavior: "smooth" })
            }}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105"
          >
            Try it now — it is free
          </button>

          {/* Logo — clicks back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group mt-4 opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">NebulaStudy</span>
          </button>

          <p className="text-xs text-muted-foreground font-mono">
            © 2025 NebulaStudy
          </p>
        </div>
      </div>
    </footer>
  )
}
