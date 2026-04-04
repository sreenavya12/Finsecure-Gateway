import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import SecureGateway from "./SecureGateway"

export default function EnterAmount() {
  const location = useLocation()
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [showGateway, setShowGateway] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  
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

    setPaymentData(finalPaymentData)
    setShowGateway(true)
  }

  const handleGatewaySuccess = () => {
    setShowGateway(false)
    navigate("/customer-dashboard", { state: { refresh: true }, replace: true })
  }

  const handleGatewayCancel = () => {
    setShowGateway(false)
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

      {showGateway && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full h-full max-w-4xl max-h-[800px] bg-black border border-blue-900/30 rounded-none lg:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(30,58,138,0.5)] relative">
              <button 
                onClick={handleGatewayCancel}
                className="absolute top-4 right-4 z-[110] text-slate-500 hover:text-white transition"
              >
                ✕
              </button>
              <SecureGateway 
                paymentData={paymentData} 
                onSuccess={handleGatewaySuccess}
                onCancel={handleGatewayCancel}
              />
           </div>
        </div>
      )}
    </div>
  )
}