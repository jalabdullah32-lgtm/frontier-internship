"use client"

import { useState, useEffect } from "react"

const VIDEOS = [
  {
    id: "OHdch7qP6pA",
    title: "Introduction to Machine Learning",
    duration: "58:12 · Lecture 1",
    concepts: [
      { time: "3:20", text: "Supervised vs unsupervised learning" },
      { time: "18:45", text: "Gradient descent explained" },
      { time: "41:00", text: "Overfitting and regularization" },
    ],
    flashcard: "What is the difference between bias and variance in ML models?",
    cards: 31,
  },
  {
    id: "ET8FzJ6Hhz4",
    title: "Cloud Computing with Husein Sharaf",
    duration: "42:30 · Cloud Fundamentals",
    concepts: [
      { time: "5:10", text: "Cloud service models: IaaS, PaaS, SaaS" },
      { time: "19:22", text: "Virtual machines vs containers" },
      { time: "33:05", text: "Auto-scaling and load balancing" },
    ],
    flashcard: "What are the three main cloud service models and their differences?",
    cards: 27,
  },
  {
    id: "scL2pbCgMRQ",
    title: "Cloud Networking Fundamentals",
    duration: "11:49 · Networking",
    concepts: [
      { time: "1:01", text: "The 80/20 rule for cloud learning" },
      { time: "3:35", text: "Load balancers and traffic distribution" },
      { time: "7:56", text: "DB-subnet: block all except app-subnet" },
    ],
    flashcard: "What is the role of a security group in a cloud subnet?",
    cards: 18,
  },
  {
    id: "YwFmQFe2fHw",
    title: "Narcolepsy: Clinical Overview",
    duration: "1:04:20 · Medical Lecture",
    concepts: [
      { time: "6:15", text: "REM sleep dysregulation mechanisms" },
      { time: "24:40", text: "Cataplexy triggers and management" },
      { time: "47:30", text: "Orexin deficiency and diagnosis" },
    ],
    flashcard: "What neurotransmitter deficiency is linked to narcolepsy type 1?",
    cards: 42,
  },
]

export function PreviewCard() {
  const [index, setIndex] = useState(0)
  const video = VIDEOS[index]

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % VIDEOS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative pb-6">
      <div className="bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-500">

        {/* Thumbnail — fixed height */}
        <div className="relative w-full h-44 bg-muted overflow-hidden">
          <img
            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
            alt="thumbnail"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
            <p className="text-sm font-semibold text-white truncate">{video.title}</p>
            <p className="text-xs text-white/70 font-mono">{video.duration}</p>
          </div>
        </div>

        {/* Key concepts — fixed height to prevent shift */}
        <div className="p-5 border-b border-border/30 h-[130px]">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
            Key Concepts
          </p>
          <div className="space-y-2">
            {video.concepts.map((c, i) => (
              <div key={i} className="flex items-baseline gap-2 text-sm text-foreground">
                <span className="font-mono text-xs text-accent-foreground bg-accent/30 px-2 py-0.5 rounded shrink-0">
                  {c.time}
                </span>
                <span className="truncate">{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flashcard — fixed height to prevent shift */}
        <div className="p-5 h-[130px]">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
            Sample Flashcard
          </p>
          <div className="bg-muted/50 rounded-2xl p-4 border border-border/30">
            <p className="text-sm font-semibold text-foreground mb-2 line-clamp-2">
              {video.flashcard}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              tap to reveal · 1 of {video.cards} cards
            </p>
          </div>
        </div>

        {/* Dots inside card */}
        <div className="flex justify-center gap-2 pb-5">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "bg-primary w-4" : "bg-border w-2"}`}
            />
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-2 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce-gentle whitespace-nowrap">
        {video.cards} cards generated
      </div>
    </div>
  )
}
