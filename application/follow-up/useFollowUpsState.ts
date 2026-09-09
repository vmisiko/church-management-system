import { create } from "zustand"
import type { FollowUpAttempt, FollowUpTask } from "@/domain/entities/follow-up/FollowUp"

export interface FollowUpsState { tasks: FollowUpTask[]; selectedTask: FollowUpTask | null; attempts: FollowUpAttempt[]; loading: boolean; submitting: boolean; error: string | null }
const useFollowUpsState = create<FollowUpsState>(() => ({ tasks: [], selectedTask: null, attempts: [], loading: false, submitting: false, error: null }))
export default useFollowUpsState
