import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function EnterAmount() {
  const location = useLocation()
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  
  const senderId = localStorage.getItem("customer_id")
  const receiverId = location.state?.upiId || ""

  const handleNext = () => {
    if (!amount || Number(amount) <= 0) {
      setError("Enter valid amount")
      return
    }

    if (!senderId) {
       setError("Session expired. Please login.")
       return
    }

    if (!receiverId) {
       setError("Receiver ID is missing. Please scan QR again.")
       return
    }

    const finalPaymentData = {
      sender: senderId,
      receiver: receiverId,
      amount: Number(amount),
      type: "UPI"
    }

    const sessionId = Date.now().toString()
    localStorage.setItem(`payment_session_${sessionId}`, JSON.stringify(finalPaymentData))

    const handleMessage = (event: MessageEvent) => {
      if (event.data === "GATEWAY_SUCCESS") {
        window.removeEventListener("message", handleMessage)
        localStorage.removeItem("payment_data") 
        navigate("/customer-dashboard", { state: { refresh: true }, replace: true })
      }
    }
    window.addEventListener("message", handleMessage)

    const gatewayUrl = `${window.location.origin}/secure-gateway?session=${sessionId}`
    const popup = window.open(gatewayUrl, "_blank", "width=450,height=600,top=100,left=100,menubar=no,toolbar=no,location=no,status=no,resizable=no")
    
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      alert("Secure Gateway popup was blocked. Please allow popups for this site and try again.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-2xl w-96 shadow-xl">

        <h2 className="text-xl font-bold mb-6 text-center">
          💰 Enter Amount
        </h2>

        <input
          type="number"
          placeholder="Enter Amount"
          className="w-full p-3 mb-4 rounded bg-slate-800 border border-slate-700"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleNext}
          className="w-full bg-purple-600 p-3 rounded-xl font-semibold"
        >
          Continue
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

      </div>
    </div>
  )
}