"use client"

const steps = [
  {
    number: "01",
    title: "Paste the link",
    description: "Grab the URL from any YouTube lecture, podcast, or educational video.",
  },
  {
    number: "02",
    title: "We do the magic",
    description: "Our AI watches, listens, and extracts all the important stuff in under a minute.",
  },
  {
    number: "03",
    title: "Study your way",
    description: "Browse summaries, flip through flashcards, or search for specific topics.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-24 bg-card/50">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-widest">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three steps to
            <br />
            <span className="italic font-normal text-muted-foreground">stress-free studying</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
              )}
              
              <div className="relative bg-card rounded-3xl border border-border/50 p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                {/* Number */}
                <div className="text-6xl font-bold text-muted/50 mb-4 font-mono">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-foreground font-semibold mb-2">
            Ready to try it out?
          </p>
          <p className="text-muted-foreground mb-6">
            It&apos;s free. No signup required. Just paste and go.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105"
          >
            Try it now — it&apos;s free
          </button>
        </div>
      </div>
    </section>
  )
}
