import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function EmployeeRegister() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("retail")

  const handleRegister = async () => {

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert("Registration failed")
      return
    }

    await supabase.from("profiles").insert([
      {
        id: data.user?.id,
        role: role
      }
    ])

    alert("Employee Registered Successfully")
    window.location.href = "/employee-login"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-white relative overflow-hidden font-sans">
      
      {/* Background Green Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 transition-all duration-500">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Enroll Employee
          </h2>
          <p className="text-slate-400 text-sm mt-2">Provision new FinSecure Identity</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Corporate Email Address</label>
            <input
              placeholder="employee@bank.com"
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-green-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Initial Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-green-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Organizational Role</label>
            <div className="relative">
              <select
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-green-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner appearance-none cursor-pointer"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="retail">Retail Domain</option>
                <option value="corporate">Corporate Domain</option>
                <option value="operations">Operations Domain</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white p-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-2"
          >
            Provision Account
          </button>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-800 text-center">
          <button
            onClick={() => window.location.href = "/employee-login"}
            className="text-sm text-slate-400 hover:text-green-400 transition-colors font-medium underline decoration-transparent hover:decoration-green-500/30 underline-offset-4"
          >
            Return to employee login
          </button>
        </div>
      </div>
    </div>
  )
}