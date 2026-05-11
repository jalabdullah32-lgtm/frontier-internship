import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://frontier-internship-bbdwhyf2b4eggph8.centralus-01.azurewebsites.net"

export async function POST(req: NextRequest) {
  try {
    const { card, transcript } = await req.json()
    if (!card) return NextResponse.json({ error: "No card provided" }, { status: 400 })
    if (!transcript) return NextResponse.json({ error: "No transcript provided" }, { status: 400 })

    const res = await fetch(
      `${BACKEND_URL}/regenerate?card=${encodeURIComponent(card)}&transcript=${encodeURIComponent(transcript)}`,
      { method: "POST" }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.detail || "Backend failed")
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Regenerate failed" }, { status: 500 })
  }
}
