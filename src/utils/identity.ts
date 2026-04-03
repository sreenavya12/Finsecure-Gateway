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