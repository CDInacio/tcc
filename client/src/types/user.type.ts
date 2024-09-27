export interface User {
  id: string | undefined
  fullname: string
  email: string
  phoneNumber: string
  password?: string
  role: string
  profileImage?: string
  createdAt: string
}
