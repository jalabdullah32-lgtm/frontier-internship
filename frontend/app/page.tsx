"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { FloatingElements } from "@/components/floating-elements"

export default function Home() {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Submitted URL:", url)
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingElements />
      <Header />
      <Hero url={url} setUrl={setUrl} onSubmit={handleSubmit} />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}
