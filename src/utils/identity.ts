import bcrypt from "bcryptjs"

// Generate Customer ID (BANK style)
export const generateCustomerId = () => {
  const random = Math.floor(100000 + Math.random() * 900000)
  return `CUST${random}`
}

// Generate Account Number (12 digit)
export const generateAccountNumber = () => {
  let acc = ""
  for (let i = 0; i < 12; i++) {
    acc += Math.floor(Math.random() * 10)
  }
  return acc
}

// Hash password or MPIN
export const hashValue = async (value: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(value, salt)
}

// Compare hash
export const compareHash = async (
  plain: string,
  hash: string
) => {
  return bcrypt.compare(plain, hash)
}

// Generate 16-digit Virtual Card Number (BANK style)
export const generateVirtualCard = () => {
  let cardNum = ""
  for (let i = 0; i < 16; i++) {
    cardNum += Math.floor(Math.random() * 10)
  }
  
  // Expiry (5 years from now)
  const now = new Date()
  const expMonth = String(now.getMonth() + 1).padStart(2, '0')
  const expYear = String((now.getFullYear() + 5) % 100).padStart(2, '0')
  const expiry = `${expMonth}/${expYear}`
  
  // CVV (3 digits)
  const cvv = String(Math.floor(100 + Math.random() * 900))
  
  return { cardNum, expiry, cvv }
}