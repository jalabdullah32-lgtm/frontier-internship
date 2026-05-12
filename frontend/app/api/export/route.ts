import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://frontier-internship-bbdwhyf2b4eggph8.centralus-01.azurewebsites.net"

export async function POST(req: NextRequest) {
  try {
    const { outline, summaries, flashcards } = await req.json()

    if (!outline && !summaries && !flashcards) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    const res = await fetch(
      `${BACKEND_URL}/export`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outline, summaries, flashcards }),
      }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.detail || "Backend failed")
    }

    const pdfBuffer = await res.arrayBuffer()
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=study_pack.pdf",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Export failed" }, { status: 500 })
  }
}
