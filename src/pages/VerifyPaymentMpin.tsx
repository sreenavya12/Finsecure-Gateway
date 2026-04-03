import { useState } from "react"
import { supabase } from "../lib/supabase"
import bcrypt from "bcryptjs"
import { useNavigate } from "react-router-dom"

export default function VerifyPaymentMpin() {
  const navigate = useNavigate()
  const [mpin, setMpin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
  setError("")
  setLoading(true)

  if (!/^\d{4}$/.test(mpin)) {
    setError("Enter a valid MPIN")
    setLoading(false)
    return
  }

  const customerId = localStorage.getItem("customer_id")
  const paymentData = JSON.parse(localStorage.getItem("payment_data") || "{}")

  if (!customerId || !paymentData.receiver || !paymentData.amount) {
    setError("Payment session expired")
    setLoading(false)
    return
  }

  try {
    // 1️⃣ Verify MPIN
    const { data: customer, error: mpinError } = await supabase
      .from("customers")
      .select("mpin_hash")
      .eq("customer_id", customerId)
      .single()

    if (mpinError || !customer) {
      throw new Error("MPIN verification failed")
    }

    const valid = await bcrypt.compare(mpin, customer.mpin_hash)

    if (!valid) {
      setError("Incorrect MPIN")
      setLoading(false)
      return
    }

    // 2️⃣ Call transfer RPC
    const { data: result, error: rpcError } = await supabase.rpc(
      "transfer_funds",
      {
        sender: customerId,
        receiver: paymentData.receiver,
        amount: Number(paymentData.amount),
        payment_method: paymentData.type || "TRANSFER",
      }
    )

    console.log("RPC Result:", result)
    console.log("RPC Error:", rpcError)

    if (rpcError) {
      setError(rpcError.message || "Payment failed")
      setLoading(false)
      return
    }

    // 3️⃣ SUCCESS
    localStorage.removeItem("payment_data")

    navigate("/customer-dashboard", {
      state: { refresh: true },
      replace: true,
    })

  } catch (err: any) {
    console.error("Payment error:", err)
    setError(err.message || "Something went wrong")
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-2xl w-96 shadow-2xl border border-slate-800">
        
        <div className="text-center mb-6">
          <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-xl font-bold">Verify Payment</h2>
          <p className="text-sm text-slate-400 mt-1">Enter your secure MPIN to confirm</p>
        </div>

        <input
  type="password"
  maxLength={4}
  inputMode="numeric"
  placeholder="••••"
  className="w-full p-4 mb-6 rounded-xl bg-slate-950 border border-slate-700 text-center text-2xl tracking-[1em] focus:border-blue-500 outline-none transition-all"
  onChange={(e) => setMpin(e.target.value)}
  autoFocus
/>

        <button
          disabled={loading}
          onClick={handlePayment}
          className={`w-full p-4 rounded-xl font-bold transition-all ${
            loading 
              ? "bg-slate-700 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Confirm & Pay"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/40 rounded-lg">
            <p className="text-red-400 text-xs text-center font-medium">{error}</p>
          </div>
        )}

        <button 
          onClick={() => navigate(-1)}
          className="w-full mt-4 text-sm text-slate-500 hover:text-slate-300 transition"
        >
          Cancel Transaction
        </button>
      </div>
    </div>
  )
}