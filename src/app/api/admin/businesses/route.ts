import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'
import { randomUUID } from 'crypto'

const DB_URL = process.env.DATABASE_URL!

async function getDb() {
  const db = new Client({ connectionString: DB_URL, ssl: false })
  await db.connect()
  return db
}

export async function GET() {
  const db = await getDb()
  try {
    const res = await db.query(
      `SELECT id, public_id, legal_name, display_name, billing_email, billing_phone, status, created_at
       FROM business_account ORDER BY created_at DESC`
    )
    return NextResponse.json({ items: res.rows })
  } finally {
    await db.end()
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { legalName, displayName, billingEmail, billingPhone } = body
  if (!legalName || !displayName || !billingEmail) {
    return NextResponse.json({ error: 'legalName, displayName, billingEmail required' }, { status: 400 })
  }
  const db = await getDb()
  try {
    const res = await db.query(
      `INSERT INTO business_account (public_id, legal_name, display_name, billing_email, billing_phone, country_code, timezone, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'DE','Europe/Berlin','ACTIVE',NOW(),NOW()) RETURNING id, public_id`,
      [randomUUID(), legalName, displayName, billingEmail, billingPhone || null]
    )
    return NextResponse.json({ business: res.rows[0] })
  } finally {
    await db.end()
  }
}
