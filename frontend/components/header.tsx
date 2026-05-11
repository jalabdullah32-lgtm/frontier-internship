"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="relative z-10 border-b border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            NebulaStudy
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
        </nav>

        {/* CTA */}
        <Button 
          variant="outline" 
          className="rounded-full px-6 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          Get Started
        </Button>
      </div>
    </header>
  )
}
