import { UserSigninCredentials, UserSignupCredentials } from '@/types/auth.type'
import { api, privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

interface SigninResponse {
  token: string
  user: {
    name: string
    email: string
    role: string
  }
}

export async function signup(credentials: UserSignupCredentials) {
  try {
    const response = await api.post('/users/signup', credentials)
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message)
    }
    throw error
  }
}

export async function signin(
  credentials: UserSigninCredentials
): Promise<SigninResponse> {
  try {
    const response = await api.post('/users/signin', credentials)
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message)
    }
    throw error
  }
}

export async function getAllUsers() {
  const response = await privateRequest.get('/users/getAll')
  return response.data
}
