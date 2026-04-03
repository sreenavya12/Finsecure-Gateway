import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { ShieldAlert, UserCheck, UserX, Search, RotateCcw } from "lucide-react"

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: emp } = await supabase.from("profiles").select("*")
    const { data: cust } = await supabase.from("customers").select("*")
    const { data: security } = await supabase
      .from("customer_security_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8)

    setEmployees(emp || [])
    setCustomers(cust || [])
    setLogs(security || [])
  }

  // --- NEW FUNCTIONALITY: Toggle Customer Lock ---
  const toggleCustomerLock = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id)
    const { error } = await supabase
      .from("customers")
      .update({ account_locked: !currentStatus })
      .eq("customer_id", id)

    if (!error) {
      setCustomers(prev => prev.map(c => 
        c.customer_id === id ? { ...c, account_locked: !currentStatus } : c
      ))
      // Log the admin action
      await supabase.from("security_logs").insert({
        action: currentStatus ? "ADMIN_UNLOCK_USER" : "ADMIN_LOCK_USER",
        details: `Target: ${id}`
      })
    }
    setIsUpdating(null)
  }

  // --- NEW FUNCTIONALITY: Delete/Revoke Employee ---
  const revokeEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to revoke access for this employee?")) return
    const { error } = await supabase.from("profiles").delete().eq("id", id)
    if (!error) setEmployees(prev => prev.filter(e => e.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const filteredCustomers = customers.filter(c => 
    c.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-red-600 tracking-tighter">
            ROOT_ADMIN CONSOLE
          </h1>
          <p className="text-slate-500 text-xs font-mono">System Integrity Level: ALPHA</p>
        </div>
        <div className="flex gap-4">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-white transition">
                <RotateCcw size={20} />
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-red-900/20">
              LOGOUT
            </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
            { label: "Internal Staff", val: employees.length, color: "text-blue-400" },
            { label: "Active CIFs", val: customers.length, color: "text-emerald-400" },
            { label: "Locked Accounts", val: customers.filter(c => c.account_locked).length, color: "text-red-500" },
            { label: "Security Events", val: logs.length, color: "text-purple-400" }
        ].map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h2 className={`text-3xl font-mono font-bold ${stat.color}`}>{stat.val}</h2>
            </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* CUSTOMER MANAGEMENT WITH SEARCH */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><UserCheck size={20} /> Customer Directory</h3>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input 
                    type="text" 
                    placeholder="Search CIF..." 
                    className="bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-lg text-xs focus:border-red-600 outline-none w-48"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <div className="space-y-2">
            {filteredCustomers.map((cust) => (
              <div key={cust.customer_id} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <div>
                    <span className="font-mono text-sm">{cust.customer_id}</span>
                    <p className={`text-[10px] font-bold uppercase ${cust.account_locked ? "text-red-500" : "text-emerald-500"}`}>
                        {cust.account_locked ? "Locked" : "Active"}
                    </p>
                </div>
                <button 
                    disabled={isUpdating === cust.customer_id}
                    onClick={() => toggleCustomerLock(cust.customer_id, cust.account_locked)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        cust.account_locked ? "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white" : "bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white"
                    }`}
                >
                  {isUpdating === cust.customer_id ? "..." : (cust.account_locked ? "UNLOCK" : "LOCK")}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* EMPLOYEE & LOGS COMBINED */}
        <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ShieldAlert size={20} className="text-red-500" /> Recent Security Logs</h3>
                <div className="space-y-3">
                {logs.map((log, index) => (
                    <div key={index} className="text-[11px] font-mono flex justify-between border-b border-slate-800 pb-2">
                    <span className={log.action.includes('FAILED') ? 'text-red-400' : 'text-slate-300'}>{log.action}</span>
                    <span className="text-slate-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                ))}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Internal Staff</h3>
                <div className="space-y-2">
                {employees.map((emp) => (
                    <div key={emp.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg text-xs">
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded font-bold uppercase tracking-tighter">{emp.role}</span>
                        <span className="text-slate-500 font-mono">{emp.id.substring(0, 8)}...</span>
                        <button onClick={() => revokeEmployee(emp.id)} className="text-red-500 hover:text-red-400">
                            <UserX size={16} />
                        </button>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}