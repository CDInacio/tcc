import { User } from './user.type'

export interface Form {
  formName: string
  formDescription: string
  fields: Field[]
}

export interface Field {
  type: string
  text: string
  required: boolean
}

export interface FormResponse {
  id: string
  form_name: string
  form_description: string
  user_id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  form_fields: {
    id: string
    field_name: string
    field_type: string
    field_required: boolean
    formId: string
  }[]
  user: User
}
