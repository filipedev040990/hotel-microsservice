import { randomBytes } from 'crypto'

export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^\d{2}\d{4,5}\d{4}$/
  return regex.test(phoneNumber)
}

export const obfuscateValue = (object: any): object => {
  const valuesToBeObfuscated = ['password']
  valuesToBeObfuscated.forEach(word => {
    if (word in object) {
      object[word] = '[OBFUSCATED]'
    }
  })
  return object
}

export const generateExternalCode = (): string => {
  const numericPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  const alphabeticPart = randomBytes(5).toString('hex').toUpperCase().slice(0, 5)
  const finalNumericPart = Math.floor(Math.random() * 100000).toString().padStart(5, '0')

  return `${numericPart}-${alphabeticPart}-${finalNumericPart}`
}

export const isValidString = (value: string): boolean => {
  return value !== undefined && value.trim() !== '' && value !== null
}
