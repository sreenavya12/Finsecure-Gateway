import { useState, useEffect } from "react"
import Layout from "../components/Layout"

export default function Operations() {
  const [healthScore, setHealthScore] = useState(98)

  // Simulate dynamic health score fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthScore(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        const next = prev + change
        return next > 100 ? 100 : next < 90 ? 90 : next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout role="operations">
      <div className="bg-slate-800 p-5 lg:p-8 rounded-2xl border border-slate-700 shadow-xl min-h-[700px] relative overflow-hidden">
        
        {/* Operations Glow Effect */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 lg:gap-0 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-white">Operations Command</h2>
              <p className="text-slate-400 text-[10px] lg:text-sm mt-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${healthScore > 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                System Integrity: {healthScore}% • Zone C
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-[10px] font-mono border border-purple-500/20 self-start sm:self-auto">
            HSM Session Active
          </div>
        </div>

        {/* --- MAIN DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          
          {/* System Health Card */}
          <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md p-5 lg:p-6 rounded-2xl border border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-200 font-semibold text-sm lg:text-base">Core API Latency</h3>
              <div className="flex gap-2">
                {['1m', '5m', '15m'].map(t => (
                  <button key={t} className="text-[8px] lg:text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 hover:text-white transition-colors">{t}</button>
                ))}
              </div>
            </div>
            {/* Visual Waveform Mockup */}
            <div className="flex items-end gap-1 h-24 lg:h-32 mb-4 px-1 lg:px-2">
              {[60, 40, 55, 70, 65, 30, 45, 80, 50, 60, 40, 55, 70, 90, 65, 40, 50, 35].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all duration-700 ${h > 80 ? 'bg-indigo-400' : 'bg-indigo-600/40'}`} 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 border-t border-slate-800 pt-4 mt-4">
               <div className="text-center border-r border-slate-800">
                  <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-bold">Requests</p>
                  <p className="text-sm lg:text-lg font-mono text-white">12.4k/s</p>
               </div>
               <div className="text-center border-r border-slate-800">
                  <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-bold">Errors</p>
                  <p className="text-sm lg:text-lg font-mono text-emerald-400">0.02%</p>
               </div>
               <div className="text-center">
                  <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-bold">P99 Lat</p>
                  <p className="text-sm lg:text-lg font-mono text-indigo-400">14ms</p>
               </div>
            </div>
          </div>

          {/* Quick Actions / Fraud Alerts */}
          <div className="bg-slate-900/80 p-5 lg:p-6 rounded-2xl border border-slate-700/50 flex flex-col">
            <h3 className="text-slate-200 font-semibold mb-4 text-sm lg:text-base">System Alerts</h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] lg:max-h-none pr-1 custom-scrollbar">
               <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-[10px] lg:text-xs text-red-400 font-bold uppercase tracking-tight">Anomaly Detected</p>
                    <p className="text-[10px] text-slate-400 font-mono">Node_44: CNP</p>
                  </div>
                  <button className="text-[10px] bg-red-500 text-white px-2 py-1 rounded font-bold transition-transform hover:scale-105 active:scale-95">Lock</button>
               </div>
               <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-[10px] lg:text-xs text-amber-400 font-bold uppercase tracking-tight">Manual Review</p>
                    <p className="text-[10px] text-slate-400 font-mono">Wire: ₹ 85.0L</p>
                  </div>
                  <button className="text-[10px] bg-amber-500 text-black px-2 py-1 rounded font-bold transition-transform hover:scale-105 active:scale-95">Verify</button>
               </div>
            </div>
            <button className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs lg:text-sm font-bold transition shadow-lg shadow-indigo-900/20 uppercase tracking-widest">
               Full Console
            </button>
          </div>

        </div>

        {/* --- SYSTEM LOG FEED --- */}
        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-5 lg:p-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest">Global Operations Log</h3>
            <span className="text-[8px] lg:text-[10px] text-indigo-400 font-mono animate-pulse font-bold">● LIVE STREAM</span>
          </div>
          <div className="space-y-2 font-mono text-[9px] lg:text-[11px] max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
             <p className="text-slate-500 leading-relaxed"><span className="text-indigo-500 font-bold">[SYS]</span> Policy enforced for Sector_Retail_01</p>
             <p className="text-slate-500 leading-relaxed"><span className="text-emerald-500 font-bold">[DB]</span> Primary Ledger sync (Hash: 0x882...AF)</p>
             <p className="text-slate-500 leading-relaxed"><span className="text-indigo-500 font-bold">[MTLS]</span> Key Rotation successful for Zone_C</p>
             <p className="text-slate-500 leading-relaxed text-amber-500/80"><span className="text-amber-500 font-bold">[WARN]</span> Latency spike @ Mumbai_Node</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}