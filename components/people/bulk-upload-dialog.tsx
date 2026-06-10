"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Papa from "papaparse"
import { Upload, Download, CheckCircle2, AlertTriangle, XCircle, FileText, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMembersPloc, useFellowshipsPloc } from "@/core/di/DependencyLocator"
import useMembersState from "@/application/member/useMembersState"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import {
  processRawRows,
  generateCsvTemplate,
  type ParsedMemberRow,
} from "@/lib/bulk-upload-utils"
import type { BulkImportRow } from "@/domain/entities/member/Member"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface BulkUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "upload" | "preview" | "result"

const statusConfig = {
  ready: { label: "Ready", className: "bg-green-100 text-green-800 border-0" },
  duplicate_in_file: { label: "Duplicate", className: "bg-yellow-100 text-yellow-800 border-0" },
  invalid: { label: "Invalid", className: "bg-red-100 text-red-800 border-0" },
}

export function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const membersPloc = useMembersPloc()
  const fellowshipsPloc = useFellowshipsPloc()
  const bulkImporting = useMembersState((s) => s.bulkImporting)
  const bulkImportResult = useMembersState((s) => s.bulkImportResult)
  const bulkImportError = useMembersState((s) => s.error)
  const fellowships = useFellowshipsState((s) => (Array.isArray(s.fellowships) ? s.fellowships : []))
  const fellowshipsLoading = useFellowshipsState((s) => s.loading)

  const [step, setStep] = useState<Step>("upload")
  const [parsedRows, setParsedRows] = useState<ParsedMemberRow[]>([])
  const [fileName, setFileName] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [parseWarning, setParseWarning] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      fellowshipsPloc.fetchAll()
      setStep("upload")
      setParsedRows([])
      setFileName("")
      setParseWarning(null)
      setImportError(null)
    }
  }, [open, fellowshipsPloc])

  const fellowshipIdMap = new Map(fellowships.map((f) => [f.name, f.id]))

  const parseFile = useCallback(
    (file: File) => {
      setFileName(file.name)
      setParseWarning(null)
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h: string) => h.replace(/\n/g, "").trim(),
        complete: (result: Papa.ParseResult<Record<string, string>>) => {
          if (result.errors.length > 0) {
            setParseWarning(
              `CSV parsed with ${result.errors.length} issue${result.errors.length > 1 ? "s" : ""}. Some rows may be incomplete.`,
            )
          }
          const rows = processRawRows(result.data, fellowshipIdMap)
          setParsedRows(rows)
          setStep("preview")
        },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fellowshipIdMap.size],
  )

  const validateAndHandleFile = (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setParseWarning("Only .csv files are supported. Please download the template to see the expected format.")
      return
    }
    parseFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndHandleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) validateAndHandleFile(file)
    // Reset so the same file can be re-selected
    e.target.value = ""
  }

  const handleDownloadTemplate = () => {
    const csv = generateCsvTemplate()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "city-mega-church-member-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const readyRows = parsedRows.filter((r) => r.status === "ready")
  const duplicateRows = parsedRows.filter((r) => r.status === "duplicate_in_file")
  const invalidRows = parsedRows.filter((r) => r.status === "invalid")

  const handleImport = async () => {
    setImportError(null)
    const importRows: BulkImportRow[] = readyRows.map((r) => ({
      fullName: r.fullName,
      rowIndex: r.rowIndex,
      phone: (r.normalizedPhone ?? r.phone) || undefined,
      email: r.email || undefined,
      gender: (r.gender as BulkImportRow["gender"]) || undefined,
      ageGroup: (r.ageGroup as BulkImportRow["ageGroup"]) || undefined,
      // Only send fellowshipId if it resolved to a real UUID (not a slug fallback)
      fellowshipId:
        r.fellowshipId && UUID_REGEX.test(r.fellowshipId) ? r.fellowshipId : undefined,
      churchRole: (r.churchRole as BulkImportRow["churchRole"]) || undefined,
      isOnline: r.isOnline,
      isInternational: r.isInternational,
    }))
    const success = await membersPloc.bulkImport(importRows)
    if (success) {
      setStep("result")
    } else {
      setImportError(bulkImportError ?? "Import failed. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Upload Members</DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a CSV file to import multiple members at once."}
            {step === "preview" && `Reviewing ${parsedRows.length} rows from "${fileName}"`}
            {step === "result" && "Import complete — review the results below."}
          </DialogDescription>
        </DialogHeader>

        {/* ─── STEP 1: UPLOAD ─── */}
        {step === "upload" && (
          <div className="space-y-4 py-2">
            {parseWarning && (
              <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{parseWarning}</span>
              </div>
            )}
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                fellowshipsLoading
                  ? "opacity-60 cursor-wait border-muted-foreground/20"
                  : dragOver
                    ? "border-primary bg-primary/5 cursor-copy"
                    : "border-muted-foreground/30 hover:border-primary/50 cursor-pointer"
              }`}
              onDragOver={(e) => {
                if (fellowshipsLoading) return
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={fellowshipsLoading ? undefined : handleDrop}
              onClick={() => !fellowshipsLoading && fileInputRef.current?.click()}
            >
              {fellowshipsLoading ? (
                <>
                  <Loader2 className="mx-auto h-10 w-10 text-muted-foreground mb-3 animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading fellowship data…</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">Drop your CSV file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports .csv files from Google Forms or prepared with the template below
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: PREVIEW ─── */}
        {step === "preview" && (
          <div className="flex flex-col flex-1 min-h-0 space-y-3">
            {parseWarning && (
              <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{parseWarning}</span>
              </div>
            )}

            {/* Summary bar */}
            <div className="flex gap-4 flex-wrap text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-semibold">{readyRows.length}</span>
                <span className="text-muted-foreground">to import*</span>
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold">{duplicateRows.length}</span> duplicates in file
              </span>
              <span className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="font-semibold">{invalidRows.length}</span> invalid
              </span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              * Rows already in the database will be skipped as duplicates during import.
            </p>

            {/* Preview table */}
            <ScrollArea className="flex-1 rounded-md border" style={{ maxHeight: 400 }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone (normalized)</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Fellowship</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.map((row) => {
                    const cfg = statusConfig[row.status]
                    return (
                      <TableRow
                        key={row.rowIndex}
                        className={
                          row.status === "invalid"
                            ? "bg-red-50/50"
                            : row.status === "duplicate_in_file"
                              ? "bg-yellow-50/50"
                              : ""
                        }
                      >
                        <TableCell className="text-muted-foreground text-xs">
                          {row.rowIndex}
                        </TableCell>
                        <TableCell className="font-medium">
                          {row.fullName || (
                            <span className="text-red-500 italic">missing</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.normalizedPhone ? (
                            <span className="text-green-700">{row.normalizedPhone}</span>
                          ) : row.phone ? (
                            <span className="text-red-500">{row.phone} (invalid)</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs capitalize">
                          {row.churchRole.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.fellowshipName ?? (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={cfg.className}>{cfg.label}</Badge>
                          {row.issues.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {row.issues[0]}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Import error */}
            {importError && (
              <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-1">
              <Button variant="outline" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button
                onClick={handleImport}
                disabled={readyRows.length === 0 || bulkImporting}
              >
                {bulkImporting
                  ? "Importing…"
                  : `Import ${readyRows.length} Member${readyRows.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: RESULT ─── */}
        {step === "result" && bulkImportResult && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{bulkImportResult.imported}</p>
                <p className="text-sm text-muted-foreground">Imported</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{bulkImportResult.duplicates}</p>
                <p className="text-sm text-muted-foreground">Duplicates skipped</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {bulkImportResult.errors.length}
                </p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>

            {bulkImportResult.errors.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Rows with errors:</p>
                <ScrollArea className="rounded border" style={{ maxHeight: 200 }}>
                  <div className="p-3 space-y-1">
                    {bulkImportResult.errors.map((e, idx) => (
                      <div key={idx} className="text-xs flex gap-2">
                        <span className="text-muted-foreground">Row {e.row}:</span>
                        <span className="font-medium">{e.name}</span>
                        <span className="text-red-600">— {e.reason}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </div>
        )}

        {step === "result" && !bulkImportResult && (
          <div className="py-6 text-center text-muted-foreground">
            <FileText className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">No import results available.</p>
            <Button className="mt-3" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
