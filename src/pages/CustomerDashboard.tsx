import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import BottomNav from "../components/BottomNav"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap,
  QrCode,
  Smartphone,
  Ticket,
  Train,
  ShieldAlert,
  PiggyBank,
  Briefcase
} from "lucide-react"
import {
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

const spendingData = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 8000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 10000 },
  { month: "May", amount: 17000 },
  { month: "Jun", amount: 9000 },
]

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const customerId = localStorage.getItem("customer_id")

  const fetchDashboardData = async () => {
    if (!customerId) return
    setLoading(true)

    // 1. Fetch Current Balance
    const { data: customer } = await supabase
      .from("customers")
      .select("balance")
      .eq("customer_id", customerId)
      .single()

    // 2. Fetch Recent Transactions
    const { data: txs } = await supabase
      .from("transactions")
      .select("*")
      .or(`sender_id.eq.${customerId},receiver_id.eq.${customerId}`)
      .order("created_at", { ascending: false })
      .limit(4)

    if (customer) setBalance(customer.balance)
    if (txs) setTransactions(txs)
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()

    // 💎 Real-time Balance & Transaction Sync
    const balanceSubscription = supabase
      .channel('any')
      .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'customers', 
          filter: `customer_id=eq.${customerId}` 
      }, payload => {
          setBalance(payload.new.balance)
      })
      .subscribe()

    return () => { supabase.removeChannel(balanceSubscription) }
  }, [])

  const logout = () => {
    localStorage.removeItem("customer_id")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onLogout={logout} />

        {/* 📱 Mobile Header */}
        <div className="lg:hidden flex justify-between items-center p-6 bg-[#0f172a] border-b border-white/5">
          <h1 className="text-xl font-black text-cyan-400 tracking-tighter italic">FINSECURE</h1>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-10 space-y-8 pb-24 lg:pb-10 overflow-y-auto">
          
          {/* Section 1: Hero Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Glass Balance Card */}
            <div className="lg:col-span-2 relative group overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Wallet size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-100/60">Total Liquidity</span>
                    <ShieldCheck size={14} className="text-emerald-300" />
                </div>
                <h2 className="text-5xl font-black tracking-tighter">
                  {balance !== null ? `₹${balance.toLocaleString()}` : "••••••"}
                </h2>
                <div className="mt-10 flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-blue-200/50 uppercase font-bold">Primary Card</span>
                      <span className="text-sm font-mono tracking-widest">**** 9012</span>
                   </div>
                   <div className="h-8 w-px bg-white/10"></div>
                   <button onClick={() => navigate("/my-qr")} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2">
                      <QrCode size={14} /> My QR
                   </button>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between">
              <div className="flex items-center gap-2 text-cyan-400 mb-4">
                <Zap size={18} fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-widest">Smart Forecast</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Based on your <span className="text-white font-bold">Jun</span> spending, you are on track to save <span className="text-emerald-400 font-bold">₹4,200</span> more than last month.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5">
                <button className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 tracking-widest uppercase">
                  View Wealth Plan →
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Analytics & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp size={20} className="text-cyan-400" /> Spending Velocity
                </h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400">Monthly</span>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="amount" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold tracking-tight">Recent Ledger</h3>
                <button onClick={() => navigate("/transactions")} className="text-xs text-cyan-500 font-bold uppercase">All</button>
              </div>
              <div className="space-y-5 flex-1 overflow-y-auto">
                {transactions.map((tx, i) => {
                  const isSent = tx.sender_id === customerId
                  return (
                  <div key={i} className="flex justify-between items-center group cursor-default">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isSent ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {isSent ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                        </div>
                        <div>
                            <p className="text-sm font-bold group-hover:text-cyan-400 transition">{isSent ? tx.receiver_id : tx.sender_id}</p>
                            <p className="text-[10px] text-slate-500 font-mono uppercase">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <span className={`text-sm font-black font-mono ${isSent ? 'text-white' : 'text-emerald-400'}`}>
                        {isSent ? '-' : '+'}₹{tx.amount.toLocaleString()}
                    </span>
                  </div>
                )})}
              </div>
            </div>
          </div>

          {/* PhonePe Style Categorized Services Container */}
          <div className="space-y-6">
            
            {/* 1. Money Transfers */}
            <div className="bg-[#111827] p-6 rounded-[2rem] border border-white/5 shadow-xl">
               <h3 className="text-lg font-bold mb-4 tracking-tight">Money Transfers</h3>
               <div className="grid grid-cols-4 md:grid-cols-4 gap-2 lg:gap-4">
                 <ActionCard title="Wire" icon="💸" onClick={() => navigate("/transfer-funds")} />
                 <ActionCard title="Card Pay" icon="💳" onClick={() => navigate("/pay-card")} />
                 <ActionCard title="Scan QR" icon="📷" onClick={() => navigate("/pay-qr")} />
                 <ActionCard title="My QR" icon="📲" onClick={() => navigate("/my-qr")} />
               </div>
            </div>

            {/* 2. Recharges & Payments */}
            <div className="bg-[#111827] p-6 rounded-[2rem] border border-white/5 shadow-xl">
               <h3 className="text-lg font-bold mb-4 tracking-tight">Recharges & Utilities</h3>
               <div className="grid grid-cols-4 md:grid-cols-4 gap-2 lg:gap-4">
                 <ActionCard title="Mobile" icon={<Smartphone size={24} className="text-cyan-400" />} onClick={() => navigate("/settings")} />
                 <ActionCard title="Ticket" icon={<Ticket size={24} className="text-pink-400" />} onClick={() => navigate("/settings")} />
                 <ActionCard title="Metro" icon={<Train size={24} className="text-indigo-400" />} onClick={() => navigate("/settings")} />
                 <ActionCard title="More" icon="•••" onClick={() => navigate("/settings")} />
               </div>
            </div>

            {/* 3. Financial Services */}
            <div className="bg-[#111827] p-6 rounded-[2rem] border border-white/5 shadow-xl">
               <h3 className="text-lg font-bold mb-4 tracking-tight">Financial Services</h3>
               <div className="grid grid-cols-4 md:grid-cols-4 gap-2 lg:gap-4">
                 <ActionCard title="Insurance" icon={<ShieldAlert size={24} className="text-emerald-400" />} onClick={() => navigate("/settings")} />
                 <ActionCard title="Loans" icon={<PiggyBank size={24} className="text-amber-400" />} onClick={() => navigate("/settings")} />
                 <ActionCard title="Invest" icon={<Briefcase size={24} className="text-blue-400" />} onClick={() => navigate("/settings")} />
                 <ActionCard title="Vault" icon="🛡️" onClick={() => navigate("/profile")} />
               </div>
            </div>

          </div>

        </main>

        <div className="lg:hidden"><BottomNav /></div>
      </div>
    </div>
  )
}

function ActionCard({ title, icon, onClick }: { title: string, icon: React.ReactNode | string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-[#1f2937]/30 hover:bg-[#2d3748] border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center transition duration-300 shadow-lg group h-24">
      <div className="text-2xl mb-2 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 text-slate-300">
         {icon}
      </div>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider md:tracking-widest text-slate-400 group-hover:text-white transition-colors">{title}</span>
    </button>
  )
}