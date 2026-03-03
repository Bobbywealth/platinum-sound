import { NextResponse } from 'next/server'

const template = [
  'Name,Email,Phone,Genre,Total Revenue,Notes,Status',
  'Nova Lane,nova@example.com,+1 555-0101,R&B,12500,VIP recurring client,active',
].join('\n')

export async function GET() {
  return new NextResponse(template, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="client-import-template.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
