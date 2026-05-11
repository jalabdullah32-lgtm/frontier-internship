"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

const GOALS = [
  "Prepare for my upcoming exam on this topic",
  "Catch up on a lecture I missed in class",
  "Build flashcards for long-term retention",
  "Quick review before tomorrow's lecture",
]

interface GoalInputProps {
  videoTitle: string
  channel: string
  thumbnailUrl: string
  onSubmit: (goal: string) => void
}

export function GoalInput({ videoTitle, channel, thumbnailUrl, onSubmit }: GoalInputProps) {
  const [goal, setGoal] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [rotationIndex, setRotationIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (goal) return
    const current = GOALS[rotationIndex]
    if (isTyping) {
      if (charIndex < current.length) {
        const timeout = setTimeout(() => {
          setPlaceholder(current.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, 40 + Math.random() * 20)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setPlaceholder(current.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 20)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setRotationIndex((rotationIndex + 1) % GOALS.length)
          setIsTyping(true)
        }, 300)
        return () => clearTimeout(timeout)
      }
    }
  }, [goal, isTyping, rotationIndex, charIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim()) return
    onSubmit(goal.trim())
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <a href="/" className="flex items-center gap-2 group w-fit">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">NebulaStudy</span>
      </a>

      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          What&apos;s your goal?
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Tell us what you need — we&apos;ll tailor the notes, flashcards, and outline to match.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full pl-5 pr-14 h-14 rounded-2xl bg-white border border-border/50 text-black placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
            autoFocus
          />
          {!goal && (
            <span className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-muted-foreground/70">
              {placeholder}<span className="animate-pulse">|</span>
            </span>
          )}
          <button
            type="submit"
            disabled={!goal.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105"
          >
            <ArrowRight className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g, i) => (
            <button key={i} type="button" onClick={() => setGoal(g)}
              className="text-xs px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-all">
              {g}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}
