"use client"

import { useEffect, useRef, useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMembersPloc } from "@/core/di/DependencyLocator"
import useMembersState from "@/application/member/useMembersState"
import { generateCsvTemplate } from "@/lib/bulk-upload-utils"
import type { BulkImportRow } from "@/domain/entities/member/Member"

interface BulkUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "upload" | "preview" | "result"

const statusConfig = {
  ready: { label: "Ready", className: "bg-green-100 text-green-800 border-0" },
  duplicate_in_file: { label: "Duplicate", className: "bg-yellow-100 text-yellow-800 border-0" },
  duplicate_in_db: { label: "DB Duplicate", className: "bg-orange-100 text-orange-800 border-0" },
  invalid: { label: "Invalid", className: "bg-red-100 text-red-800 border-0" },
}

export function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const membersPloc = useMembersPloc()
  const bulkImporting = useMembersState((s) => s.bulkImporting)
  const bulkPreviewing = useMembersState((s) => s.bulkPreviewing)
  const bulkPreviewRows = useMembersState((s) => s.bulkPreviewRows)
  const bulkImportResult = useMembersState((s) => s.bulkImportResult)
  const bulkError = useMembersState((s) => s.error)

  const [step, setStep] = useState<Step>("upload")
  const [fileName, setFileName] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setStep("upload")
      setFileName("")
      setFileError(null)
      setImportError(null)
      // Reset Zustand store bulk state so stale rows/results from a previous
      // session don't flash before the new backend response arrives.
      useMembersState.setState({
        bulkPreviewRows: [],
        bulkPreviewing: false,
        bulkImportResult: null,
        bulkImporting: false,
        error: null,
      })
    }
  }, [open])

  const validateAndHandleFile = async (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setFileError("Only .csv files are supported. Please download the template to see the expected format.")
      return
    }
    setFileError(null)
    setFileName(file.name)
    const success = await membersPloc.previewBulkImport(file)
    if (success) {
      setStep("preview")
    }
    // On failure, bulkError in state reflects it — displayed via uploadStepError banner
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) void validateAndHandleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void validateAndHandleFile(file)
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

  const readyRows = bulkPreviewRows.filter((r) => r.status === "ready")
  const duplicateInFileRows = bulkPreviewRows.filter((r) => r.status === "duplicate_in_file")
  const duplicateInDbRows = bulkPreviewRows.filter((r) => r.status === "duplicate_in_db")
  const invalidRows = bulkPreviewRows.filter((r) => r.status === "invalid")

  const handleImport = async () => {
    setImportError(null)
    const importRows: BulkImportRow[] = readyRows.map((r) => ({
      fullName: r.fullName,
      rowIndex: r.rowIndex,
      phone: (r.normalizedPhone ?? r.phone) || undefined,
      email: r.email || undefined,
      gender: (r.gender as BulkImportRow["gender"]) || undefined,
      ageGroup: (r.ageGroup as BulkImportRow["ageGroup"]) || undefined,
      // fellowshipId is already a real UUID or null from the backend
      fellowshipId: r.fellowshipId ?? undefined,
      churchRole: (r.churchRole as BulkImportRow["churchRole"]) || undefined,
      isOnline: r.isOnline,
      isInternational: r.isInternational,
    }))
    const success = await membersPloc.bulkImport(importRows)
    if (success) {
      setStep("result")
    } else {
      // Read error from store directly — the closed-over `bulkError` is stale
      // because the Zustand state update happened inside the async call above.
      const freshError = useMembersState.getState().error
      setImportError(freshError ?? "Import failed. Please try again.")
    }
  }

  // Derive the upload-step error to display: explicit file error or backend preview error
  const uploadStepError = fileError ?? (step === "upload" && bulkError ? bulkError : null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bulk Upload Members</DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a CSV file to import multiple members at once."}
            {step === "preview" && `Reviewing ${bulkPreviewRows.length} rows from "${fileName}"`}
            {step === "result" && "Import complete — review the results below."}
          </DialogDescription>
        </DialogHeader>

        {/* ─── STEP 1: UPLOAD ─── */}
        {step === "upload" && (
          <div className="space-y-4 py-2">
            {uploadStepError && (
              <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{uploadStepError}</span>
              </div>
            )}
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                bulkPreviewing
                  ? "opacity-60 cursor-wait border-muted-foreground/20"
                  : dragOver
                    ? "border-primary bg-primary/5 cursor-copy"
                    : "border-muted-foreground/30 hover:border-primary/50 cursor-pointer"
              }`}
              onDragOver={(e) => {
                if (bulkPreviewing) return
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={bulkPreviewing ? undefined : handleDrop}
              onClick={() => !bulkPreviewing && fileInputRef.current?.click()}
            >
              {bulkPreviewing ? (
                <>
                  <Loader2 className="mx-auto h-10 w-10 text-muted-foreground mb-3 animate-spin" />
                  <p className="text-sm text-muted-foreground">Analyzing file…</p>
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
          <div className="flex flex-col flex-1 min-h-0 gap-3">
            {/* Summary bar */}
            <div className="flex gap-4 flex-wrap text-sm shrink-0">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-semibold">{readyRows.length}</span>
                <span className="text-muted-foreground">to import</span>
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold">{duplicateInFileRows.length}</span> duplicates in file
              </span>
              {duplicateInDbRows.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold">{duplicateInDbRows.length}</span> already in database
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="font-semibold">{invalidRows.length}</span> invalid
              </span>
            </div>

            {/* Preview table — plain div so both x and y scroll work */}
            <div className="flex-1 min-h-0 overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10 sticky left-0 bg-muted/50">#</TableHead>
                    <TableHead className="min-w-[160px]">Name</TableHead>
                    <TableHead className="min-w-[160px]">Phone (normalized)</TableHead>
                    <TableHead className="min-w-[130px]">Role</TableHead>
                    <TableHead className="min-w-[130px]">Fellowship</TableHead>
                    <TableHead className="min-w-[140px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkPreviewRows.map((row) => {
                    const cfg = statusConfig[row.status]
                    return (
                      <TableRow
                        key={row.rowIndex}
                        className={
                          row.status === "invalid"
                            ? "bg-red-50/50"
                            : row.status === "duplicate_in_file"
                              ? "bg-yellow-50/50"
                              : row.status === "duplicate_in_db"
                                ? "bg-orange-50/50"
                                : ""
                        }
                      >
                        <TableCell className="text-muted-foreground text-xs sticky left-0 bg-inherit">
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
            </div>

            {/* Import error */}
            {importError && (
              <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 shrink-0">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <Separator className="shrink-0" />

            {/* Actions — always visible at bottom, never overlaps table */}
            <div className="flex justify-between shrink-0">
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
