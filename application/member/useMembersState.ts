import { create } from 'zustand'
import type { Member, MemberDepartment, BulkImportResult } from '@/domain/entities/member/Member'

export interface MembersState {
  members: Member[]
  currentMember: Member | null
  memberDepartments: MemberDepartment[]
  loading: boolean
  drawerLoading: boolean
  submitting: boolean
  bulkImporting: boolean
  bulkImportResult: BulkImportResult | null
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
    error: null,
  }),
)

export default useMembersState
