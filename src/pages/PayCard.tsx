import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar"
import BottomNav from "../components/BottomNav"
import Sidebar from "../components/Sidebar"
import { ShieldCheck, Lock } from "lucide-react"
import SecureGateway from "./SecureGateway"

export default function PayCard() {
  const navigate = useNavigate()
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [receiver, setReceiver] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showGateway, setShowGateway] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  const senderId = localStorage.getItem("customer_id")

  const handleNext = () => {
    if (!cardNumber || !expiry || !cvv || !receiver || !amount) {
      setError("Please fill all details")
      return
    }

    if (!senderId) {
      setError("Session expired.")
      return
    }

    setIsProcessing(true)
    setError("")

    // Simulate Stripe tokenization delay
    setTimeout(() => {
      const data = {
        sender: senderId,
        receiver,
        amount: Number(amount),
        type: "CARD",
        cardEndsWith: cardNumber.slice(-4),
        gateway: "STRIPE"
      }

      setPaymentData(data)
      setShowGateway(true)
      setIsProcessing(false)
    }, 1500)
  }

  const handleGatewaySuccess = () => {
    setShowGateway(false)
    navigate("/customer-dashboard", { state: { refresh: true }, replace: true })
  }

  const handleGatewayCancel = () => {
    setShowGateway(false)
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <Topbar onLogout={() => navigate("/")} />

        <div className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Stripe Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center text-slate-800">
               <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck size={20} className="text-indigo-600" />
                    Secure Checkout
                  </h2>
                  <p className="text-slate-500 text-xs mt-1 font-medium">Powered by <span className="font-bold text-indigo-500">Stripe</span></p>
               </div>
               <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Pay</span>
                  <div className="text-2xl font-black text-slate-800">
                    ₹{amount || "0.00"}
                  </div>
               </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              
              {/* Receiver & Amount Info */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Receiver ID</label>
                  <input
                    type="text"
                    placeholder="e.g. CUST-1234"
                    className="w-full p-3 mt-1 rounded-lg bg-white border border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 mt-1 rounded-lg bg-white border border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold transition"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Card Information */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Card Information</label>
                <div className="border border-slate-300 rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition shadow-sm">
                  <div className="border-b border-slate-200">
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="0000 0000 0000 0000"
                      className="w-full p-3 bg-transparent text-slate-800 outline-none text-sm tracking-widest font-mono placeholder-slate-400"
                      value={cardNumber}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '')
                        val = val.replace(/(.{4})/g, '$1 ').trim()
                        setCardNumber(val)
                      }}
                    />
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM / YY"
                      className="w-1/2 p-3 bg-transparent border-r border-slate-200 text-slate-800 outline-none text-sm font-mono placeholder-slate-400"
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '')
                        if (val.length >= 2) {
                           val = val.substring(0, 2) + '/' + val.substring(2, 4)
                        }
                        setExpiry(val)
                      }}
                    />
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="CVC"
                      className="w-1/2 p-3 bg-transparent text-slate-800 outline-none text-sm font-mono placeholder-slate-400"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-semibold text-center mt-2">{error}</p>}

              <button
                onClick={handleNext}
                disabled={isProcessing}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-4 rounded-lg font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Lock size={16} /> Pay ₹{amount || "0.00"}
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-50 py-3 text-center border-t border-slate-200">
               <p className="text-[10px] text-slate-500 font-medium">Payments are secure and encrypted.</p>
            </div>
          </div>
        </div>

        <div className="lg:hidden"><BottomNav /></div>
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
