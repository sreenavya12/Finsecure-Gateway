export function createSecureSession(userId: string, role: string) {

  const session = {
    userId,
    role,
    tunnel_id: crypto.randomUUID(),
    created: Date.now(),
    expires_at: Date.now() + 30 * 60 * 1000
  }

  localStorage.setItem("secure_tunnel", JSON.stringify(session))
}

export const verifyTunnel = () => {

  const data = localStorage.getItem("secure_tunnel")

  if (!data) return null

  const session = JSON.parse(data)

  if (Date.now() > session.expires_at) {
    localStorage.removeItem("secure_tunnel")
    return null
  }

  return session
}

export const terminateTunnel = () => {
  localStorage.removeItem("secure_tunnel")
}