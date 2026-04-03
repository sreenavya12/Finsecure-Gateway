import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .single()

      setProfile(data)
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to FinSecure Gateway
      </h1>

      {profile && (
        <div className="bg-white/10 p-6 rounded-xl">
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 px-6 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  )
}