import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import bcrypt from "bcryptjs"

interface SecureGatewayProps {
  onSuccess?: () => void
  onCancel?: () => void
  paymentData?: any
}

export default function SecureGateway({ onSuccess, onCancel, paymentData: initialPaymentData }: SecureGatewayProps) {
  const [mpin, setMpin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(initialPaymentData || null)

  useEffect(() => {
    if (initialPaymentData) {
      setPaymentData(initialPaymentData)
      return
    }

    // Look for payment session in local storage or URL
    const searchParams = new URLSearchParams(window.location.search)
    const sessionId = searchParams.get("session")
    
    // We expect the session data to be placed in localStorage before opening this gateway
    if (sessionId) {
      const data = JSON.parse(localStorage.getItem(`payment_session_${sessionId}`) || "null")
      
      // 🔐 Zero-Trust Check: Ensure the sender in the token matches the global identity
      const activeCustomer = localStorage.getItem("customer_id")
      if (data && data.sender !== activeCustomer) {
        setError("Cross-session payment attempt blocked. Identity mismatch.")
        setPaymentData(null)
        return
      }

      setPaymentData(data)
    }

    // 30 second automatic kill switch
    const timeoutMsg = setTimeout(() => {
      if (!success) {
        setError("Session timed out (30s). Destroying terminal...")
        setTimeout(() => killSubdomain(), 2000)
      }
    }, 30000)

    return () => clearTimeout(timeoutMsg)
  }, [success, initialPaymentData])

  const killSubdomain = () => {
    // 1. Handle prop callbacks (for Modal/Embedded use)
    if (success && onSuccess) {
      onSuccess()
      return
    }
    if (!success && onCancel) {
      onCancel()
      return
    }

    // 2. Handle cross-window messaging (for Popup use)
    if (window.opener) {
      window.opener.postMessage(success ? "GATEWAY_SUCCESS" : "GATEWAY_CANCEL", "*")
    }
    
    // 3. Cleanup session data
    const searchParams = new URLSearchParams(window.location.search)
    const sessionId = searchParams.get("session")
    if (sessionId) {
      localStorage.removeItem(`payment_session_${sessionId}`)
    }
    
    // Only close if it's not embedded
    if (!onSuccess && !onCancel) {
      window.close()
    }
  }

  const handlePayment = async () => {
    setError("")
    setLoading(true)

    if (!/^\d{4}$/.test(mpin)) {
      setError("Enter a valid MPIN")
      setLoading(false)
      return
    }

    if (!paymentData || !paymentData.sender || !paymentData.receiver || !paymentData.amount) {
      setError("Invalid or expired payment terminal session")
      setLoading(false)
      return
    }

    try {
      // 1. Verify MPIN (Hash logic based on previous VerifyPaymentMpin)
      const { data: customer, error: mpinError } = await supabase
        .from("customers")
        .select("mpin_hash")
        .eq("customer_id", paymentData.sender)
        .single()

      if (mpinError || !customer) {
        throw new Error("MPIN verification failed")
      }

      const valid = await bcrypt.compare(mpin, customer.mpin_hash)

      if (!valid) {
        throw new Error("Incorrect MPIN")
      }

      // 2. Call transfer RPC
      const { data: result, error: rpcError } = await supabase.rpc(
        "transfer_funds",
        {
          sender: paymentData.sender,
          receiver: paymentData.receiver,
          amount: Number(paymentData.amount),
          payment_method: paymentData.type || "TRANSFER",
        }
      )

      if (rpcError) {
        throw new Error(rpcError.message || "Payment processing failed")
      }

      if (result !== "SUCCESS") {
        throw new Error(`Transaction error: ${result}`)
      }

      // 3. SUCCESS / KILL SUBDOMAIN
      setSuccess(true)
      
      // Auto-kill in 2 seconds
      setTimeout(() => {
        killSubdomain()
      }, 2000)

    } catch (err: any) {
      console.error("Payment terminal error:", err)
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-4">
         <h1 className="text-red-500 font-bold text-2xl mb-4">TERMINAL ERROR</h1>
         <p className="text-slate-400">Payment session missing or invalid.</p>
         <button onClick={() => window.close()} className="mt-8 px-6 py-2 border border-slate-700 hover:bg-slate-900 transition">CLOSE TERMINAL</button>
      </div>
    )
  }

  if (success) {
    return (
       <div className="min-h-screen bg-black text-emerald-400 flex flex-col items-center justify-center font-mono p-4">
         <div className="w-20 h-20 rounded-full border-2 border-emerald-500 flex justify-center items-center mb-6 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
         </div>
         <h1 className="font-bold text-2xl mb-2 tracking-widest uppercase">Transaction Approved</h1>
         <p className="text-slate-400 text-sm mb-8">Amount deducted. Updating ledgers.</p>
         <p className="text-xs opacity-50 italic">Killing secure terminal subdomain...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-blue-400 flex items-center justify-center font-mono relative overflow-hidden">
      {/* Simulation lines for subdomain vibe */}
      <div className="absolute inset-0 border-[10px] border-blue-900/30"></div>
      
      <div className="bg-black/80 backdrop-blur-md p-8 rounded-xl w-96 border border-blue-900/50 shadow-[0_0_30px_rgba(30,58,138,0.3)] z-10">
        
        <div className="text-center mb-8 border-b border-blue-900/50 pb-6">
          <div className="bg-blue-950 text-blue-300 text-[10px] px-2 py-1 inline-block rounded mb-4 tracking-widest border border-blue-800">SECURE ENCLAVE</div>
          <h2 className="text-lg font-bold tracking-tight">AUTHORIZE TRANSFER</h2>
          <p className="text-xs text-slate-500 mt-2">Paying {paymentData.receiver} <br/> Amount: ₹{paymentData.amount}</p>
        </div>

        <input
          type="password"
          maxLength={4}
          inputMode="numeric"
          placeholder="MPIN"
          className="w-full p-4 mb-6 bg-slate-950 border border-slate-800 text-center text-3xl tracking-[0.5em] focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600 rounded"
          onChange={(e) => setMpin(e.target.value)}
          autoFocus
        />

        <button
          disabled={loading}
          onClick={handlePayment}
          className={`w-full p-3 font-bold uppercase tracking-widest transition-all rounded ${
            loading 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
              : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-500"
          }`}
        >
          {loading ? "Decrypting / Sending..." : "Confirm & Pay"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-900 rounded">
            <p className="text-red-500 text-xs text-center font-medium">{error}</p>
          </div>
        )}

        <button 
          onClick={killSubdomain}
          className="w-full mt-6 text-xs text-slate-500 hover:text-red-400 transition tracking-widest uppercase"
        >
          [ Abort Session ]
        </button>
      </div>
    </div>
  )
}
