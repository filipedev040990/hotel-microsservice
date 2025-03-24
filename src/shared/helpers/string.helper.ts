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
