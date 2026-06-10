import { create } from 'zustand'
import type { Member, MemberDepartment, BulkImportResult, BulkPreviewRow } from '@/domain/entities/member/Member'

export interface MembersState {
  members: Member[]
  currentMember: Member | null
  memberDepartments: MemberDepartment[]
  loading: boolean
  drawerLoading: boolean
  submitting: boolean
  bulkImporting: boolean
  bulkImportResult: BulkImportResult | null
  bulkPreviewing: boolean
  bulkPreviewRows: BulkPreviewRow[]
  error: string | null
}

const useMembersState = create<MembersState>(
  (): MembersState => ({
    members: [],
    currentMember: null,
    memberDepartments: [],
    loading: false,
    drawerLoading: false,
    submitting: false,
    bulkImporting: false,
    bulkImportResult: null,
    bulkPreviewing: false,
    bulkPreviewRows: [],
    error: null,
  }),
)

export default useMembersState
