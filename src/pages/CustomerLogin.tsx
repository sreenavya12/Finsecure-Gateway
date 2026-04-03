import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import bcrypt from "bcryptjs"
import { useNavigate } from "react-router-dom"

export default function CustomerLogin() {
  const navigate = useNavigate()

  const [customerInput, setCustomerInput] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState(1)
  const [mpin, setMpin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [captchaQuestion, setCaptchaQuestion] = useState("")
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")

  // 🔹 Generate Captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    setCaptchaQuestion(`${num1} + ${num2}`)
    setCaptchaAnswer((num1 + num2).toString())
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  // ================= PASSWORD STEP =================
  const handlePasswordCheck = async () => {
    setError("")
    setLoading(true)

    const trimmedInput = customerInput.trim()

    if (!trimmedInput || !password) {
      setError("All fields required")
      setLoading(false)
      return
    }

    if (captchaInput !== captchaAnswer) {
      setError("Human verification failed")
      generateCaptcha()
      setCaptchaInput("")
      setLoading(false)
      return
    }

    const { data, error: fetchError } = await supabase
      .from("customers")
      .select("*")
      .or(`customer_id.eq.${trimmedInput},mobile_number.eq.${trimmedInput}`)
      .single()

    if (fetchError || !data) {
      setError("Invalid Customer ID or Mobile Number")
      generateCaptcha()
      setLoading(false)
      return
    }

    if (data.account_locked) {
      setError("Account Locked. Contact Bank.")
      setLoading(false)
      return
    }

    const valid = await bcrypt.compare(password, data.password_hash)
    const actualDbId = data.customer_id

    if (!valid) {
      const newAttempts = (data.failed_attempts || 0) + 1

      await supabase
        .from("customers")
        .update({ failed_attempts: newAttempts })
        .eq("customer_id", actualDbId)

      if (newAttempts >= 3) {
        await supabase
          .from("customers")
          .update({ account_locked: true })
          .eq("customer_id", actualDbId)

        setError("Account Locked due to multiple failed attempts.")
      } else {
        setError(`Incorrect Password. Attempt ${newAttempts} of 3.`)
        generateCaptcha()
      }

      setLoading(false)
      return
    }

    // Reset attempts
    await supabase
      .from("customers")
      .update({ failed_attempts: 0 })
      .eq("customer_id", actualDbId)

    setCustomerInput(actualDbId)
    setStep(2)
    setLoading(false)
  }

  // ================= MPIN STEP (4 DIGIT) =================
  const handleMpinCheck = async () => {
    setError("")
    setLoading(true)

    // ✅ Only 4 digits allowed
    if (!/^\d{4}$/.test(mpin)) {
      setError("MPIN must be exactly 4 digits")
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("customer_id", customerInput)
      .single()

    if (!data) {
      setError("Session expired. Please restart login.")
      setStep(1)
      setLoading(false)
      return
    }

    const valid = await bcrypt.compare(mpin, data.mpin_hash)

    if (!valid) {
      setError("Incorrect MPIN")
      setLoading(false)
      return
    }

    // ✅ SUCCESS LOGIN
    localStorage.setItem("customer_id", customerInput)

// 🔥 Force storage event update
window.dispatchEvent(new Event("storage"))

navigate("/customer-dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-white relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Customer Portal
          </h2>
          <p className="text-slate-400 text-sm mt-2">Secure identity verification</p>
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Identity ID or Mobile</label>
              <input
                placeholder="Enter ID"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                onChange={(e) => setCustomerInput(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-sm text-slate-400 font-medium">Verification: <span className="text-blue-400 text-lg ml-2 tracking-widest">{captchaQuestion}</span></span>
              <input
                placeholder="Result"
                className="w-20 p-2 text-center rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none transition-all"
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              onClick={handlePasswordCheck}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all flex justify-center items-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Authenticate Identity"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center p-4 bg-slate-950/50 rounded-xl border border-blue-500/20 mb-2">
              <p className="text-blue-400 text-sm font-medium mb-1">Step 1 Verified</p>
              <p className="text-slate-300 text-xs">Enter your 4-digit security MPIN to continue.</p>
            </div>
            
            <div>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                placeholder="• • • •"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-green-500 focus:bg-slate-900 outline-none transition-all text-center text-3xl tracking-[1em] shadow-inner font-mono text-green-400 placeholder:text-slate-600/50"
                onChange={(e) => setMpin(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              onClick={handleMpinCheck}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex justify-center items-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Unlock Dashboard"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-950/50 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="pt-8 mt-8 border-t border-slate-800 text-center">
          <button
            onClick={() => navigate("/customer-register")}
            className="text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium inline-flex items-center space-x-2"
          >
            <span>New customer?</span>
            <span className="text-blue-400 underline decoration-blue-500/30 underline-offset-4">Register your identity</span>
          </button>
        </div>

      </div>
    </div>
  )
}