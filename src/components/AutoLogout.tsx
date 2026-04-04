import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

/**
 * 🔐 Global Auto-Logout Component
 * Tracks inactivity and logs out after 10 minutes.
 */
export default function AutoLogout() {
  const location = useLocation()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // 🕒 10-minute timeout (600,000 ms)
  const TIMEOUT_DURATION = 10 * 60 * 1000 

  const handleLogout = () => {
    // Only logout if we are in a protected area (Customer/Employee)
    const isPublic = ["/", "/customer-login", "/customer-register", "/admin-login", "/employee-login"].includes(location.pathname)
    
    if (!isPublic) {
      console.log("🕒 Inactivity detected. Logging out...")
      localStorage.removeItem("customer_id")
      sessionStorage.clear()
      // Force reload to clear all states and navigate home
      window.location.href = "/"
    }
  }

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(handleLogout, TIMEOUT_DURATION)
  }

  useEffect(() => {
    // Events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click"
    ]

    // Reset timer on load
    resetTimer()

    // Add listeners
    events.forEach(event => {
       window.addEventListener(event, resetTimer)
    })

    return () => {
      // Cleanup listeners
      events.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return null // This component doesn't render anything
}
