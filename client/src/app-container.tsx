import { QueryClientProvider, QueryClient } from 'react-query'
import App from './App.tsx'
import { Toaster } from './components/ui/toaster.tsx'

const client = new QueryClient()

export function AppContainer() {
  return (
    <QueryClientProvider client={client}>
      <App />
      <Toaster />
    </QueryClientProvider>
  )
}
