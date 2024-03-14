import { privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

export const createForm = async (form) => {
  try {
    await privateRequest.post('/admin/form/create', form)
  } catch (error) {
    console.log(error)
  }
}

export const getForms = async () => {
  try {
    const response = await privateRequest.get('/admin/forms')
    console.log(response)
    // return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message)
    }
  }
}
