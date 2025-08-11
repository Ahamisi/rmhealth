export function formatPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Handle Nigerian phone numbers
  if (cleaned.startsWith('234')) {
    // International format: +234 xxx xxx xxxx
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  } else if (cleaned.startsWith('0')) {
    // Local format: 0xxx xxx xxxx
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  // Default format
  return phone
} 