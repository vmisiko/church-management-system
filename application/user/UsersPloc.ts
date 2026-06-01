import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { UsersState } from './useUsersState'
import type { GetUsersUseCase } from '@/domain/usecases/user/GetUsersUseCase'
import type { GetUserByIdUseCase } from '@/domain/usecases/user/GetUserByIdUseCase'
import type { CreateUserUseCase } from '@/domain/usecases/user/CreateUserUseCase'
import type { UpdateUserUseCase } from '@/domain/usecases/user/UpdateUserUseCase'
import type { DeleteUserUseCase } from '@/domain/usecases/user/DeleteUserUseCase'
import type { CreateUserRequest, UpdateUserRequest } from '@/domain/entities/user/User'

export class UsersPloc extends Ploc<StoreApi<UsersState>> {
  private readonly getUsersUseCase: GetUsersUseCase
  private readonly getUserByIdUseCase: GetUserByIdUseCase
  private readonly createUserUseCase: CreateUserUseCase
  private readonly updateUserUseCase: UpdateUserUseCase
  private readonly deleteUserUseCase: DeleteUserUseCase

  constructor({
    store,
    getUsersUseCase,
    getUserByIdUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  }: {
    store: StoreApi<UsersState>
    getUsersUseCase: GetUsersUseCase
    getUserByIdUseCase: GetUserByIdUseCase
    createUserUseCase: CreateUserUseCase
    updateUserUseCase: UpdateUserUseCase
    deleteUserUseCase: DeleteUserUseCase
  }) {
    super({ store })
    this.getUsersUseCase = getUsersUseCase
    this.getUserByIdUseCase = getUserByIdUseCase
    this.createUserUseCase = createUserUseCase
    this.updateUserUseCase = updateUserUseCase
    this.deleteUserUseCase = deleteUserUseCase
  }

  async fetchAll() {
    this.store.setState({ loading: true, error: null })
    const result = await this.getUsersUseCase.execute()
    result.fold(
      (err) => this.store.setState({ loading: false, error: this.handleError(err) }),
      (users) => this.store.setState({ loading: false, users }),
    )
  }

  async fetchById(id: string) {
    this.store.setState({ loading: true, error: null })
    const result = await this.getUserByIdUseCase.execute(id)
    result.fold(
      (err) => this.store.setState({ loading: false, error: this.handleError(err) }),
      (selectedUser) => this.store.setState({ loading: false, selectedUser }),
    )
  }

  async create(params: CreateUserRequest) {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createUserUseCase.execute(params)
    result.fold(
      (err) => this.store.setState({ submitting: false, error: this.handleError(err) }),
      (newUser) =>
        this.store.setState((state) => ({
          submitting: false,
          users: [...state.users, newUser],
        })),
    )
    return result
  }

  async update(id: string, params: UpdateUserRequest) {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateUserUseCase.execute(id, params)
    result.fold(
      (err) => this.store.setState({ submitting: false, error: this.handleError(err) }),
      (updatedUser) =>
        this.store.setState((state) => ({
          submitting: false,
          users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
          selectedUser:
            state.selectedUser?.id === updatedUser.id ? updatedUser : state.selectedUser,
        })),
    )
    return result
  }

  async delete(id: string) {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteUserUseCase.execute(id)
    result.fold(
      (err) => this.store.setState({ submitting: false, error: this.handleError(err) }),
      () =>
        this.store.setState((state) => ({
          submitting: false,
          users: state.users.filter((u) => u.id !== id),
          selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        })),
    )
    return result
  }

  clearError() {
    this.store.setState({ error: null })
  }

  selectUser(user: UsersState['selectedUser']) {
    this.store.setState({ selectedUser: user })
  }
}
