import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { FellowshipsState } from './useFellowshipsState'
import type { GetFellowshipsUseCase } from '@/domain/usecases/fellowship/GetFellowshipsUseCase'
import type { GetFellowshipByIdUseCase } from '@/domain/usecases/fellowship/GetFellowshipByIdUseCase'
import type { GetFellowshipBySlugUseCase } from '@/domain/usecases/fellowship/GetFellowshipBySlugUseCase'
import type { CreateFellowshipUseCase } from '@/domain/usecases/fellowship/CreateFellowshipUseCase'
import type { UpdateFellowshipUseCase } from '@/domain/usecases/fellowship/UpdateFellowshipUseCase'
import type { DeleteFellowshipUseCase } from '@/domain/usecases/fellowship/DeleteFellowshipUseCase'
import type { CreateFellowshipRequest, UpdateFellowshipRequest } from '@/domain/entities/fellowship/Fellowship'

export class FellowshipsPloc extends Ploc<StoreApi<FellowshipsState>> {
  private readonly getFellowshipsUseCase: GetFellowshipsUseCase
  private readonly getFellowshipByIdUseCase: GetFellowshipByIdUseCase
  private readonly getFellowshipBySlugUseCase: GetFellowshipBySlugUseCase
  private readonly createFellowshipUseCase: CreateFellowshipUseCase
  private readonly updateFellowshipUseCase: UpdateFellowshipUseCase
  private readonly deleteFellowshipUseCase: DeleteFellowshipUseCase

  constructor({
    store,
    getFellowshipsUseCase,
    getFellowshipByIdUseCase,
    getFellowshipBySlugUseCase,
    createFellowshipUseCase,
    updateFellowshipUseCase,
    deleteFellowshipUseCase,
  }: {
    store: StoreApi<FellowshipsState>
    getFellowshipsUseCase: GetFellowshipsUseCase
    getFellowshipByIdUseCase: GetFellowshipByIdUseCase
    getFellowshipBySlugUseCase: GetFellowshipBySlugUseCase
    createFellowshipUseCase: CreateFellowshipUseCase
    updateFellowshipUseCase: UpdateFellowshipUseCase
    deleteFellowshipUseCase: DeleteFellowshipUseCase
  }) {
    super({ store })
    this.getFellowshipsUseCase = getFellowshipsUseCase
    this.getFellowshipByIdUseCase = getFellowshipByIdUseCase
    this.getFellowshipBySlugUseCase = getFellowshipBySlugUseCase
    this.createFellowshipUseCase = createFellowshipUseCase
    this.updateFellowshipUseCase = updateFellowshipUseCase
    this.deleteFellowshipUseCase = deleteFellowshipUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getFellowshipsUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (fellowships) => this.store.setState({ loading: false, fellowships }),
    )
  }

  async fetchById(id: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getFellowshipByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (currentFellowship) => this.store.setState({ loading: false, currentFellowship }),
    )
  }

  async fetchBySlug(slug: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getFellowshipBySlugUseCase.execute(slug)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (currentFellowship) => this.store.setState({ loading: false, currentFellowship }),
    )
  }

  async create(params: CreateFellowshipRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createFellowshipUseCase.execute(params)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (created) =>
        this.store.setState((state) => ({
          submitting: false,
          fellowships: [...state.fellowships, created],
        })),
    )
  }

  async update(id: string, params: UpdateFellowshipRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateFellowshipUseCase.execute(id, params)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (updated) =>
        this.store.setState((state) => ({
          submitting: false,
          fellowships: state.fellowships.map((f) => (f.id === id ? updated : f)),
          currentFellowship:
            state.currentFellowship?.id === id ? updated : state.currentFellowship,
        })),
    )
  }

  async delete(id: string): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteFellowshipUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      () =>
        this.store.setState((state) => ({
          submitting: false,
          fellowships: state.fellowships.filter((f) => f.id !== id),
          currentFellowship:
            state.currentFellowship?.id === id ? null : state.currentFellowship,
        })),
    )
  }
}
