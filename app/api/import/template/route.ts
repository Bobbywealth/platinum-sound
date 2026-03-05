import { NextResponse } from 'next/server'

const template = [
  'First Name,Last Name,Email,Phone,Company,Address,City,Notes,First Visit,Status',
  'John,Doe,john@example.com,+1 555-0101,Acme Studios,123 Main St,New York,VIP client,2024-01-15,active',
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
