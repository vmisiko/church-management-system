"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import CustomAxios from "@/core/utility/CustomAxios"

// ── Auth ─────────────────────────────────────────────────────────────────────
import { AuthRepository } from "@/data/api/auth/AuthRepository"
import { LoginUseCase } from "@/domain/usecases/auth/LoginUseCase"
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase"
import { RefreshTokenUseCase } from "@/domain/usecases/auth/RefreshTokenUseCase"
import { GetMeUseCase } from "@/domain/usecases/auth/GetMeUseCase"
import { ChangePasswordUseCase } from "@/domain/usecases/auth/ChangePasswordUseCase"
import { AuthPloc } from "@/application/auth/AuthPloc"
import useAuthState from "@/application/auth/useAuthState"

// ── Users ─────────────────────────────────────────────────────────────────────
import { UserRepository } from "@/data/api/user/UserRepository"
import { GetUsersUseCase } from "@/domain/usecases/user/GetUsersUseCase"
import { GetUserByIdUseCase } from "@/domain/usecases/user/GetUserByIdUseCase"
import { CreateUserUseCase } from "@/domain/usecases/user/CreateUserUseCase"
import { UpdateUserUseCase } from "@/domain/usecases/user/UpdateUserUseCase"
import { DeleteUserUseCase } from "@/domain/usecases/user/DeleteUserUseCase"
import { UsersPloc } from "@/application/user/UsersPloc"
import useUsersState from "@/application/user/useUsersState"

// ── Fellowship Zones ──────────────────────────────────────────────────────────
import { FellowshipZoneRepository } from "@/data/api/fellowship-zone/FellowshipZoneRepository"
import { GetFellowshipZonesUseCase } from "@/domain/usecases/fellowship-zone/GetFellowshipZonesUseCase"
import { GetFellowshipZoneByIdUseCase } from "@/domain/usecases/fellowship-zone/GetFellowshipZoneByIdUseCase"
import { CreateFellowshipZoneUseCase } from "@/domain/usecases/fellowship-zone/CreateFellowshipZoneUseCase"
import { UpdateFellowshipZoneUseCase } from "@/domain/usecases/fellowship-zone/UpdateFellowshipZoneUseCase"
import { DeleteFellowshipZoneUseCase } from "@/domain/usecases/fellowship-zone/DeleteFellowshipZoneUseCase"
import { FellowshipZonesPloc } from "@/application/fellowship-zone/FellowshipZonesPloc"
import useFellowshipZonesState from "@/application/fellowship-zone/useFellowshipZonesState"

// ── Fellowships ───────────────────────────────────────────────────────────────
import { FellowshipRepository } from "@/data/api/fellowship/FellowshipRepository"
import { GetFellowshipsUseCase } from "@/domain/usecases/fellowship/GetFellowshipsUseCase"
import { GetFellowshipByIdUseCase } from "@/domain/usecases/fellowship/GetFellowshipByIdUseCase"
import { GetFellowshipBySlugUseCase } from "@/domain/usecases/fellowship/GetFellowshipBySlugUseCase"
import { CreateFellowshipUseCase } from "@/domain/usecases/fellowship/CreateFellowshipUseCase"
import { UpdateFellowshipUseCase } from "@/domain/usecases/fellowship/UpdateFellowshipUseCase"
import { DeleteFellowshipUseCase } from "@/domain/usecases/fellowship/DeleteFellowshipUseCase"
import { FellowshipsPloc } from "@/application/fellowship/FellowshipsPloc"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"

// ── Departments ───────────────────────────────────────────────────────────────
import { DepartmentRepository } from "@/data/api/department/DepartmentRepository"
import { GetDepartmentsUseCase } from "@/domain/usecases/department/GetDepartmentsUseCase"
import { GetDepartmentByIdUseCase } from "@/domain/usecases/department/GetDepartmentByIdUseCase"
import { CreateDepartmentUseCase } from "@/domain/usecases/department/CreateDepartmentUseCase"
import { UpdateDepartmentUseCase } from "@/domain/usecases/department/UpdateDepartmentUseCase"
import { DeleteDepartmentUseCase } from "@/domain/usecases/department/DeleteDepartmentUseCase"
import { DepartmentsPloc } from "@/application/department/DepartmentsPloc"
import useDepartmentsState from "@/application/department/useDepartmentsState"

