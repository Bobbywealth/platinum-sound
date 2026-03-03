"use client"

import { useMemo, useState } from "react"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ImportRow = {
  name: string
  email?: string
  phone?: string
  genre?: string
  totalRevenue?: string
  notes?: string
  status?: string
}

type ImportSummary = {
  imported: number
  updated: number
  errors: string[]
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function mapRow(row: Record<string, unknown>): ImportRow {
  const normalized = Object.entries(row).reduce<Record<string, string>>((acc, [key, value]) => {
    const normalizedKey = normalizeHeader(key)
    acc[normalizedKey] = String(value ?? "").trim()
    return acc
  }, {})

  return {
    name: normalized.name ?? "",
    email: normalized.email,
    phone: normalized.phone,
    genre: normalized.genre,
    totalRevenue: normalized.totalrevenue,
    notes: normalized.notes,
    status: normalized.status,
  }
}

async function parseSpreadsheet(file: File): Promise<ImportRow[]> {
  const extension = file.name.split(".").pop()?.toLowerCase()
  const buffer = await file.arrayBuffer()

  if (extension === "csv") {
    const csvText = new TextDecoder().decode(buffer)
    const parsed = Papa.parse<Record<string, unknown>>(csvText, {
      header: true,
      skipEmptyLines: true,
    })
    return parsed.data.map(mapRow)
  }

  if (extension === "xlsx") {
    const workbook = XLSX.read(buffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) return []
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: "" })
    return rows.map(mapRow)
  }

  return []
}

export function ImportClientsDialog({
  open,
  onOpenChange,
  onImported,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported: (rows: ImportRow[]) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [rows, setRows] = useState<ImportRow[]>([])
  const [summary, setSummary] = useState<ImportSummary | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewRows = useMemo(() => rows.slice(0, 5), [rows])

  async function handleFileChange(selectedFile: File | null) {
    setSummary(null)
    setError(null)
    setRows([])

    if (!selectedFile) {
      setFile(null)
      return
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase()
    if (!extension || !["csv", "xlsx"].includes(extension)) {
      setError("Please upload a .csv or .xlsx file.")
      setFile(null)
      return
    }

    setFile(selectedFile)

    try {
      const parsedRows = await parseSpreadsheet(selectedFile)
      setRows(parsedRows)
      if (!parsedRows.length) {
        setError("No rows were found in the uploaded file.")
      }
    } catch {
      setError("Unable to parse file. Please verify it matches the template.")
    }
  }

  async function handleImport() {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/import/clients", {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json()) as ImportSummary | { error: string }

      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Import failed")
      }

      setSummary(payload as ImportSummary)
      onImported(rows)
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed")
    } finally {
      setIsUploading(false)
    }
  }

  function handleClose(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setFile(null)
      setRows([])
      setSummary(null)
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Clients</DialogTitle>
          <DialogDescription>Upload a CSV or Excel file to bulk import clients and revenue.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="file"
              accept=".csv,.xlsx"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
            <Button variant="outline" asChild>
              <a href="/api/import/template" download>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </a>
            </Button>
          </div>

          {previewRows.length > 0 && (
            <div className="rounded-md border overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Genre</th>
                    <th className="p-2 text-left">Total Revenue</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, index) => (
                    <tr key={`${row.email ?? row.name}-${index}`} className="border-t">
                      <td className="p-2">{row.name || "—"}</td>
                      <td className="p-2">{row.email || "—"}</td>
                      <td className="p-2">{row.phone || "—"}</td>
                      <td className="p-2">{row.genre || "—"}</td>
                      <td className="p-2">{row.totalRevenue || "—"}</td>
                      <td className="p-2">{row.status || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {summary && (
            <p className="text-sm text-primary">
              {summary.imported} clients imported, {summary.updated} updated, {summary.errors.length} errors
            </p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
