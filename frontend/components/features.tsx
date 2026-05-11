"use client"

import { FileText, Layers, Search, Clock } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Smart Summaries",
    description: "Get the gist in seconds. We break down hour-long lectures into digestible bullet points.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Layers,
    title: "Auto Flashcards",
    description: "Study smarter, not harder. Flashcards are generated automatically from key concepts.",
    color: "bg-accent/50 text-accent-foreground",
  },
  {
    icon: Search,
    title: "Ask Anything",
    description: "\"What did they say about recursion?\" Just ask and get answers with timestamps.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Clock,
    title: "Timestamp Links",
    description: "Jump straight to the moment. Every concept is linked to its exact spot in the video.",
    color: "bg-accent/50 text-accent-foreground",
  },
]

export function Features() {
  return (
    <section id="features" className="relative z-10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-widest">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to
            <br />
            <span className="italic font-normal text-muted-foreground">actually understand lectures</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