// ── Members ───────────────────────────────────────────────────────────────────
import { MemberRepository } from "@/data/api/member/MemberRepository"
import { GetMembersUseCase } from "@/domain/usecases/member/GetMembersUseCase"
import { GetMemberByIdUseCase } from "@/domain/usecases/member/GetMemberByIdUseCase"
import { CreateMemberUseCase } from "@/domain/usecases/member/CreateMemberUseCase"
import { UpdateMemberUseCase } from "@/domain/usecases/member/UpdateMemberUseCase"
import { DeleteMemberUseCase } from "@/domain/usecases/member/DeleteMemberUseCase"
import { GetMemberDepartmentsUseCase } from "@/domain/usecases/member/GetMemberDepartmentsUseCase"
import { AssignMemberDepartmentUseCase } from "@/domain/usecases/member/AssignMemberDepartmentUseCase"
import { RemoveMemberDepartmentUseCase } from "@/domain/usecases/member/RemoveMemberDepartmentUseCase"
import { BulkImportMembersUseCase } from "@/domain/usecases/member/BulkImportMembersUseCase"
import { PreviewBulkImportUseCase } from "@/domain/usecases/member/PreviewBulkImportUseCase"
import { MembersPloc } from "@/application/member/MembersPloc"
import useMembersState from "@/application/member/useMembersState"

// ── Attendance ────────────────────────────────────────────────────────────────
import { AttendanceRepository } from "@/data/api/attendance/AttendanceRepository"
import { GetSessionsUseCase } from "@/domain/usecases/attendance/GetSessionsUseCase"
import { GetSessionByIdUseCase } from "@/domain/usecases/attendance/GetSessionByIdUseCase"
import { CreateSessionUseCase } from "@/domain/usecases/attendance/CreateSessionUseCase"
import { UpdateSessionUseCase } from "@/domain/usecases/attendance/UpdateSessionUseCase"
import { DeleteSessionUseCase } from "@/domain/usecases/attendance/DeleteSessionUseCase"
import { GetSessionRecordsUseCase } from "@/domain/usecases/attendance/GetSessionRecordsUseCase"
import { RecordAttendanceUseCase } from "@/domain/usecases/attendance/RecordAttendanceUseCase"
import { GetMemberAttendanceUseCase } from "@/domain/usecases/attendance/GetMemberAttendanceUseCase"
import { UpdateAttendanceRecordUseCase } from "@/domain/usecases/attendance/UpdateAttendanceRecordUseCase"
import { DeleteAttendanceRecordUseCase } from "@/domain/usecases/attendance/DeleteAttendanceRecordUseCase"
import { AttendancePloc } from "@/application/attendance/AttendancePloc"
import useAttendanceState from "@/application/attendance/useAttendanceState"

// ── Messaging ─────────────────────────────────────────────────────────────────
import { MessagingRepository } from "@/data/api/messaging/MessagingRepository"
import { GetMessagesUseCase } from "@/domain/usecases/messaging/GetMessagesUseCase"
import { GetMessageByIdUseCase } from "@/domain/usecases/messaging/GetMessageByIdUseCase"
import { CreateMessageUseCase } from "@/domain/usecases/messaging/CreateMessageUseCase"
import { UpdateMessageUseCase } from "@/domain/usecases/messaging/UpdateMessageUseCase"
import { DeleteMessageUseCase } from "@/domain/usecases/messaging/DeleteMessageUseCase"
import { SendMessageUseCase } from "@/domain/usecases/messaging/SendMessageUseCase"
import { GetDeliveriesUseCase } from "@/domain/usecases/messaging/GetDeliveriesUseCase"
import { GetDeliveryStatsUseCase } from "@/domain/usecases/messaging/GetDeliveryStatsUseCase"
import { MessagingPloc } from "@/application/messaging/MessagingPloc"
import useMessagingState from "@/application/messaging/useMessagingState"
import { MessageTemplateRepository } from "@/data/api/messaging/MessageTemplateRepository"
import { GetTemplatesUseCase } from "@/domain/usecases/messaging/GetTemplatesUseCase"
import { CreateTemplateUseCase } from "@/domain/usecases/messaging/CreateTemplateUseCase"
import { DeleteTemplateUseCase } from "@/domain/usecases/messaging/DeleteTemplateUseCase"
import { MessageTemplatePloc } from "@/application/messaging/MessageTemplatePloc"
import useMessageTemplateState from "@/application/messaging/useMessageTemplateState"

