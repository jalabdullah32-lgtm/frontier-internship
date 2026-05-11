"use client"

import { useState, useEffect, useRef } from "react"
import { Play } from "lucide-react"

const EXAMPLE_URLS = [
  "https://youtube.com/watch?v=MIT-Algorithms",
  "https://youtube.com/watch?v=CS50-Lecture",
  "https://youtube.com/watch?v=Physics-101",
  "https://youtube.com/watch?v=Organic-Chem",
]

interface TypingInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TypingInput({ value, onChange, className }: TypingInputProps) {
  const [placeholder, setPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [urlIndex, setUrlIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Don't animate if user has typed something
    if (value) return

    const currentUrl = EXAMPLE_URLS[urlIndex]

    if (isTyping) {
      // Typing phase
      if (charIndex < currentUrl.length) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentUrl.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, 50 + Math.random() * 30)
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, pause then delete
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      // Deleting phase
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentUrl.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        // Finished deleting, move to next URL
        const timeout = setTimeout(() => {
          setUrlIndex((urlIndex + 1) % EXAMPLE_URLS.length)
          setIsTyping(true)
        }, 500)
        return () => clearTimeout(timeout)
      }
    }
  }, [value, isTyping, urlIndex, charIndex])

  return (
    <div className={`relative ${className}`}>
      <Play className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        ref={inputRef}
        type="url"
        placeholder={placeholder || "Paste YouTube URL..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 h-14 rounded-2xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
      />
      {!value && (
        <span className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
          {placeholder}
          <span className="animate-pulse">|</span>
        </span>
      )}
    </div>
  )
}
