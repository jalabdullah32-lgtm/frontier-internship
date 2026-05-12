import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://frontier-internship-bbdwhyf2b4eggph8.centralus-01.azurewebsites.net"

export async function POST(req: NextRequest) {
  try {
    const { materials, language } = await req.json()
    if (!materials) return NextResponse.json({ error: "No materials provided" }, { status: 400 })
    if (!language) return NextResponse.json({ error: "No language provided" }, { status: 400 })

    const res = await fetch(
      `${BACKEND_URL}/translate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materials, language }),
      }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.detail || "Backend failed")
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Translation failed" }, { status: 500 })
  }
}