// ── Inventory ─────────────────────────────────────────────────────────────────
import { InventoryCategoryRepository } from "@/data/api/inventory/InventoryCategoryRepository"
import { GetCategoriesUseCase } from "@/domain/usecases/inventory/GetCategoriesUseCase"
import { GetCategoryByIdUseCase } from "@/domain/usecases/inventory/GetCategoryByIdUseCase"
import { CreateCategoryUseCase } from "@/domain/usecases/inventory/CreateCategoryUseCase"
import { UpdateCategoryUseCase } from "@/domain/usecases/inventory/UpdateCategoryUseCase"
import { DeleteCategoryUseCase } from "@/domain/usecases/inventory/DeleteCategoryUseCase"
import { InventoryCategoriesPloc } from "@/application/inventory/InventoryCategoriesPloc"
import useInventoryCategoriesState from "@/application/inventory/useInventoryCategoriesState"

import { InventoryItemRepository } from "@/data/api/inventory/InventoryItemRepository"
import { GetItemsUseCase } from "@/domain/usecases/inventory/GetItemsUseCase"
import { GetItemByIdUseCase } from "@/domain/usecases/inventory/GetItemByIdUseCase"
import { CreateItemUseCase } from "@/domain/usecases/inventory/CreateItemUseCase"
import { UpdateItemUseCase } from "@/domain/usecases/inventory/UpdateItemUseCase"
import { DeleteItemUseCase } from "@/domain/usecases/inventory/DeleteItemUseCase"
import { AdjustStockUseCase } from "@/domain/usecases/inventory/AdjustStockUseCase"
import { InventoryItemsPloc } from "@/application/inventory/InventoryItemsPloc"
import useInventoryItemsState from "@/application/inventory/useInventoryItemsState"

import { DamageReportRepository } from "@/data/api/inventory/DamageReportRepository"
import { GetDamageReportsUseCase } from "@/domain/usecases/inventory/GetDamageReportsUseCase"
import { GetDamageReportByIdUseCase } from "@/domain/usecases/inventory/GetDamageReportByIdUseCase"
import { CreateDamageReportUseCase } from "@/domain/usecases/inventory/CreateDamageReportUseCase"
import { UpdateDamageReportUseCase } from "@/domain/usecases/inventory/UpdateDamageReportUseCase"
import { DeleteDamageReportUseCase } from "@/domain/usecases/inventory/DeleteDamageReportUseCase"
import { DamageReportsPloc } from "@/application/inventory/DamageReportsPloc"
import useDamageReportsState from "@/application/inventory/useDamageReportsState"

import { StockMovementRepository } from "@/data/api/inventory/StockMovementRepository"
import { GetStockMovementsUseCase } from "@/domain/usecases/inventory/GetStockMovementsUseCase"
import { StockMovementsPloc } from "@/application/inventory/StockMovementsPloc"
import useStockMovementsState from "@/application/inventory/useStockMovementsState"

import { ItemRequestRepository } from "@/data/api/inventory/ItemRequestRepository"
import { GetItemRequestsUseCase } from "@/domain/usecases/inventory/GetItemRequestsUseCase"
import { CreateItemRequestUseCase } from "@/domain/usecases/inventory/CreateItemRequestUseCase"
import { UpdateItemRequestStatusUseCase } from "@/domain/usecases/inventory/UpdateItemRequestStatusUseCase"
import { DeleteItemRequestUseCase } from "@/domain/usecases/inventory/DeleteItemRequestUseCase"
import { ItemRequestsPloc } from "@/application/inventory/ItemRequestsPloc"
import useItemRequestsState from "@/application/inventory/useItemRequestsState"

// ─────────────────────────────────────────────────────────────────────────────
// Shared CustomAxios — one instance, lazy-initialised.
// getAuthPloc is a lazy getter so authPlocSingleton is resolved at call time
// (after it has been populated by useAuthPloc).
// ─────────────────────────────────────────────────────────────────────────────

let authPlocSingleton: AuthPloc | null = null
let customAxiosInstance: CustomAxios | null = null

