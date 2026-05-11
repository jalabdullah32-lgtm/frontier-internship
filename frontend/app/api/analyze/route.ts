import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

async function getVideoTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    const data = await res.json()
    return data.title || "YouTube Lecture"
  } catch {
    return "YouTube Lecture"
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 })

    const videoId = extractVideoId(url)
    if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })

    const title = await getVideoTitle(videoId)
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    const prompt = `You are an expert academic study assistant. Based on this YouTube lecture titled "${title}", generate detailed study materials.

Return ONLY valid JSON with this exact structure:
{
  "title": "${title}",
  "duration": "estimated duration like '45:00'",
  "summary_short": "A 2-3 sentence summary a student can read in 90 seconds",
  "summary_medium": "A 5-6 sentence summary covering the key points in about 5 minutes of reading",
  "outline": [
    { "time": "0:00", "title": "Section title", "description": "What this section covers" },
    { "time": "5:30", "title": "Section title", "description": "What this section covers" }
  ],
  "flashcards": [
    { "question": "Question here?", "answer": "Answer here" },
    { "question": "Question here?", "answer": "Answer here" }
  ],
  "key_terms": [
    { "term": "Term", "definition": "Definition" }
  ]
}

Generate 6-8 outline sections, 6 flashcards, and 5 key terms. Make everything specific and accurate to the topic. Return only JSON, no markdown, no backticks.`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const clean = text.replace(/```json|```/g, "").trim()
    const data = JSON.parse(clean)

    return NextResponse.json({ ...data, videoId, thumbnailUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to analyze video" }, { status: 500 })
  }
}
