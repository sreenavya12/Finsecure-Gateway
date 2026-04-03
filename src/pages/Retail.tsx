import { useState, useEffect } from "react"
import Layout from "../components/Layout"

export default function Retail() {
  const [view, setView] = useState<"dashboard" | "search">("dashboard")
  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: "OK", msg: "Gateway handshake successful - Node_882", time: "10:12:01" },
    { id: 2, type: "INFO", msg: "New session initiated - Employee_7712", time: "10:12:05" },
  ])

  // Simulate live background logs
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["OK", "INFO", "WARN", "CRIT"]
      const msgs = ["mTLS Re-handshake", "Encrypted Tunnel Refresh", "DB Query Latency +12ms", "Audit Log Synced"]
      const newAlert = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        msg: msgs[Math.floor(Math.random() * msgs.length)],
        time: new Date().toLocaleTimeString()
      }
      setSystemAlerts(prev => [newAlert, ...prev.slice(0, 5)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout role="retail">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl overflow-hidden relative min-h-[700px]">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6 relative z-10">
          <div className="flex gap-4">
            <button 
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${view === 'dashboard' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-slate-400 hover:bg-slate-700'}`}
            >
              📊 System Overview
            </button>
            <button 
              onClick={() => setView("search")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${view === 'search' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-slate-400 hover:bg-slate-700'}`}
            >
              🔍 Customer Terminal
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold">HSM Signal</p>
              <p className="text-xs text-green-400 font-mono">STABLE // 12ms</p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            </div>
          </div>
        </div>

        {view === "dashboard" ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Zone Liquidity", val: "₹ 4.28 Cr", color: "text-white" },
                { label: "Active Risks", val: "07", color: "text-red-400" },
                { label: "Uptime", val: "99.98%", color: "text-blue-400" },
                { label: "Pending Loans", val: "12", color: "text-amber-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter mb-1 font-bold">{stat.label}</p>
                  <p className={`text-2xl font-mono ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Middle Section: Live Monitoring & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sector Health Graph (Mockup) */}
              <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-medium">Sector Transaction Volume</h3>
                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase">Real-time</span>
                </div>
                <div className="h-48 flex items-end gap-1 px-2">
                  {[40, 70, 45, 90, 65, 80, 30, 95, 50, 75, 60, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-red-600/20 to-red-500/60 rounded-t-sm transition-all duration-500 hover:to-red-400" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>

              {/* Live Security Feed */}
              <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
                <h3 className="text-slate-200 text-sm font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Live Security Logs
                </h3>
                <div className="space-y-4">
                  {systemAlerts.map(alert => (
                    <div key={alert.id} className="text-[10px] font-mono border-l-2 border-slate-800 pl-3 py-1">
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span className={alert.type === 'WARN' ? 'text-amber-500' : alert.type === 'CRIT' ? 'text-red-500' : 'text-green-500'}>
                          [{alert.type}]
                        </span>
                        <span>{alert.time}</span>
                      </div>
                      <p className="text-slate-300 truncate">{alert.msg}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] rounded uppercase tracking-widest transition-colors">
                  Open Audit Terminal
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300">
             {/* Include your existing Customer Search / Card Services logic here */}
             <div className="bg-slate-900/50 p-12 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                <p>Customer Terminal Active. Ready for Secure Query.</p>
                <button onClick={() => setView("dashboard")} className="mt-4 text-red-400 text-sm hover:underline">Return to System Overview</button>
             </div>
          </div>
        )}
      </div>
    </Layout>
  )
}