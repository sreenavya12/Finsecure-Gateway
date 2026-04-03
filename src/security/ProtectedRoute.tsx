import { Navigate } from "react-router-dom"
import React from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const tunnel = localStorage.getItem("secure_tunnel")

  if (!tunnel) {
    return <Navigate to="/" replace />
  }

  return children
}