import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminLogin() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    if (!username || !password) {
      setError("All fields required")
      setLoading(false)
      return
    }

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: username.trim(),
      password: password
    })

    if (loginError || !data.user) {
      setError("Invalid Admin Credentials")
      setLoading(false)
      return
    }

    // 🔐 Verify role is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      setError("Access Denied: Not an Admin")
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    // ✅ Direct redirect
    navigate("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-white relative overflow-hidden font-sans">
      
      {/* Background Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
            Admin Console
          </h2>
          <p className="text-slate-400 text-sm mt-2">FinSecure Authorization Required</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Admin Identity</label>
            <input
              placeholder="admin@finsecure.net"
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-red-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Clearance Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-red-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all flex justify-center items-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Establish Secure Connection"}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-950/50 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-3">
              <span className="text-red-400 shrink-0 font-bold">!</span>
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}