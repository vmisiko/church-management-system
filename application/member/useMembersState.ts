import { create } from 'zustand'
import type { Member, MemberDepartment } from '@/domain/entities/member/Member'

export interface MembersState {
  members: Member[]
  currentMember: Member | null
  memberDepartments: MemberDepartment[]
  loading: boolean
  submitting: boolean
  error: string | null
}

const useMembersState = create<MembersState>(
  (): MembersState => ({
    members: [],
    currentMember: null,
    memberDepartments: [],
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useMembersState
