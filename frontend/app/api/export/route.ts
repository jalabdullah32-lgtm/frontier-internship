import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://frontier-internship-bbdwhyf2b4eggph8.centralus-01.azurewebsites.net"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const outline = searchParams.get("outline") || ""
    const summaries = searchParams.get("summaries") || ""
    const flashcards = searchParams.get("flashcards") || ""

    if (!outline && !summaries && !flashcards) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    const res = await fetch(
      `${BACKEND_URL}/export?outline=${encodeURIComponent(outline)}&summaries=${encodeURIComponent(summaries)}&flashcards=${encodeURIComponent(flashcards)}`,
      { method: "GET" }
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
