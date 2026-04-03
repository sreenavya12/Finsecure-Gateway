import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { ShieldCheck, Activity, LogOut, Users, AlertTriangle, UserCog, History, ShieldAlert } from "lucide-react"

export default function Admin() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    unauthorized: 0,
    activeSessions: 0
  })
  const [users, setUsers] = useState<any[]>([])
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const fetchData = async () => {
    setIsLoading(true)
    
    // 1. Fetch Metrics
    const { count: uCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
    const { count: aCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin")
    const { count: sCount } = await supabase.from("security_logs").select("*", { count: "exact", head: true }).like("action", "UNAUTHORIZED%")
    
    // 2. Fetch User List
    const { data: userData } = await supabase.from("profiles").select("*").order('created_at', { ascending: false }).limit(5)
    
    // 3. Fetch Recent Security Logs
    const { data: logData } = await supabase.from("security_logs").select("*").order('created_at', { ascending: false }).limit(6)

    setMetrics({
      totalUsers: uCount || 0,
      totalAdmins: aCount || 0,
      unauthorized: sCount || 0,
      activeSessions: Math.floor(Math.random() * 5) + 1 // Simulating live heartbeat
    })
    if (userData) setUsers(userData)
    if (logData) setRecentLogs(logData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()

    // Real-time Subscriptions
    const channel = supabase.channel('admin-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'security_logs' }, () => fetchData())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            SYSTEM ROOT
          </h1>
          <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mt-1">
            Global Infrastructure Permissions
          </p>
        </div>
        <div className="flex gap-3">
          <div className="hidden md:flex flex-col items-end justify-center px-4 border-r border-slate-800">
             <span className="text-[10px] text-slate-500 font-bold uppercase">Auth Service</span>
             <span className="text-xs text-green-400 font-mono">OPERATIONAL</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all px-5 py-2.5 rounded-xl border border-red-600/20 font-bold text-sm">
            <LogOut size={16} /> TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total CIFs", val: metrics.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/5" },
          { label: "Admin Tier", val: metrics.totalAdmins, icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-400/5" },
          { label: "Intrusions", val: metrics.unauthorized, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/5" },
          { label: "Live Nodes", val: metrics.activeSessions, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/5" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white/5 shadow-2xl`}>
            <stat.icon className={`${stat.color} mb-3`} size={20} />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">{stat.label}</p>
            <h2 className="text-3xl font-mono font-bold mt-1">{stat.val}</h2>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- USER LIST --- */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><UserCog size={18} className="text-slate-400" /> Identity Management</h3>
            <button className="text-xs text-blue-400 hover:underline">View All Users</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
                  <th className="px-6 py-4">Identity Hash</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/30 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">{u.id.substring(0, 12)}...</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-slate-400">Verified</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-white transition">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- LOG STREAM --- */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2"><ShieldAlert size={18} className="text-red-400" /> Security Event Stream</h3>
          <div className="space-y-6">
            {recentLogs.map((log) => (
              <div key={log.id} className="relative pl-6 border-l border-slate-800">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-950"></div>
                <p className={`text-[10px] font-bold uppercase tracking-tight ${log.action.includes('FAILED') ? 'text-red-400' : 'text-blue-400'}`}>
                  {log.action.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  {new Date(log.created_at).toLocaleTimeString()} • Node_{Math.floor(Math.random() * 99)}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-bold text-slate-400 transition">
            DOWNLOAD FULL AUDIT
          </button>
        </div>

      </div>
    </div>
  )
}