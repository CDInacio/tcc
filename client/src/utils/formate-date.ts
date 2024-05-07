export const formateDate = (date: string | undefined, format?: string) => {
  const newDate = new Date(date!)
  const day = newDate.getDate()
  const month = newDate.getMonth() + 1
  const year = newDate.getFullYear()
  const hours = newDate.getHours()
  const minutes = newDate.getMinutes()

  if (format === 'dd/mm/yyyy hh:mm') {
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  return `${day}/${month}/${year}`
}
