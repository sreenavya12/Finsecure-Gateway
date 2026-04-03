import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {

  const tunnel = localStorage.getItem("secure_tunnel")

  if (!tunnel) {
    return <Navigate to="/" replace />
  }

  return children
}