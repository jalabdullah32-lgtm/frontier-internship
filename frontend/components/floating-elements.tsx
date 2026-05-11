"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Floating shapes */}
      <div 
        className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-accent/30 blur-sm animate-float"
        style={{ animationDelay: "0s" }}
      />
      <div 
        className="absolute top-40 right-[15%] w-24 h-24 rounded-2xl bg-primary/5 rotate-12 animate-float-slow"
        style={{ animationDelay: "1s" }}
      />
      <div 
        className="absolute bottom-40 left-[20%] w-12 h-12 rounded-xl bg-accent/20 -rotate-6 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div 
        className="absolute top-[60%] right-[8%] w-20 h-20 rounded-full bg-primary/5 animate-float-slow"
        style={{ animationDelay: "0.5s" }}
      />
      <div 
        className="absolute top-[30%] left-[5%] w-8 h-8 rounded-lg bg-accent/25 rotate-45 animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      
      {/* Sparkle dots */}
      <div className="absolute top-32 right-[25%] w-2 h-2 rounded-full bg-primary/30 animate-pulse" />
      <div className="absolute top-[50%] left-[12%] w-2 h-2 rounded-full bg-accent/50 animate-pulse" style={{ animationDelay: "0.3s" }} />
      <div className="absolute bottom-32 right-[30%] w-2 h-2 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: "0.6s" }} />
    </div>
  )
}
