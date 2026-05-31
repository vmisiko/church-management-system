import type { DataError } from './domain/DataError'
import type { Analytics } from './utility/Analytics'
import type { StoreApi } from 'zustand'
import { toast, type ToastInput } from '@/hooks/use-toast'

export class Ploc<T extends StoreApi<any>> {
  public store: T
  public analytics: Analytics
  // public router: Router

  constructor({ store, analytics }: { store: T; analytics: Analytics;}) {
    this.store = store
    // this.router = router
    this.analytics = analytics
  }

  /**
   * Safe to call from PLOCs (not a React hook).
   */
  protected notify(input: ToastInput) {
    toast(input)
  }

  handleErrors(errors: DataError[] | DataError): string {
    let errString = ''
    if (Array.isArray(errors)) {
      errString = errors.map((error) => error.message).join(', ')
    } else {
      errString = errors.message
    }
    return errString
  }
}
