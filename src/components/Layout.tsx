import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

interface Props {
  children: React.ReactNode
  role: string
}

export default function Layout({ children, role }: Props) {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  // Centralized logout function to handle both manual and auto-expiry
  const performLogout = async (isAuto: boolean = false) => {
    try {
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user) {
        await supabase.from("security_logs").insert([
          {
            user_id: userData.user.id,
            action: isAuto ? "SESSION_EXPIRED" : "LOGOUT",
            role: role
          }
        ])
      }
    } catch (err) {
      console.error("Failed to log logout action:", err)
    } finally {
      await supabase.auth.signOut()
      navigate("/")
    }
  }

  useEffect(() => {
    let interval: any

    const getSessionExpiry = async () => {
      const { data } = await supabase.auth.getSession()
      const expiresAt = data.session?.expires_at

      if (!expiresAt) return

      const expiryTime = expiresAt * 1000

      const updateTimer = () => {
        const remaining = expiryTime - Date.now()
        setTimeLeft(Math.max(remaining, 0))

        if (remaining <= 0) {
          clearInterval(interval)
          performLogout(true) // Trigger auto-logout
        }
      }

      updateTimer()
      interval = setInterval(updateTimer, 1000)
    }

    getSessionExpiry()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [navigate])

  const handleLogout = async () => {
    await performLogout(false) // Trigger manual logout
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8">FinSecure Gateway</h2>
          <nav className="space-y-4">
            <button
              onClick={() => navigate(`/${role}`)}
              className="w-full text-left hover:text-blue-400"
            >
              Dashboard
            </button>
            <button
  onClick={() => navigate("/logs")}
  className="w-full text-left hover:text-blue-400"
>
  Security Logs
</button>
            <button className="w-full text-left hover:text-blue-400">
              Settings
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold capitalize">
            {role} Environment
          </h1>

          <div
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              timeLeft !== null && timeLeft < 60000
                ? "bg-red-600 animate-pulse"
                : "bg-green-600"
            }`}
          >
            {timeLeft !== null
              ? `Session expires in ${formatTime(timeLeft)}`
              : "Checking session..."}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}