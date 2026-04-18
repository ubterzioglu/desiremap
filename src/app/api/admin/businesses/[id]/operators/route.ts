import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'

const DB_URL = process.env.DATABASE_URL!

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: businessId } = await params
  const { email, password, displayName } = await request.json()

  if (!email || !password || !displayName) {
    return NextResponse.json({ error: 'email, password, displayName required' }, { status: 400 })
  }

  const db = new Client({ connectionString: DB_URL, ssl: false })
  await db.connect()
  try {
    const normalized = email.toLowerCase().trim()

    const existing = await db.query(
      'SELECT id FROM operator_account WHERE login_email_normalized = $1', [normalized]
    )
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'E-Mail bereits vergeben' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const res = await db.query(
      `INSERT INTO operator_account
       (public_id, login_email_raw, login_email_normalized, display_name, password_hash, status, require_password_reset, failed_login_count, created_at, updated_at, password_changed_at)
       VALUES ($1,$2,$3,$4,$5,'ACTIVE',true,0,NOW(),NOW(),NOW()) RETURNING id, public_id`,
      [randomUUID(), email.trim(), normalized, displayName, passwordHash]
    )
    const operatorId = res.rows[0].id

    // Link operator to business via business_account
    // Also assign SUPER_ADMIN global role if role_definition exists
    const roleRow = await db.query(
      `SELECT id FROM role_definition WHERE code = 'SUPER_ADMIN' OR name ILIKE '%admin%' LIMIT 1`
    )
    if (roleRow.rows.length > 0) {
      await db.query(
        `INSERT INTO operator_global_role_assignment (operator_account_id, role_id, is_active, assigned_at)
         VALUES ($1,$2,true,NOW()) ON CONFLICT DO NOTHING`,
        [operatorId, roleRow.rows[0].id]
      )
    }

    return NextResponse.json({ operator: res.rows[0], businessId })
  } finally {
    await db.end()
  }
}
