import { randomUUID } from 'crypto'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { ClientStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type ParsedRow = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  companyName?: string
  address?: string
  city?: string
  notes?: string
  firstVisit?: string
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

  // Try to find first/last name from "name" field or separate columns
  const fullName = normalized.name || normalized.fullname || ''
  const nameParts = fullName.split(' ')
  const firstName = normalized.firstname || nameParts[0] || ''
  const lastName = normalized.lastname || nameParts.slice(1).join(' ') || ''

  return {
    firstName,
    lastName,
    email: normalized.email,
    phone: normalized.phone,
    companyName: normalized.companyname || normalized.company || normalized.label || '',
    address: normalized.address || '',
    city: normalized.city || '',
    notes: normalized.notes || normalized.memo || '',
    firstVisit: normalized.firstvisit || normalized.firstvisitdate || '',
    status: normalized.status || 'active',
  }
}

function parseStatus(status?: string): ClientStatus {
  const normalized = status?.trim().toLowerCase()
  if (normalized === 'active') return ClientStatus.ACTIVE
  if (normalized === 'completed') return ClientStatus.COMPLETED
  if (normalized === 'pending' || normalized === 'inactive') return ClientStatus.PENDING
  return ClientStatus.ACTIVE
}

function parseDate(value?: string): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return isNaN(parsed.getTime()) ? null : parsed
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
      const firstName = row.firstName?.trim()
      const lastName = row.lastName?.trim()

      if (!firstName || !lastName) {
        errors.push(`Row ${lineNumber}: First name and Last name are required.`)
        continue
      }

      const email = row.email?.trim().toLowerCase() || `imported-${randomUUID()}@no-email.local`
      const firstVisit = parseDate(row.firstVisit)

      try {
        const existingClient = row.email?.trim()
          ? await prisma.client.findUnique({ where: { email } })
          : null

        const client = existingClient
          ? await prisma.client.update({
              where: { id: existingClient.id },
              data: {
                firstName,
                lastName,
                email,
                phone: row.phone?.trim() || null,
                companyName: row.companyName?.trim() || null,
                address: row.address?.trim() || null,
                city: row.city?.trim() || null,
                notes: row.notes?.trim() || null,
                firstVisit,
                status: parseStatus(row.status),
              },
            })
          : await prisma.client.create({
              data: {
                firstName,
                lastName,
                email,
                phone: row.phone?.trim() || null,
                companyName: row.companyName?.trim() || null,
                address: row.address?.trim() || null,
                city: row.city?.trim() || null,
                notes: row.notes?.trim() || null,
                firstVisit,
                status: parseStatus(row.status),
              },
            })

        if (existingClient) {
          updated += 1
        } else {
          imported += 1
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
