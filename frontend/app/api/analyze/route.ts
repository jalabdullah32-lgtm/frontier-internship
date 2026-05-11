import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://frontier-internship-bbdwhyf2b4eggph8.centralus-01.azurewebsites.net"

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export async function POST(req: NextRequest) {
  try {
    const { url, goal } = await req.json()
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    if (!goal) return NextResponse.json({ error: "No goal provided" }, { status: 400 })

    const videoId = extractVideoId(url)
    if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })

    const res = await fetch(
      `${BACKEND_URL}/analyze?url=${encodeURIComponent(url)}&goal=${encodeURIComponent(goal)}`,
      { method: "POST" }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.detail || "Backend failed")
    }

    const data = await res.json()

    return NextResponse.json({
      videoId,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      outline: data.outline || "",
      summaries: data.summaries || "",
      flashcards: data.flashcards || "",
      compressed: data.compressed || "",
    })
  } catch (err: any) {
    console.error("Analyze error:", err)
    return NextResponse.json({ error: err.message || "Failed to analyze video" }, { status: 500 })
  }
}
