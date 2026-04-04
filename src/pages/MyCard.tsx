import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import BottomNav from "../components/BottomNav"
import VirtualCard from "../components/VirtualCard"
import { generateVirtualCard } from "../utils/identity"
import { ShieldCheck, Lock, Info, RefreshCw } from "lucide-react"

export default function MyCard() {
  const navigate = useNavigate()
  const [customerData, setCustomerData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const customerId = localStorage.getItem("customer_id")

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!customerId) return
      setLoading(true)

      const { data, error } = await supabase
        .from("customers")
        .select("full_name, card_number, card_expiry, card_cvv")
        .eq("customer_id", customerId)
        .single()

      if (!error && data) {
        if (!data.card_number) {
          const { cardNum, expiry, cvv } = generateVirtualCard()
          await supabase
            .from("customers")
            .update({
              card_number: cardNum,
              card_expiry: expiry,
              card_cvv: cvv
            })
            .eq("customer_id", customerId)
          
          setCustomerData({
            ...data,
            card_number: cardNum,
            card_expiry: expiry,
            card_cvv: cvv
          })
        } else {
          setCustomerData(data)
        }
      }
      setLoading(false)
    }

    fetchCardDetails()
  }, [customerId])

  const logout = () => {
    localStorage.removeItem("customer_id")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar onLogout={logout} />

        <main className="flex-1 p-4 lg:p-10 space-y-6 lg:space-y-8 pb-24 lg:pb-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Virtual Wallet</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your secure digital payment methods.</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Status</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Card View */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 sm:p-8 rounded-[2rem] flex flex-col items-center justify-center min-h-[350px] sm:min-h-[400px] relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                  
                  {loading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Syncing Identity...</p>
                    </div>
                  ) : (
                    <>
                      <VirtualCard 
                        cardHolder={customerData?.full_name || "Valued Customer"}
                        cardNumber={customerData?.card_number || ""}
                        expiry={customerData?.card_expiry || ""}
                        cvv={customerData?.card_cvv || ""}
                      />
                      <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-4">
                        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-2 group">
                          <Lock size={14} className="text-slate-400 group-hover:text-blue-400" />
                          <span>Block Card</span>
                        </button>
                        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-2 group">
                          <RefreshCw size={14} className="text-slate-400 group-hover:text-blue-400" />
                          <span>Rotate CVV</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Stats/Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Transaction Limit</h4>
                    <div className="flex justify-between items-end">
                       <span className="text-2xl font-mono text-white">₹ 1,00,000</span>
                       <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Daily Cap</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Security Tier</h4>
                    <div className="flex justify-between items-end">
                       <span className="text-2xl font-mono text-emerald-400">PLATINUM</span>
                       <ShieldCheck className="text-emerald-500" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Sidebar */}
              <div className="space-y-6">
                <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-[2rem] space-y-4">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} /> Security Notice
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your virtual card is protected by <span className="text-white font-bold">256-bit AES encryption</span>. 
                    Never share your CVV or Card Number with anyone, even bank officials.
                  </p>
                  <ul className="space-y-3 pt-2">
                    {["Enable Contactless", "International Use", "E-Commerce Pay"].map((feat) => (
                      <li key={feat} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] font-bold text-slate-300 uppercase">{feat}</span>
                        <div className="w-8 h-4 bg-blue-600/30 rounded-full flex items-center px-1">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-auto shadow-[0_0_5px_#3b82f6]"></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => navigate("/transactions")}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-white/10 p-4 rounded-2xl flex items-center justify-between group transition-all"
                >
                  <span className="text-sm font-bold text-white uppercase tracking-widest">Card Activity</span>
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </button>
              </div>

            </div>
          </div>
        </main>

        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
