import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function EmployeeLogin() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    const trimmedEmail = identifier.trim()

    if (!trimmedEmail || !password) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    // 🔐 Step 1: Sign in
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password
    })

    if (loginError || !data.user) {
      setError("Invalid Employee Credentials")
      setLoading(false)
      return
    }

    // 🔐 Step 2: Check role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (!profile || profile.role === "admin") {
      // If admin, redirect to admin login flow instead
      navigate("/admin")
      setLoading(false)
      return
    }

    if (
      profile.role !== "retail" &&
      profile.role !== "corporate" &&
      profile.role !== "operations"
    ) {
      setError("Unauthorized role detected")
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    // ✅ Successful employee login
    navigate("/employee-dashboard")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-white relative overflow-hidden font-sans">
      
      {/* Background Green Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            Employee Portal
          </h2>
          <p className="text-slate-400 text-sm mt-2">Zero Trust Workspace Access</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Corporate Identity</label>
            <input
              placeholder="name@bank.com"
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-green-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-green-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex justify-center items-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Authenticate Tunnel"}
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

        <div className="pt-8 mt-8 border-t border-slate-800 text-center">
          <button
            onClick={() => navigate("/employee-register")}
            className="text-sm text-slate-400 hover:text-green-400 transition-colors font-medium inline-flex items-center space-x-2"
          >
            <span>New staff member?</span>
            <span className="text-green-400 underline decoration-green-500/30 underline-offset-4">Register employee</span>
          </button>
        </div>
      </div>
    </div>
  )
}