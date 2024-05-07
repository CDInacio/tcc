import { privateRequest } from '@/utils/api'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createBooking(data: any) {
  const response = await privateRequest.post('/booking/create', data)
  return response.data
}

export async function getBookings() {
  try {
    const response = await privateRequest.get('/booking')
    return response.data
  } catch (error) {
    console.log(error)
  }
}
