import { NextRequest, NextResponse } from "next/server"

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    const videoId = extractVideoId(url)
    if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })

    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    const data = await res.json()

    return NextResponse.json({
      videoId,
      title: data.title || "YouTube Lecture",
      channel: data.author_name || "",
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 })
  }
}
