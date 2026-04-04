import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar"
import BottomNav from "../components/BottomNav"
import Sidebar from "../components/Sidebar"
import { supabase } from "../lib/supabase"
import SecureGateway from "./SecureGateway"

export default function TransferFunds() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [payee, setPayee] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [recipientType, setRecipientType] = useState<"customer_id" | "mobile_number" | "account_number">("customer_id")
  const [receiverName, setReceiverName] = useState("")
  const [resolvedPayeeId, setResolvedPayeeId] = useState("")
  const [showGateway, setShowGateway] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  const senderId = localStorage.getItem("customer_id")

  const handleFetchReceiver = async () => {
    if (!senderId) {
      setError("Session expired")
      return
    }

    setLoading(true)
    setError("")

    if (Number(amount) < 10000) {
      setError("Minimum transfer amount is ₹10,000")
      setLoading(false)
      return
    }

    const { data: receiverData, error: dbError } = await supabase
      .from("customers")
      .select("customer_id, full_name")
      .eq(recipientType, payee)
      .maybeSingle()

    if (dbError || !receiverData) {
       setError("Recipient not found. Check details.")
       setLoading(false)
       return
    }

    setReceiverName(receiverData.full_name || "Unknown")
    setResolvedPayeeId(receiverData.customer_id)
    setLoading(false)
    setStep(2)
  }

  const handleTransfer = async () => {
    if (!senderId) {
      setError("Session expired")
      return
    }

    const data = {
       sender: senderId,
       receiver: resolvedPayeeId,
       amount: Number(amount),
       type: "TRANSFER"
    }

    setPaymentData(data)
    setShowGateway(true)
  }

  const handleGatewaySuccess = () => {
    setShowGateway(false)
    setStep(3)
  }

  const handleGatewayCancel = () => {
    setShowGateway(false)
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <Topbar onLogout={() => navigate("/")} />

        <div className="lg:hidden flex items-center p-4 border-b border-white/10 bg-[#0f172a] sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-lg font-semibold text-cyan-400">Transfer Funds</h1>
        </div>

        <div className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10 flex flex-col items-center justify-center relative z-10 w-full">
          <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Send Money</h2>
                  <p className="text-slate-400 text-sm">Transfer funds securely to any account.</p>
                </div>
                <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 mb-6 w-fit mx-auto shadow-inner">
                  <button onClick={() => setRecipientType("customer_id")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${recipientType === 'customer_id' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Customer ID</button>
                  <button onClick={() => setRecipientType("mobile_number")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${recipientType === 'mobile_number' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Mobile No.</button>
                  <button onClick={() => setRecipientType("account_number")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${recipientType === 'account_number' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>A/C Number</button>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Enter {recipientType === 'mobile_number' ? 'Mobile' : recipientType === 'account_number' ? 'Account Number' : 'Customer ID'}</label>
                  <input
                    type="text"
                    placeholder={`Ex. ${recipientType === 'mobile_number' ? '9876543210' : 'CUST...'}`}
                    className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner text-white"
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-10 p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600 shadow-inner text-2xl font-bold font-mono text-white"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleFetchReceiver}
                  disabled={!payee || !amount || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] mt-8 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : null}
                  Proceed to Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Review Transfer</h2>
                  <p className="text-slate-400 text-sm">Please verify the details before confirming.</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span className="text-slate-400 text-sm">To</span>
                    <div className="text-right">
                       <span className="text-white font-bold block">{receiverName}</span>
                       <span className="text-slate-500 text-[10px] uppercase font-mono">{resolvedPayeeId}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-400 text-sm">Amount</span>
                    <span className="text-blue-400 font-bold text-2xl">₹ {parseFloat(amount || "0").toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="w-1/3 p-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium">Edit</button>
                  <button onClick={handleTransfer} className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex justify-center items-center">Confirm & Send</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-8">
                <div className="w-24 h-24 bg-green-500/10 rounded-full border border-green-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-6 animate-bounce-short">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Transfer Successful!</h2>
                <p className="text-slate-400 text-center text-sm mb-6 max-w-[250px]">₹ {parseFloat(amount).toLocaleString()} has been securely sent.</p>
                <button onClick={() => navigate("/customer-dashboard")} className="w-full bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl font-bold transition-all border border-slate-700">Return to Dashboard</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden"><BottomNav /></div>
      </div>

      {showGateway && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full h-full max-w-4xl max-h-[800px] bg-black border border-blue-900/30 rounded-none lg:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(30,58,138,0.5)] relative">
              <button onClick={handleGatewayCancel} className="absolute top-4 right-4 z-[110] text-slate-500 hover:text-white transition">✕</button>
              <SecureGateway paymentData={paymentData} onSuccess={handleGatewaySuccess} onCancel={handleGatewayCancel} />
           </div>
        </div>
      )}
    </div>
  )
}
