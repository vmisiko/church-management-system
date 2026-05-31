import { cookies } from 'next/headers'
import CustomAxios from '@/core/utility/CustomAxios'

export function makeServerAxios() {
  const getToken = () => cookies().get('accessToken')?.value ?? null
  return new CustomAxios({ getToken })
}

