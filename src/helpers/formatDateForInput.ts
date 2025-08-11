export function formatDateForInput(date: string | Date): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return ''
  
  // Format as YYYY-MM-DD for HTML date inputs
  return dateObj.toISOString().split('T')[0]
} 