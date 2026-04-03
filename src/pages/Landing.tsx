import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, User, Building, ShieldAlert, Key } from "lucide-react"

export default function Landing() {
  const navigate = useNavigate()
  const [showOptions, setShowOptions] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#050b14] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"></div>
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-[2000ms] ${showOptions ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}></div>

      {/* Main Content Area */}
      <div className={`z-10 w-full max-w-4xl px-6 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* Title Section */}
        <div 
          className={`text-center transition-all duration-1000 ${showOptions ? 'transform -translate-y-12 scale-90' : 'cursor-pointer hover:scale-105'}`}
          onClick={() => !showOptions && setShowOptions(true)}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <ShieldCheck size={40} className="text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-slate-400 drop-shadow-lg">
            FinSecure Gateway
          </h1>
          <p className={`text-slate-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto transition-opacity duration-700 ${showOptions ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
            Enterprise-grade encrypted portal for secure banking access.
          </p>
          
          {/* Pulse Click to Enter */}
          {!showOptions && (
            <div className="mt-16 animate-pulse flex flex-col items-center text-blue-400/80">
              <span className="text-sm font-medium tracking-widest uppercase mb-2">Click to Enter</span>
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Portal Options (Fade In) */}
        <div className={`w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${showOptions ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-20 absolute pointer-events-none'}`}>
          
          {/* Customer Portal */}
          <AuthCard 
            title="Customer Portal" 
            description="Access retail banking and personal finance." 
            icon={<User size={32} />} 
            color="blue"
            onClick={() => navigate("/customer-login")} 
            delay="delay-100"
          />

          {/* Employee Portal */}
          <AuthCard 
            title="Employee Portal" 
            description="Secure access for authorized bank personnel." 
            icon={<Building size={32} />} 
            color="green"
            onClick={() => navigate("/employee-login")} 
            delay="delay-200"
          />

          {/* Admin Portal */}
          <AuthCard 
            title="Admin Console" 
            description="System configuration and security management." 
            icon={<ShieldAlert size={32} />} 
            color="red"
            onClick={() => navigate("/admin-login")} 
            delay="delay-300"
          />

        </div>
      </div>

    </div>
  )
}

function AuthCard({ title, description, icon, color, onClick, delay }: any) {
  const colorMap: any = {
    blue: "from-blue-600/20 to-blue-900/10 border-blue-500/30 group-hover:border-blue-400/60 shadow-blue-900/20 text-blue-400",
    green: "from-green-600/20 to-emerald-900/10 border-green-500/30 group-hover:border-green-400/60 shadow-green-900/20 text-green-400",
    red: "from-red-600/20 to-rose-900/10 border-red-500/30 group-hover:border-red-400/60 shadow-red-900/20 text-red-400"
  }

  const bgStyle = colorMap[color]

  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden bg-slate-900/40 backdrop-blur-md border rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${bgStyle} ${delay}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-xl bg-slate-950/50 border border-white/5 backdrop-blur-md`}>
          {icon}
        </div>
        <Key size={20} className="text-slate-600 group-hover:text-white/50 transition-colors" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      
      <div className="mt-8 flex items-center text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
        Secure Login <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  )
}