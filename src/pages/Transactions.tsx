import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav"; // 💎 Added Import
import { supabase } from "../lib/supabase";

interface Transaction {
  id: number
  sender_id: string
  receiver_id: string
  amount: number
  payment_type: string
  status: string
  created_at: string
}

export default function Transactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const customerId = localStorage.getItem("customer_id")

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    if (!customerId) return

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .or(`sender_id.eq.${customerId},receiver_id.eq.${customerId}`)
      .order("created_at", { ascending: false })

    if (data) {
      setTransactions(data)
    }

    setLoading(false)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  return (
    // 💎 Changed padding to pb-24
    <div className="relative min-h-screen pb-24 overflow-hidden text-white p-4 md:p-10 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">

      {/* Glow Background */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-400 opacity-20 blur-[120px] rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Transactions
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition"
          >
            Back
          </button>
        </div>

        {/* List */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6">

          {loading && (
            <div className="text-center py-10 text-white/60">
              Loading transactions...
            </div>
          )}

          {!loading && transactions.length === 0 && (
            <div className="text-center py-10 text-white/60">
              No transactions yet.
            </div>
          )}

          <div className="space-y-4">
            {transactions.map((tx) => {
              const isSent = tx.sender_id === customerId

              return (
                <div
                  key={tx.id}
                  className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-medium">
                      {isSent ? "Sent to" : "Received from"}{" "}
                      <span className="text-blue-300">
                        {isSent ? tx.receiver_id : tx.sender_id}
                      </span>
                    </p>

                    <p className="text-xs text-white/60 mt-1">
                      {formatDate(tx.created_at)} • {tx.payment_type}
                    </p>
                  </div>

                  <div
                    className={`text-lg font-semibold ${
                      isSent ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {isSent ? "-" : "+"} ₹ {tx.amount.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 💎 Added BottomNav */}
      <BottomNav />
    </div>
  )
}