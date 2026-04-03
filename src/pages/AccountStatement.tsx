import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar"
import BottomNav from "../components/BottomNav"
import Sidebar from "../components/Sidebar"

const MOCK_STATEMENTS = [
  { id: 1, month: "February 2026", date: "Feb 28, 2026", size: "1.2 MB" },
  { id: 2, month: "January 2026", date: "Jan 31, 2026", size: "1.4 MB" },
  { id: 3, month: "December 2025", date: "Dec 31, 2025", size: "1.8 MB" },
  { id: 4, month: "November 2025", date: "Nov 30, 2025", size: "1.3 MB" },
  { id: 5, month: "October 2025", date: "Oct 31, 2025", size: "1.5 MB" },
]

export default function AccountStatement() {
  const navigate = useNavigate()
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const handleDownload = async (id: number) => {
    setDownloadingId(id)
    // Simulate generation and download network time
    await new Promise(resolve => setTimeout(resolve, 1500))
    setDownloadingId(null)
    // Simulated success could show a toast here in a real app
    alert("Simulated: Statement PDF downloaded securely.")
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex">
      {/* 🖥 Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* 🖥 Desktop Topbar */}
        <Topbar onLogout={() => navigate("/")} />

        {/* 📱 Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-white/10 bg-[#0f172a] sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-lg font-semibold text-cyan-400">Account Statements</h1>
        </div>

        {/* 📊 Main Content */}
        <div className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10 relative z-10 flex flex-col items-center">
          
          <div className="w-full max-w-3xl">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">E-Statements</h2>
                <p className="text-slate-400 text-sm">Download your monthly account summaries safely and securely.</p>
              </div>
              <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h4"/><path d="M14 17h4"/></svg>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10 bg-slate-950/50 flex justify-between items-center">
                 <h3 className="font-semibold text-white">Statement Archives</h3>
                 <span className="text-xs font-mono text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">End-to-End Encrypted</span>
              </div>
              
              <div className="divide-y divide-white/5">
                {MOCK_STATEMENTS.map((statement, idx) => (
                  <div key={statement.id} className="p-6 transition-colors hover:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-lg">{statement.month}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 font-mono">
                          <span>{statement.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span>PDF</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span>{statement.size}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(statement.id)}
                      disabled={downloadingId !== null}
                      className="shrink-0 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 p-3 rounded-xl font-medium transition-all border border-cyan-500/30 flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-50"
                    >
                      {downloadingId === statement.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          <span>Download</span>
                        </>
                      )}
                    </button>
                    
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
               <p className="text-sm text-slate-400 leading-relaxed">
                 Statements are generated on the last day of each month. For security purposes, downloaded statements are password protected. Your password is your registered mobile number.
               </p>
            </div>

          </div>
        </div>

        {/* 📱 Bottom Nav (Mobile Only) */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
