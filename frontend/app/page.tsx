"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { InputSection } from "@/components/input-section"
import { Footer } from "@/components/footer"
import { FloatingElements } from "@/components/floating-elements"
import { ResultsView } from "@/components/results-view"
import { GoalInput } from "@/components/goal-input"

type AppState = "home" | "goal" | "loading" | "results"

interface VideoMeta {
  videoId: string
  title: string
  channel: string
  thumbnailUrl: string
}

const LOADING_MESSAGES = [
  "Fetching transcript...",
  "Building outline...",
  "Generating flashcards...",
  "Summarizing lecture...",
  "Almost there...",
]

function MinimalNav() {
  return (
    <div className="relative z-10 flex justify-center py-6">
      <a href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">NebulaStudy</span>
      </a>
    </div>
  )
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [state, setState] = useState<AppState>("home")
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState("")
  const [loadingMsg, setLoadingMsg] = useState(0)

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setError("")

    try {
      const res = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid URL")
      setVideoMeta(data)
      setState("goal")
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoalSubmit = async (goal: string) => {
    if (!videoMeta) return
    setState("loading")

    let msgIndex = 0
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length
      setLoadingMsg(msgIndex)
    }, 3000)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, goal }),
      })
      const data = await res.json()
      clearInterval(interval)
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setResults({ ...data, ...videoMeta })
      setState("results")
    } catch (err: any) {
      clearInterval(interval)
      setError(err.message)
      setState("home")
    }
  }

  const handleBack = () => {
    setState("home")
    setResults(null)
    setVideoMeta(null)
    setUrl("")
    setError("")
  }

  // Loading screen
  if (state === "loading" && videoMeta) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <FloatingElements />
        <MinimalNav />
        <section className="relative z-10 py-10 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                    {videoMeta.title}
                  </h2>
                  {videoMeta.channel && (
                    <p className="text-sm text-muted-foreground font-mono">{videoMeta.channel}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl px-4 py-3 w-fit">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                  <p className="text-sm text-muted-foreground font-mono transition-all duration-500">
                    {LOADING_MESSAGES[loadingMsg]}
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="rounded-3xl overflow-hidden border border-border/50 shadow-xl aspect-video">
                  <img src={videoMeta.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="mt-3 px-1">
                  <p className="text-sm font-semibold text-foreground truncate">{videoMeta.title}</p>
                  {videoMeta.channel && (
                    <p className="text-xs text-muted-foreground font-mono">{videoMeta.channel}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Results screen
  if (state === "results" && results) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <FloatingElements />
        <MinimalNav />
        <ResultsView data={results} onBack={handleBack} />
        <Footer />
      </main>
    )
  }

  // Goal input screen
  if (state === "goal" && videoMeta) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <FloatingElements />
        <section className="relative z-10 py-10 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <GoalInput
                videoTitle={videoMeta.title}
                channel={videoMeta.channel}
                thumbnailUrl={videoMeta.thumbnailUrl}
                onSubmit={handleGoalSubmit}
              />
              <div className="hidden lg:block">
                <div className="rounded-3xl overflow-hidden border border-border/50 shadow-xl aspect-video">
                  <img src={videoMeta.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="mt-3 px-1">
                  <p className="text-sm font-semibold text-foreground truncate">{videoMeta.title}</p>
                  {videoMeta.channel && (
                    <p className="text-xs text-muted-foreground font-mono">{videoMeta.channel}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Home screen — new page flow
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingElements />
      <Header />
      <Hero url={url} setUrl={setUrl} onSubmit={handleUrlSubmit} error={error} />
      <Features />
      <InputSection url={url} setUrl={setUrl} onSubmit={handleUrlSubmit} error={error} />
      <Footer />
    </main>
  )
}
