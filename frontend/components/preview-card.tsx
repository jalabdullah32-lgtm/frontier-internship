"use client"

import { CheckCircle2 } from "lucide-react"

export function PreviewCard() {
  return (
    <div className="relative">
      {/* Main card */}
      <div className="bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-border/30 bg-muted/30">
          <div className="w-14 h-10 rounded-lg bg-muted flex items-center justify-center">
            <div className="w-0 h-0 border-l-[6px] border-l-primary border-y-[4px] border-y-transparent ml-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              MIT 6.006: Introduction to Algorithms
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              1:23:45 · Lecture 3
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Processed
          </div>
        </div>

        {/* Key concepts */}
        <div className="p-5 border-b border-border/30">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
            Key Concepts
          </p>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2 text-sm text-foreground">
              <span className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-0.5 rounded">2:15</span>
              Binary Search Trees fundamentals
            </div>
            <div className="flex items-baseline gap-2 text-sm text-foreground">
              <span className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-0.5 rounded">14:30</span>
              AVL tree rotations explained
            </div>
            <div className="flex items-baseline gap-2 text-sm text-foreground">
              <span className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-0.5 rounded">32:10</span>
              Time complexity analysis
            </div>
          </div>
        </div>

        {/* Flashcard preview */}
        <div className="p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
            Sample Flashcard
          </p>
          <div className="bg-muted/50 rounded-2xl p-4 border border-border/30">
            <p className="text-sm font-semibold text-foreground mb-2">
              What is the time complexity of searching in a balanced BST?
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              tap to reveal · 1 of 24 cards
            </p>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce-gentle">
        24 cards generated
      </div>
    </div>
  )
}
