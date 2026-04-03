import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAuth = async () => {
    setLoading(true)
    setError("")

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          await supabase.from("profiles").insert([
            {
              id: data.user.id,
              full_name: fullName,
              role: "retail"
            }
          ])
        }
      } else {
        // 1. Sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        // 2. Fetch user data and role for the security log
        const { data: userData } = await supabase.auth.getUser()

        if (userData.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userData.user.id) // Specific ID check is safer
            .single()

          // 3. Insert the security log
          await supabase.from("security_logs").insert([
            {
              user_id: userData.user.id,
              action: "LOGIN",
              role: profile?.role
            }
          ])
        }
      }
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          FinSecure Gateway
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Processing..." : isSignup ? "Create Account" : "Login"}
        </button>

        <p
          onClick={() => setIsSignup(!isSignup)}
          className="text-gray-300 text-sm mt-4 text-center cursor-pointer hover:underline"
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  )
}