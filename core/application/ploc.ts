import type { StoreApi } from 'zustand'
import type { DataError } from '@/core/domain/DataError'

/**
 * Base class for all Ploc (Presentation Logic Component) classes.
 *
 * A Ploc holds a reference to a Zustand StoreApi and exposes business-facing
 * methods that orchestrate use-cases, update store state, and handle errors.
 * It is the Next.js equivalent of a Flutter BLoC or a Vue *Ploc class.
 *
 * Usage:
 *   class MembersPloc extends Ploc<StoreApi<MembersState>> {
 *     constructor({ store, getMembersUseCase }: {...}) {
 *       super({ store })
 *       this.getMembersUseCase = getMembersUseCase
 *     }
 *     async fetchMembers() {
 *       this.store.setState({ loading: true })
 *       const result = await this.getMembersUseCase.execute()
 *       result.fold(
 *         (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
 *         (members) => this.store.setState({ loading: false, members }),
 *       )
 *     }
 *   }
 */
export abstract class Ploc<S extends StoreApi<object>> {
  protected readonly store: S

  constructor({ store }: { store: S }) {
    this.store = store
  }

  /** Converts a typed DataError into a human-readable message string. */
  protected handleError(error: DataError): string {
    return error.message
  }
}
