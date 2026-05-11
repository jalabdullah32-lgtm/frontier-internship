"use client"

import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/50 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              NebulaStudy
            </span>
          </a>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NebulaStudy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
