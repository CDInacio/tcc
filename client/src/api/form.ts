import { Form } from '@/types/form.typep'
import { privateRequest } from '@/utils/api'
import { isAxiosError } from 'axios'

export const createForm = async (form: Form) => {
  try {
    const response = await privateRequest.post('/admin/form/create', form)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const getForms = async () => {
  try {
    const response = await privateRequest.get('/users/forms')
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message)
    }
  }
}
