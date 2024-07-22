export interface Schedule {
  id: string
  date: string
  slot: Slot[]
}

export interface Slot {
  id: string
  time: string
  status: string
  description: string
  scheduleId: string
}
