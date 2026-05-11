"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { FloatingElements } from "@/components/floating-elements"
import { ResultsView } from "@/components/results-view"

type AppState = "home" | "loading" | "results"

export default function Home() {
  const [url, setUrl] = useState("")
  const [state, setState] = useState<AppState>("home")
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setState("loading")
    setError("")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setResults(data)
      setState("results")
    } catch (err: any) {
      setError(err.message)
      setState("home")
    }
  }

  const handleBack = () => {
    setState("home")
    setResults(null)
    setUrl("")
  }

  if (state === "loading") {
    return (
      <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">Analyzing your lecture...</p>
            <p className="text-sm text-muted-foreground font-mono">Building outline · Generating flashcards · Summarizing</p>
          </div>
        </div>
      </main>
    )
  }

  if (state === "results" && results) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <FloatingElements />
        <Header />
        <ResultsView data={results} onBack={handleBack} />
        <Footer />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingElements />
      <Header />
      {error && (
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-4">
          <p className="text-sm text-destructive font-mono bg-destructive/10 px-4 py-2 rounded-xl">{error}</p>
        </div>
      )}
      <Hero url={url} setUrl={setUrl} onSubmit={handleSubmit} />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}
