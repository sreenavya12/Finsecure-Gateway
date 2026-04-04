import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  UserCircle, 
  ShieldCheck, 
  CreditCard, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Lock
} from "lucide-react"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Categorized Navigation for better UX
  const mainNav = [
    { label: "Dashboard", path: "/customer-dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Transactions", path: "/transactions", icon: <ArrowLeftRight size={20} /> },
    { label: "My Card", path: "/my-card", icon: <CreditCard size={20} /> },
    { label: "Pay via Card", path: "/pay-card", icon: <CreditCard size={20} className="opacity-50" /> },
  ]

  const securityNav = [
    { label: "Profile", path: "/profile", icon: <UserCircle size={20} /> },
    { label: "Security Vault", path: "/vault", icon: <Lock size={20} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ]

  return (
    <div className={`hidden lg:flex flex-col h-screen transition-all duration-300 bg-[#0f172a] border-r border-white/10 relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-blue-600 rounded-full p-1 border border-[#0f172a] hover:scale-110 transition"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Identity */}
      <div className={`p-6 mb-4 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-white" />
        </div>
        {!isCollapsed && (
          <h2 className="text-xl font-bold tracking-tighter text-white italic">FINSECURE</h2>
        )}
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        
        {/* Main Section */}
        <div>
          {!isCollapsed && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Finance</p>}
          <div className="space-y-1">
            {mainNav.map((item) => (
              <SidebarItem 
                key={item.path}
                item={item} 
                active={location.pathname === item.path} 
                collapsed={isCollapsed}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div>
          {!isCollapsed && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Management</p>}
          <div className="space-y-1">
            {securityNav.map((item) => (
              <SidebarItem 
                key={item.path}
                item={item} 
                active={location.pathname === item.path} 
                collapsed={isCollapsed}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Support & Status Footer */}
      <div className="p-4 border-t border-white/5 space-y-4">
        <button 
          onClick={() => navigate("/support")}
          className={`w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition ${isCollapsed ? 'justify-center' : ''}`}
        >
          <HelpCircle size={20} />
          {!isCollapsed && <span className="text-sm">Help Center</span>}
        </button>

        {!isCollapsed && (
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500">SYSTEM STATUS</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-emerald-500/80 font-mono tracking-tighter">ENCRYPTED // MTLS_ACTIVE</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Sub-component ---------------- */

function SidebarItem({ item, active, collapsed, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
        {item.icon}
      </span>
      
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}

      {/* Tooltip for Collapsed State */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-blue-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
    </button>
  )
}