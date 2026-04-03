import { useState } from "react"
import { supabase } from "../lib/supabase"
import {
  generateCustomerId,
  generateAccountNumber,
  hashValue
} from "../utils/identity"

export default function CustomerRegister() {
  const [step, setStep] = useState(1)

  const [accountNumber, setAccountNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mpin, setMpin] = useState("")
  const [confirmMpin, setConfirmMpin] = useState("")

  const next = () => setStep(step + 1)
  const back = () => setStep(step - 1)

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (mpin !== confirmMpin) {
      alert("MPIN does not match")
      return
    }

    if (!fullName || !mobile || !password || !mpin) {
      alert("Please fill all required fields")
      return
    }

    const customerId = generateCustomerId()
    const accNumber = accountNumber || generateAccountNumber()

    const passwordHash = await hashValue(password)
    const mpinHash = await hashValue(mpin)

    const { error } = await supabase.from("customers").insert([
      {
        customer_id: customerId,
        account_number: accNumber,
        mobile_number: mobile,
        full_name: fullName,
        bank_name: "FinSecure Bank",
        ifsc_code: "FSEC0001234",
        password_hash: passwordHash,
        mpin_hash: mpinHash,
        face_registered: true,
        balance: 5000
      }
    ])

    if (error) {
      console.error("Registration error:", error)
      if (error.code === '23505') {
        alert("Registration failed: Mobile number or account already registered.")
      } else {
        alert(`Registration failed: ${error.message || "Unknown error occurring"}`)
      }
      return
    }

    alert(`Registration Successful\nCustomer ID: ${customerId}`)
    window.location.href = "/customer-login"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-white relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 transition-all duration-500">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Create Identity
          </h2>
          <p className="text-slate-400 text-sm mt-2">FinSecure Customer Registration</p>
          
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : s < step ? 'w-4 bg-blue-500/50' : 'w-4 bg-slate-800'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
              <input
                placeholder="Ex. John Doe"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Account Link (Optional)</label>
              <input
                placeholder="Ex. 123456789"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Mobile Number</label>
              <input
                placeholder="+91 98765 43210"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <button
              onClick={next}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] mt-4"
            >
              Continue Securely
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Master Password</label>
              <input
                type="password"
                placeholder="Create Password"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Confirm Master Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={back} className="w-1/3 p-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium">Back</button>
              <button onClick={next} className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">Set Password</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Create 4-Digit MPIN</label>
              <input
                type="password"
                maxLength={4}
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all text-center text-2xl tracking-[0.5em] shadow-inner font-mono text-white"
                value={mpin}
                onChange={(e) => setMpin(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Verify MPIN</label>
              <input
                type="password"
                maxLength={4}
                className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all text-center text-2xl tracking-[0.5em] shadow-inner font-mono text-white"
                value={confirmMpin}
                onChange={(e) => setConfirmMpin(e.target.value)}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={back} className="w-1/3 p-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium">Back</button>
              <button onClick={next} className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">Secure PIN</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center">
            
            <div className="w-24 h-24 bg-green-500/10 rounded-full border border-green-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)] mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M12 17h.01"/><path d="M9 10a3 3 0 0 1 6 0"/></svg>
            </div>
            
            <p className="text-center text-sm text-green-400 font-medium">
              Simulation: Biometric Profile Stored
            </p>
            <p className="text-center text-xs text-slate-400 mt-2 px-4 mb-4">
              Your identity is ready to be securely vaulted inside the decentralized storage.
            </p>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all mt-4"
            >
              Vault Identity & Finish
            </button>
          </div>
        )}

      </div>
    </div>
  )
}