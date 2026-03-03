import { randomUUID } from 'crypto'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { ClientStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type ParsedRow = {
  name: string
  email?: string
  phone?: string
  genre?: string
  totalRevenue?: string
  notes?: string
  status?: string
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function mapRow(row: Record<string, unknown>): ParsedRow {
  const normalized = Object.entries(row).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[normalizeHeader(key)] = String(value ?? '').trim()
    return acc
  }, {})

  return {
    name: normalized.name ?? '',
    email: normalized.email,
    phone: normalized.phone,
    genre: normalized.genre,
    totalRevenue: normalized.totalrevenue,
    notes: normalized.notes,
    status: normalized.status,
  }
}

function parseStatus(status?: string): ClientStatus {
  const normalized = status?.trim().toLowerCase()
  if (normalized === 'active') return ClientStatus.ACTIVE
  if (normalized === 'completed') return ClientStatus.COMPLETED
  if (normalized === 'pending' || normalized === 'inactive') return ClientStatus.PENDING
  return ClientStatus.ACTIVE
}

function parseRevenue(value?: string): number | null {
  if (!value) return null
  const parsed = Number(value.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}

async function parseFile(file: File): Promise<ParsedRow[]> {
  const extension = file.name.split('.').pop()?.toLowerCase()
  const buffer = Buffer.from(await file.arrayBuffer())

  if (extension === 'csv') {
    const parsed = Papa.parse<Record<string, unknown>>(buffer.toString('utf8'), {
      header: true,
      skipEmptyLines: true,
    })
    return parsed.data.map(mapRow)
  }

  if (extension === 'xlsx') {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const firstSheet = workbook.SheetNames[0]
    if (!firstSheet) return []
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheet], { defval: '' })
    return rows.map(mapRow)
  }

  throw new Error('Only CSV and XLSX files are supported.')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'A file is required.' }, { status: 400 })
    }

    const rows = await parseFile(file)
    const errors: string[] = []
    let imported = 0
    let updated = 0

    for (const [index, row] of rows.entries()) {
      const lineNumber = index + 2
      const name = row.name?.trim()

      if (!name) {
        errors.push(`Row ${lineNumber}: Name is required.`)
        continue
      }

      const email = row.email?.trim().toLowerCase() || `imported-${randomUUID()}@no-email.local`
      const revenue = parseRevenue(row.totalRevenue)

      try {
        const existingClient = row.email?.trim()
          ? await prisma.client.findUnique({ where: { email } })
          : null

        const client = existingClient
          ? await prisma.client.update({
              where: { id: existingClient.id },
              data: {
                name,
                email,
                phone: row.phone?.trim() || null,
                genre: row.genre?.trim() || null,
                notes: row.notes?.trim() || null,
                status: parseStatus(row.status),
              },
            })
          : await prisma.client.create({
              data: {
                name,
                email,
                phone: row.phone?.trim() || null,
                genre: row.genre?.trim() || null,
                notes: row.notes?.trim() || null,
                status: parseStatus(row.status),
              },
            })

        if (existingClient) {
          updated += 1
        } else {
          imported += 1
        }

        if (revenue !== null) {
          await prisma.clientRevenue.upsert({
            where: { clientId: client.id },
            create: {
              clientId: client.id,
              totalRevenue: revenue,
            },
            update: {
              totalRevenue: revenue,
            },
          })
        }
      } catch (rowError) {
        const message = rowError instanceof Error ? rowError.message : 'Unexpected error'
        errors.push(`Row ${lineNumber}: ${message}`)
      }
    }

    return NextResponse.json({ imported, updated, errors })
  } catch (error) {
    console.error('Error importing clients:', error)
    return NextResponse.json({ error: 'Failed to import clients' }, { status: 500 })
  }
}
