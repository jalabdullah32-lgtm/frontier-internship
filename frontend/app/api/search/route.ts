import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://frontier-internship-bbdwhyf2b4eggph8.centralus-01.azurewebsites.net"

export async function POST(req: NextRequest) {
  try {
    const { question, transcript } = await req.json()
    if (!question) return NextResponse.json({ error: "No question provided" }, { status: 400 })
    if (!transcript) return NextResponse.json({ error: "No transcript provided" }, { status: 400 })

    const res = await fetch(
      `${BACKEND_URL}/search?question=${encodeURIComponent(question)}&transcript=${encodeURIComponent(transcript)}`,
      { method: "POST" }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.detail || "Backend failed")
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Search failed" }, { status: 500 })
  }
}
