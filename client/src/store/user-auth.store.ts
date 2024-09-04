import { create } from 'zustand'
import { User } from '../types/user.type'


interface State {
  user: User | null
}

interface Actions {
  setUserData: (data: User) => void
  logout: () => void
}

const useAuthStore = create<State & Actions>((set) => ({
  user: null,
  setUserData: (data: User) => {
    set({ user: data })
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userToken')
    set({ user: null })
  },
}))

export default useAuthStore
