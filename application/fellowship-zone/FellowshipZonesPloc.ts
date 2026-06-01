import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { FellowshipZonesState } from './useFellowshipZonesState'
import type { GetFellowshipZonesUseCase } from '@/domain/usecases/fellowship-zone/GetFellowshipZonesUseCase'
import type { GetFellowshipZoneByIdUseCase } from '@/domain/usecases/fellowship-zone/GetFellowshipZoneByIdUseCase'
import type { CreateFellowshipZoneUseCase } from '@/domain/usecases/fellowship-zone/CreateFellowshipZoneUseCase'
import type { UpdateFellowshipZoneUseCase } from '@/domain/usecases/fellowship-zone/UpdateFellowshipZoneUseCase'
import type { DeleteFellowshipZoneUseCase } from '@/domain/usecases/fellowship-zone/DeleteFellowshipZoneUseCase'
import type {
  CreateFellowshipZoneRequest,
  UpdateFellowshipZoneRequest,
} from '@/domain/entities/fellowship-zone/FellowshipZone'

export class FellowshipZonesPloc extends Ploc<StoreApi<FellowshipZonesState>> {
  private readonly getFellowshipZonesUseCase: GetFellowshipZonesUseCase
  private readonly getFellowshipZoneByIdUseCase: GetFellowshipZoneByIdUseCase
  private readonly createFellowshipZoneUseCase: CreateFellowshipZoneUseCase
  private readonly updateFellowshipZoneUseCase: UpdateFellowshipZoneUseCase
  private readonly deleteFellowshipZoneUseCase: DeleteFellowshipZoneUseCase

  constructor({
    store,
    getFellowshipZonesUseCase,
    getFellowshipZoneByIdUseCase,
    createFellowshipZoneUseCase,
    updateFellowshipZoneUseCase,
    deleteFellowshipZoneUseCase,
  }: {
    store: StoreApi<FellowshipZonesState>
    getFellowshipZonesUseCase: GetFellowshipZonesUseCase
    getFellowshipZoneByIdUseCase: GetFellowshipZoneByIdUseCase
    createFellowshipZoneUseCase: CreateFellowshipZoneUseCase
    updateFellowshipZoneUseCase: UpdateFellowshipZoneUseCase
    deleteFellowshipZoneUseCase: DeleteFellowshipZoneUseCase
  }) {
    super({ store })
    this.getFellowshipZonesUseCase = getFellowshipZonesUseCase
    this.getFellowshipZoneByIdUseCase = getFellowshipZoneByIdUseCase
    this.createFellowshipZoneUseCase = createFellowshipZoneUseCase
    this.updateFellowshipZoneUseCase = updateFellowshipZoneUseCase
    this.deleteFellowshipZoneUseCase = deleteFellowshipZoneUseCase
  }

  async fetchAll() {
    this.store.setState({ loading: true, error: null })
    const result = await this.getFellowshipZonesUseCase.execute()
    result.fold(
      (err) => this.store.setState({ loading: false, error: this.handleError(err) }),
      (fellowshipZones) => this.store.setState({ loading: false, fellowshipZones }),
    )
  }

  async fetchById(id: string) {
    this.store.setState({ loading: true, error: null })
    const result = await this.getFellowshipZoneByIdUseCase.execute(id)
    result.fold(
      (err) => this.store.setState({ loading: false, error: this.handleError(err) }),
      (selectedFellowshipZone) => this.store.setState({ loading: false, selectedFellowshipZone }),
    )
  }

  async create(params: CreateFellowshipZoneRequest) {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createFellowshipZoneUseCase.execute(params)
    result.fold(
      (err) => this.store.setState({ submitting: false, error: this.handleError(err) }),
      (newZone) =>
        this.store.setState((state) => ({
          submitting: false,
          fellowshipZones: [...state.fellowshipZones, newZone],
        })),
    )
    return result
  }

  async update(id: string, params: UpdateFellowshipZoneRequest) {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateFellowshipZoneUseCase.execute(id, params)
    result.fold(
      (err) => this.store.setState({ submitting: false, error: this.handleError(err) }),
      (updatedZone) =>
        this.store.setState((state) => ({
          submitting: false,
          fellowshipZones: state.fellowshipZones.map((z) =>
            z.id === updatedZone.id ? updatedZone : z,
          ),
          selectedFellowshipZone:
            state.selectedFellowshipZone?.id === updatedZone.id
              ? updatedZone
              : state.selectedFellowshipZone,
        })),
    )
    return result
  }

  async delete(id: string) {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteFellowshipZoneUseCase.execute(id)
    result.fold(
      (err) => this.store.setState({ submitting: false, error: this.handleError(err) }),
      () =>
        this.store.setState((state) => ({
          submitting: false,
          fellowshipZones: state.fellowshipZones.filter((z) => z.id !== id),
          selectedFellowshipZone:
            state.selectedFellowshipZone?.id === id ? null : state.selectedFellowshipZone,
        })),
    )
    return result
  }

  clearError() {
    this.store.setState({ error: null })
  }

  selectFellowshipZone(zone: FellowshipZonesState['selectedFellowshipZone']) {
    this.store.setState({ selectedFellowshipZone: zone })
  }
}
