"use client"

import { useState, useEffect, useRef } from "react"
import { Play } from "lucide-react"

const EXAMPLE_URLS = [
  "https://www.youtube.com/watch?v=OHdch7qP6pA",
  "https://www.youtube.com/watch?v=ET8FzJ6Hhz4",
  "https://www.youtube.com/watch?v=scL2pbCgMRQ",
  "https://www.youtube.com/watch?v=YwFmQFe2fHw",
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
    if (value) return

    const currentUrl = EXAMPLE_URLS[urlIndex]

    if (isTyping) {
      if (charIndex < currentUrl.length) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentUrl.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, 50 + Math.random() * 30)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentUrl.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 30)
        return () => clearTimeout(timeout)
      } else {
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
        className="w-full pl-12 pr-4 h-14 rounded-2xl bg-white border border-border/50 text-black placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
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
