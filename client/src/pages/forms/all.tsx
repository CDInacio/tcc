import { useGetForms } from '@/hooks/use-get-forms.hook'

export function All() {
  const { data: forms, isLoading, isError, error } = useGetForms()

  if (isError && error) {
    return <p className="text-gray-300"> {(error as Error).message}</p>
  }

  // const isLoading = true

  return (
    <div>
      {}
      {/* {isLoading ? <p>loading...</p> : null} */}
    </div>
  )
}
