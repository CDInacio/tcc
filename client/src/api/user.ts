import { UserSigninCredentials, UserSignupCredentials } from '@/types/auth.type'
import { api } from '@/utils/api'

export async function signup(credentials: UserSignupCredentials) {
  const response = await api.post('/users/signup', credentials)
  return response.data
}

export async function signin(credentials: UserSigninCredentials) {
  const response = await api.post('/users/signin', credentials)
  return response.data
}
