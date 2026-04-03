import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function InitiatePayment() {
  const navigate = useNavigate()

  const senderId = localStorage.getItem("customer_id")

  const [receiver, setReceiver] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentType, setPaymentType] = useState("MOBILE")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handlePayment = async () => {
    if (!senderId) {
      setMessage("Session expired. Please login again.")
      return
    }

    if (!receiver || !amount) {
      setMessage("Fill all fields")
      return
    }

    setLoading(true)
    setMessage("")

    const { data, error } = await supabase.rpc("transfer_funds", {
      sender: senderId,
      receiver: receiver,
      amount: Number(amount),
      payment_method: paymentType
    })

    setLoading(false)

    if (error) {
      setMessage("Payment failed. Try again.")
      return
    }

    if (data === "SUCCESS") {
      setMessage("✅ Payment Successful!")
      setTimeout(() => navigate("/customer-dashboard"), 2000)
    } else if (data === "INSUFFICIENT_FUNDS") {
      setMessage("❌ Insufficient Balance")
    } else if (data === "RECEIVER_NOT_FOUND") {
      setMessage("❌ Receiver not found")
    } else if (data === "SENDER_NOT_FOUND") {
      setMessage("❌ Sender error")
    } else {
      setMessage("❌ Unknown error")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="bg-slate-900 p-8 rounded-2xl w-96 border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Send Money
        </h2>

        <div className="space-y-4">

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Receiver Customer ID
            </label>
            <input
              placeholder="Enter Receiver ID"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              onChange={(e) => setReceiver(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter Amount"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Payment Type
            </label>
            <select
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="MOBILE">Mobile</option>
              <option value="UPI">UPI</option>
              <option value="QR">QR Scan</option>
              <option value="CARD">Card</option>
            </select>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full p-3 rounded-xl font-bold transition ${
              loading
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          {message && (
            <div className="p-3 bg-slate-800 rounded-lg text-center">
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}