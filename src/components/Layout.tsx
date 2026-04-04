import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Menu, X, Shield, Lock, Bell, LogOut, LayoutDashboard, Database } from "lucide-react"

interface Props {
  children: React.ReactNode
  role: string
}

export default function Layout({ children, role }: Props) {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const performLogout = async (isAuto: boolean = false) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        await supabase.from("security_logs").insert([{
          user_id: userData.user.id,
          action: isAuto ? "SESSION_EXPIRED" : "LOGOUT",
          role: role
        }])
      }
    } catch (err) {
      console.error("Failed to log logout action:", err)
    } finally {
      await supabase.auth.signOut()
      navigate("/")
    }
  }

  useEffect(() => {
    let interval: any
    const getSessionExpiry = async () => {
      const { data } = await supabase.auth.getSession()
      const expiresAt = data.session?.expires_at
      if (!expiresAt) return
      const expiryTime = expiresAt * 1000
      const updateTimer = () => {
        const remaining = expiryTime - Date.now()
        setTimeLeft(Math.max(remaining, 0))
        if (remaining <= 0) {
          clearInterval(interval)
          performLogout(true)
        }
      }
      updateTimer()
      interval = setInterval(updateTimer, 1000)
    }
    getSessionExpiry()
    return () => { if (interval) clearInterval(interval) }
  }, [navigate])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const NavItem = ({ label, icon, path }: { label: string, icon: any, path: string }) => {
    const active = window.location.pathname === path
    return (
      <button
        onClick={() => {
          navigate(path)
          setIsMobileMenuOpen(false)
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          active 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      
      {/* 📱 Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-white/5 sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-white uppercase text-sm">FinSecure</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 🖥 Sidebar (Desktop) / Mobile Tray */}
      <div className={`
        fixed inset-0 z-50 lg:relative lg:z-0 lg:flex
        ${isMobileMenuOpen ? "flex" : "hidden lg:flex"}
      `}>
        {/* Backdrop (Mobile) */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div className="relative w-64 bg-slate-900 border-r border-white/5 p-6 flex flex-col justify-between h-full animate-in slide-in-from-left duration-300">
          <div>
            <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white leading-none">FINSECURE</h2>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">Gateway Terminal</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Sector Hub</p>
                <NavItem label="Control Center" icon={<LayoutDashboard size={18} />} path={`/${role}`} />
                <NavItem label="Security Audit" icon={<Database size={18} />} path="/logs" />
                <NavItem label="HSM Vault" icon={<Lock size={18} />} path="/vault" />
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Preferences</p>
                <NavItem label="Settings" icon={<Bell size={18} />} path="/settings" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
             <div className="px-4 py-3 bg-slate-950/50 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Session Status</p>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-mono text-blue-400">{timeLeft !== null ? formatTime(timeLeft) : "--:--"}</span>
                   <div className={`w-2 h-2 rounded-full animate-pulse ${timeLeft !== null && timeLeft < 60000 ? "bg-red-500" : "bg-emerald-500"}`} />
                </div>
             </div>
             <button
                onClick={() => performLogout(false)}
                className="w-full flex items-center justify-center gap-2 p-3 text-red-400 hover:text-white hover:bg-red-600/10 rounded-xl transition-all font-medium text-sm"
              >
                <LogOut size={18} /> Logout
              </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between p-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize text-white">{role} Internal Environment</h1>
            <p className="text-sm text-slate-500 mt-1 uppercase font-bold tracking-tighter">Secure Segment ID: {Math.floor(Math.random() * 9999)}-X</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">mTLS Signal</p>
                <p className="text-xs text-green-400 font-mono">ENCRYPTED // 12ms</p>
             </div>
             <div className="w-px h-8 bg-white/5" />
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/5">
                <div className={`w-2 h-2 rounded-full animate-pulse ${timeLeft !== null && timeLeft < 60000 ? "bg-red-500" : "bg-emerald-500"}`} />
                <span className="text-xs font-mono text-slate-300">
                  {timeLeft !== null && timeLeft < 60000 ? "Expiring Soon" : "Session Active"}
                </span>
             </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-4 lg:p-10 pb-20 lg:pb-10 min-h-full">
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
           </div>
        </div>
      </div>
    </div>
  )
}