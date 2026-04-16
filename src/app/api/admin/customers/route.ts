import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: false, error: 'Legacy admin customers endpoint retired' }, { status: 410 })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: false, error: 'Legacy admin customers endpoint retired' }, { status: 410 })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: false, error: 'Legacy admin customers endpoint retired' }, { status: 410 })
}
