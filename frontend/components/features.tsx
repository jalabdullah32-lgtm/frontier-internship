"use client"

import { Clock, Users, Building2, Search } from "lucide-react"

const cards = [
  {
    icon: Clock,
    stat: "4× faster",
    title: "60 minutes of lecture, 15 minutes of study",
    description: "Timestamped flashcards and a searchable outline replace passive rewatching. Study what matters, not what you can find.",
  },
  {
    icon: Users,
    stat: "Inclusive by design",
    title: "Built for students who've been left out",
    description: "Language barriers, learning differences, missed lectures — NebulaStudy meets students where they are. Multilingual summaries, no penalty for falling behind.",
  },
  {
    icon: Building2,
    stat: "100+ institutions",
    title: "Video that compounds, not collects dust",
    description: "Every recorded lecture becomes a living study resource. Content that was archived becomes content that works every semester.",
  },
  {
    icon: Search,
    stat: "Plain English search",
    title: "Find the answer, not the timestamp",
    description: "Ask any question and get the exact moment in the lecture where it's answered. No scrubbing. No guessing which lecture covered what.",
  },
]

export function Features() {
  return (
    <section id="mission" className="relative z-10 py-24 border-y border-border/40 bg-card/30">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header — tighter, punchier */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Our mission</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.06] tracking-tight mb-6">
            Lectures get recorded.
            <br />
            <span className="italic font-normal text-muted-foreground">Almost none of it gets used.</span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Universities sit on terabytes of recorded content. Most of it gets watched once — by some people, sometimes — then archived. <span className="text-foreground font-medium">NebulaStudy unlocks it.</span> A student with a study companion like this can compress an hour of passive viewing into 15 minutes of active, targeted study. For students with learning differences or language barriers, that's not a convenience. That's the difference between passing and failing.
          </p>
        </div>

        {/* Cards — 2 col, tall, breathing room */}
        <div className="grid sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group bg-card rounded-3xl border border-border/50 p-8 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                  {card.stat}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 leading-snug">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