function getSharedAxios(router: ReturnType<typeof useRouter>): CustomAxios {
  if (customAxiosInstance) return customAxiosInstance
  customAxiosInstance = new CustomAxios({
    getAuthPloc: () => authPlocSingleton,
    router: (path) => router.push(path),
  })
  return customAxiosInstance
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function useAuthPloc(): AuthPloc {
  const router = useRouter()
  return useMemo(() => {
    if (authPlocSingleton) return authPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new AuthRepository({ axios })
    authPlocSingleton = new AuthPloc({
      store: useAuthState,
      loginUseCase: new LoginUseCase(repo),
      logoutUseCase: new LogoutUseCase(repo),
      refreshTokenUseCase: new RefreshTokenUseCase(repo),
      getMeUseCase: new GetMeUseCase(repo),
      changePasswordUseCase: new ChangePasswordUseCase(repo),
    })
    return authPlocSingleton
  }, [router])
}

// ── Users ─────────────────────────────────────────────────────────────────────

let usersPlocSingleton: UsersPloc | null = null

export function useUsersPloc(): UsersPloc {
  const router = useRouter()
  return useMemo(() => {
    if (usersPlocSingleton) return usersPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new UserRepository({ axios })
    usersPlocSingleton = new UsersPloc({
      store: useUsersState,
      getUsersUseCase: new GetUsersUseCase(repo),
      getUserByIdUseCase: new GetUserByIdUseCase(repo),
      createUserUseCase: new CreateUserUseCase(repo),
      updateUserUseCase: new UpdateUserUseCase(repo),
      deleteUserUseCase: new DeleteUserUseCase(repo),
    })
    return usersPlocSingleton
  }, [router])
}

// ── Fellowship Zones ──────────────────────────────────────────────────────────

let fellowshipZonesPlocSingleton: FellowshipZonesPloc | null = null

export function useFellowshipZonesPloc(): FellowshipZonesPloc {
  const router = useRouter()
  return useMemo(() => {
    if (fellowshipZonesPlocSingleton) return fellowshipZonesPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new FellowshipZoneRepository({ axios })
    fellowshipZonesPlocSingleton = new FellowshipZonesPloc({
      store: useFellowshipZonesState,
      getFellowshipZonesUseCase: new GetFellowshipZonesUseCase(repo),
      getFellowshipZoneByIdUseCase: new GetFellowshipZoneByIdUseCase(repo),
      createFellowshipZoneUseCase: new CreateFellowshipZoneUseCase(repo),
      updateFellowshipZoneUseCase: new UpdateFellowshipZoneUseCase(repo),
      deleteFellowshipZoneUseCase: new DeleteFellowshipZoneUseCase(repo),
    })
    return fellowshipZonesPlocSingleton
  }, [router])
}

// ── Fellowships ───────────────────────────────────────────────────────────────

let fellowshipsPlocSingleton: FellowshipsPloc | null = null

export function useFellowshipsPloc(): FellowshipsPloc {
  const router = useRouter()
  return useMemo(() => {
    if (fellowshipsPlocSingleton) return fellowshipsPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new FellowshipRepository({ axios })
    fellowshipsPlocSingleton = new FellowshipsPloc({
      store: useFellowshipsState,
      getFellowshipsUseCase: new GetFellowshipsUseCase(repo),
      getFellowshipByIdUseCase: new GetFellowshipByIdUseCase(repo),
      getFellowshipBySlugUseCase: new GetFellowshipBySlugUseCase(repo),
      createFellowshipUseCase: new CreateFellowshipUseCase(repo),
      updateFellowshipUseCase: new UpdateFellowshipUseCase(repo),
      deleteFellowshipUseCase: new DeleteFellowshipUseCase(repo),
    })
    return fellowshipsPlocSingleton
  }, [router])
}

// ── Departments ───────────────────────────────────────────────────────────────

let departmentsPlocSingleton: DepartmentsPloc | null = null

export function useDepartmentsPloc(): DepartmentsPloc {
  const router = useRouter()
  return useMemo(() => {
    if (departmentsPlocSingleton) return departmentsPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new DepartmentRepository({ axios })
    departmentsPlocSingleton = new DepartmentsPloc({
      store: useDepartmentsState,
      getDepartmentsUseCase: new GetDepartmentsUseCase(repo),
      getDepartmentByIdUseCase: new GetDepartmentByIdUseCase(repo),
      createDepartmentUseCase: new CreateDepartmentUseCase(repo),
      updateDepartmentUseCase: new UpdateDepartmentUseCase(repo),
      deleteDepartmentUseCase: new DeleteDepartmentUseCase(repo),
    })
    return departmentsPlocSingleton
  }, [router])
}

// ── Members ───────────────────────────────────────────────────────────────────

let membersPlocSingleton: MembersPloc | null = null

export function useMembersPloc(): MembersPloc {
  const router = useRouter()
  return useMemo(() => {
    if (membersPlocSingleton) return membersPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new MemberRepository({ axios })
    membersPlocSingleton = new MembersPloc({
      store: useMembersState,
      getMembersUseCase: new GetMembersUseCase(repo),
      getMemberByIdUseCase: new GetMemberByIdUseCase(repo),
      createMemberUseCase: new CreateMemberUseCase(repo),
      updateMemberUseCase: new UpdateMemberUseCase(repo),
      deleteMemberUseCase: new DeleteMemberUseCase(repo),
      getMemberDepartmentsUseCase: new GetMemberDepartmentsUseCase(repo),
      assignMemberDepartmentUseCase: new AssignMemberDepartmentUseCase(repo),
      removeMemberDepartmentUseCase: new RemoveMemberDepartmentUseCase(repo),
      bulkImportMembersUseCase: new BulkImportMembersUseCase(repo),
      previewBulkImportUseCase: new PreviewBulkImportUseCase(repo),
    })
    return membersPlocSingleton
  }, [router])
}

// ── Attendance ────────────────────────────────────────────────────────────────

let attendancePlocSingleton: AttendancePloc | null = null

export function useAttendancePloc(): AttendancePloc {
  const router = useRouter()
  return useMemo(() => {
    if (attendancePlocSingleton) return attendancePlocSingleton
    const axios = getSharedAxios(router)
    const repo = new AttendanceRepository({ axios })
    attendancePlocSingleton = new AttendancePloc({
      store: useAttendanceState,
      getSessionsUseCase: new GetSessionsUseCase(repo),
      getSessionByIdUseCase: new GetSessionByIdUseCase(repo),
      createSessionUseCase: new CreateSessionUseCase(repo),
      updateSessionUseCase: new UpdateSessionUseCase(repo),
      deleteSessionUseCase: new DeleteSessionUseCase(repo),
      getSessionRecordsUseCase: new GetSessionRecordsUseCase(repo),
      recordAttendanceUseCase: new RecordAttendanceUseCase(repo),
      getMemberAttendanceUseCase: new GetMemberAttendanceUseCase(repo),
      updateAttendanceRecordUseCase: new UpdateAttendanceRecordUseCase(repo),
      deleteAttendanceRecordUseCase: new DeleteAttendanceRecordUseCase(repo),
    })
    return attendancePlocSingleton
  }, [router])
}

// ── Messaging ─────────────────────────────────────────────────────────────────

let messagingPlocSingleton: MessagingPloc | null = null

export function useMessagingPloc(): MessagingPloc {
  const router = useRouter()
  return useMemo(() => {
    if (messagingPlocSingleton) return messagingPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new MessagingRepository({ axios })
    messagingPlocSingleton = new MessagingPloc({
      store: useMessagingState,
      getMessagesUseCase: new GetMessagesUseCase(repo),
      getMessageByIdUseCase: new GetMessageByIdUseCase(repo),
      createMessageUseCase: new CreateMessageUseCase(repo),
      updateMessageUseCase: new UpdateMessageUseCase(repo),
      deleteMessageUseCase: new DeleteMessageUseCase(repo),
      sendMessageUseCase: new SendMessageUseCase(repo),
      getDeliveriesUseCase: new GetDeliveriesUseCase(repo),
      getDeliveryStatsUseCase: new GetDeliveryStatsUseCase(repo),
    })
    return messagingPlocSingleton
  }, [router])
}

// ── Message Templates ─────────────────────────────────────────────────────────

let messageTemplatePlocSingleton: MessageTemplatePloc | null = null

export function useMessageTemplatePloc(): MessageTemplatePloc {
  const router = useRouter()
  return useMemo(() => {
    if (messageTemplatePlocSingleton) return messageTemplatePlocSingleton
    const axios = getSharedAxios(router)
    const repo = new MessageTemplateRepository({ axios })
    messageTemplatePlocSingleton = new MessageTemplatePloc({
      store: useMessageTemplateState,
      getTemplatesUseCase: new GetTemplatesUseCase(repo),
      createTemplateUseCase: new CreateTemplateUseCase(repo),
      deleteTemplateUseCase: new DeleteTemplateUseCase(repo),
    })
    return messageTemplatePlocSingleton
  }, [router])
}

// ── Inventory Categories ──────────────────────────────────────────────────────

let inventoryCategoriesPlocSingleton: InventoryCategoriesPloc | null = null

export function useInventoryCategoriesPloc(): InventoryCategoriesPloc {
  const router = useRouter()
  return useMemo(() => {
    if (inventoryCategoriesPlocSingleton) return inventoryCategoriesPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new InventoryCategoryRepository({ axios })
    inventoryCategoriesPlocSingleton = new InventoryCategoriesPloc({
      store: useInventoryCategoriesState,
      getCategoriesUseCase: new GetCategoriesUseCase(repo),
      getCategoryByIdUseCase: new GetCategoryByIdUseCase(repo),
      createCategoryUseCase: new CreateCategoryUseCase(repo),
      updateCategoryUseCase: new UpdateCategoryUseCase(repo),
      deleteCategoryUseCase: new DeleteCategoryUseCase(repo),
    })
    return inventoryCategoriesPlocSingleton
  }, [router])
}

// ── Inventory Items ───────────────────────────────────────────────────────────

let inventoryItemsPlocSingleton: InventoryItemsPloc | null = null

export function useInventoryItemsPloc(): InventoryItemsPloc {
  const router = useRouter()
  return useMemo(() => {
    if (inventoryItemsPlocSingleton) return inventoryItemsPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new InventoryItemRepository({ axios })
    inventoryItemsPlocSingleton = new InventoryItemsPloc({
      store: useInventoryItemsState,
      getItemsUseCase: new GetItemsUseCase(repo),
      getItemByIdUseCase: new GetItemByIdUseCase(repo),
      createItemUseCase: new CreateItemUseCase(repo),
      updateItemUseCase: new UpdateItemUseCase(repo),
      deleteItemUseCase: new DeleteItemUseCase(repo),
      adjustStockUseCase: new AdjustStockUseCase(repo),
    })
    return inventoryItemsPlocSingleton
  }, [router])
}

// ── Stock Movements ───────────────────────────────────────────────────────────

let stockMovementsPlocSingleton: StockMovementsPloc | null = null

export function useStockMovementsPloc(): StockMovementsPloc {
  const router = useRouter()
  return useMemo(() => {
    if (stockMovementsPlocSingleton) return stockMovementsPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new StockMovementRepository({ axios })
    stockMovementsPlocSingleton = new StockMovementsPloc({
      store: useStockMovementsState,
      getMovementsUseCase: new GetStockMovementsUseCase(repo),
    })
    return stockMovementsPlocSingleton
  }, [router])
}

// ── Item Requests ─────────────────────────────────────────────────────────────

let itemRequestsPlocSingleton: ItemRequestsPloc | null = null

export function useItemRequestsPloc(): ItemRequestsPloc {
  const router = useRouter()
  return useMemo(() => {
    if (itemRequestsPlocSingleton) return itemRequestsPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new ItemRequestRepository({ axios })
    itemRequestsPlocSingleton = new ItemRequestsPloc({
      store: useItemRequestsState,
      getRequestsUseCase: new GetItemRequestsUseCase(repo),
      createRequestUseCase: new CreateItemRequestUseCase(repo),
      updateStatusUseCase: new UpdateItemRequestStatusUseCase(repo),
      deleteRequestUseCase: new DeleteItemRequestUseCase(repo),
    })
    return itemRequestsPlocSingleton
  }, [router])
}

// ── Damage Reports ────────────────────────────────────────────────────────────

let damageReportsPlocSingleton: DamageReportsPloc | null = null

export function useDamageReportsPloc(): DamageReportsPloc {
  const router = useRouter()
  return useMemo(() => {
    if (damageReportsPlocSingleton) return damageReportsPlocSingleton
    const axios = getSharedAxios(router)
    const repo = new DamageReportRepository({ axios })
    damageReportsPlocSingleton = new DamageReportsPloc({
      store: useDamageReportsState,
      getDamageReportsUseCase: new GetDamageReportsUseCase(repo),
      getDamageReportByIdUseCase: new GetDamageReportByIdUseCase(repo),
      createDamageReportUseCase: new CreateDamageReportUseCase(repo),
      updateDamageReportUseCase: new UpdateDamageReportUseCase(repo),
      deleteDamageReportUseCase: new DeleteDamageReportUseCase(repo),
    })
    return damageReportsPlocSingleton
  }, [router])
}
