import type CustomAxios from '@/core/utility/CustomAxios'

export class BaseRepository {
  public axios

  constructor({ axios }: { axios: CustomAxios }) {
    this.axios = axios
  }
}
