import { useState } from "react"
import Layout from "../components/Layout"

interface Transaction {
  id: string;
  company: string;
  amount: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Flagged';
}

export default function Corporate() {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "accounts">("overview")
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  
  // Mock Data for Enterprise Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "TX-9021", company: "Global Tech Inc.", amount: "₹ 1.2 Cr", type: "Payroll Bulk", status: "Pending" },
    { id: "TX-9022", company: "Nexus Logistics", amount: "₹ 45.0 L", type: "Vendor Wire", status: "Pending" },
    { id: "TX-9023", company: "Stellar Energy", amount: "₹ 3.8 Cr", type: "Trade Guarantee", status: "Flagged" },
  ])

  const handleApprove = async (id: string) => {
    setIsAuthorizing(true)
    // Simulate HSM signature generation
    await new Promise(r => setTimeout(r, 2000))
    
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { ...tx, status: "Approved" } : tx
    ))
    setIsAuthorizing(false)
    setSelectedTx(null)
  }

  return (
    <Layout role="corporate">
      <div className="bg-slate-800 p-5 lg:p-8 rounded-2xl border border-slate-700 shadow-xl min-h-[700px] relative overflow-hidden">
        
        {/* Environment Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10 relative z-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30">
                    <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-white">Corporate Sector</h2>
                    <p className="text-slate-400 text-xs lg:text-sm mt-1">Zone B • Liquidity Management</p>
                </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-mono border border-emerald-500/20">
                    HSM Secured Session [Active]
                </div>
                <div className="text-[10px] text-slate-500 font-mono">NODE: ENT_GW_V4</div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 lg:gap-6 mb-8 border-b border-slate-700 pb-px overflow-x-auto no-scrollbar">
            {["overview", "transactions", "accounts"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-xs lg:text-sm font-medium transition-all relative whitespace-nowrap ${
                        activeTab === tab ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                </button>
            ))}
        </div>

        {/* Content Area */}
        {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700/50 p-5 lg:p-6 rounded-2xl">
                    <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2 text-sm lg:text-base">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" /> Total Liquidity Managed
                    </h3>
                    <div className="flex items-end gap-2 mb-8 flex-wrap">
                        <span className="text-2xl lg:text-4xl font-mono text-white">₹ 842.50 Cr</span>
                        <span className="text-emerald-500 text-xs lg:text-sm mb-1 font-bold">▲ 12.4%</span>
                    </div>
                    {/* Mock Graph Bar */}
                    <div className="flex items-end gap-1 lg:gap-2 h-24 lg:h-32 px-1 lg:px-0">
                        {[40, 60, 45, 90, 75, 80, 55, 95, 65, 85].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-600/20 hover:bg-blue-500/40 transition-colors rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl">
                        <h4 className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase mb-4 tracking-wider">Pending Approvals</h4>
                        <div className="text-2xl lg:text-3xl font-mono text-amber-400">08</div>
                        <p className="text-[10px] text-slate-500 mt-2 italic">Totaling ₹ 12.45 Cr awaiting sign-off</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl">
                        <h4 className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase mb-4 tracking-wider">International Wires</h4>
                        <div className="text-2xl lg:text-3xl font-mono text-blue-400">14</div>
                        <p className="text-[10px] text-slate-500 mt-2 italic">Current active SWIFT sessions</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === "transactions" && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="text-slate-500 text-[10px] lg:text-xs uppercase font-bold border-b border-slate-700">
                            <th className="py-4">Entity</th>
                            <th className="py-4">Type</th>
                            <th className="py-4">Amount</th>
                            <th className="py-4">Status</th>
                            <th className="py-4 text-right pr-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs lg:text-sm">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                <td className="py-4 text-white font-medium">{tx.company}</td>
                                <td className="py-4 text-slate-400">{tx.type}</td>
                                <td className="py-4 text-white font-mono">{tx.amount}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                        tx.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                        tx.status === 'Flagged' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                        {tx.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-4 text-right pr-4">
                                    {tx.status === 'Pending' && (
                                        <button 
                                            onClick={() => setSelectedTx(tx)}
                                            className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline decoration-blue-500/30 underline-offset-4"
                                        >
                                            Review
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* Approval Modal */}
        {selectedTx && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 lg:p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded text-blue-400">🔒</div>
                        <h3 className="text-lg lg:text-xl font-bold text-white leading-none">M-Factor Authorization</h3>
                    </div>
                    <p className="text-slate-400 text-xs lg:text-sm mb-6 leading-relaxed">
                        Confirming disbursement of <span className="text-white font-mono">{selectedTx.amount}</span> to <span className="text-white font-medium">{selectedTx.company}</span>.
                        Requires HSM Digital Signature.
                    </p>
                    <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-500 break-all">
                            HASH_VAL: 8823-99X-ALFA-BETA-SEC
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setSelectedTx(null)}
                                className="flex-1 py-3 text-slate-500 hover:text-white transition-colors text-sm font-bold"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleApprove(selectedTx.id)}
                                disabled={isAuthorizing}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 text-sm"
                            >
                                {isAuthorizing ? "Signing..." : "Sign & Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </Layout>
  )
}