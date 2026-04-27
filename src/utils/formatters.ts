import dayjs from 'dayjs'

export const formatCurrency = (amount: number, currency = "so'm"): string => {
  return `${new Intl.NumberFormat('uz-UZ').format(amount)} ${currency}`
}

export const formatDate = (date: string, format = 'DD.MM.YYYY'): string => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string): string => {
  return dayjs(date).format('DD.MM.YYYY HH:mm')
}

export const formatPhone = (phone: string): string => {
  // +998901234567 → +998 90 123-45-67
  return phone.replace(/(\+998)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3-$4-$5')
}
