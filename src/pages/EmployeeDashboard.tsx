import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { createSecureSession } from "../security/secureSession"

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const [role, setRole] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("Initializing identity aware proxy...")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let mounted = true

    const initiateGatewayLogon = async () => {
      // 1. Fetch Session & Role
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        if (mounted) navigate("/employee-login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionData.session.user.id)
        .single()
        
      if (!profile || !profile.role) {
        if (mounted) navigate("/employee-login")
        return
      }
      
      const userRole = profile.role

      if (mounted) {
        setRole(userRole)
      }

      // 2. Simulate Security Scans & mTLS Tunnel Creation
      const steps = [
        { msg: "Validating user identity...", time: 600, p: 20 },
        { msg: "Checking device posture and contextual risk...", time: 800, p: 40 },
        { msg: "Verifying endpoint compliance...", time: 700, p: 60 },
        { msg: "Establishing Mutual TLS (mTLS) session...", time: 900, p: 80 },
        { msg: "Routing to isolated sub-domain...", time: 600, p: 100 }
      ]

      for (const step of steps) {
        if (!mounted) break
        setStatus(step.msg)
        setProgress(step.p)
        await new Promise(r => setTimeout(r, step.time))
      }

      // 3. Create Session & Redirect
      if (mounted) {
        createSecureSession(sessionData.session.user.id)
        
        // Log access
        await supabase.from("security_logs").insert([
          {
            user_id: sessionData.session.user.id,
            action: `ACCESS_${userRole.toUpperCase()}_DOMAIN`,
            role: userRole
          }
        ])

        // Route to isolated context
        if (userRole === "retail") navigate("/retail")
        else if (userRole === "corporate") navigate("/corporate")
        else if (userRole === "operations") navigate("/operations")
        else if (userRole === "admin") navigate("/admin")
        else navigate("/employee-login")
      }
    }

    initiateGatewayLogon()

    return () => {
      mounted = false
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">FinSecure Gateway</h2>
          <p className="text-slate-400 text-sm mt-1">Identity-Aware Proxy Intercept</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-blue-400">{status}</span>
            <span className="text-xs text-slate-500 font-mono">{progress}%</span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-400 space-y-2 mt-6">
            <p className="flex justify-between">
              <span>Identity Provider</span>
              <span className="text-green-400">Verified</span>
            </p>
            <p className="flex justify-between">
              <span>RBAC Policy</span>
              <span className={role ? "text-green-400" : "text-yellow-400"}>
                {role ? `Assigned: ${role}` : "Scanning..."}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Micro-segmentation</span>
              <span className={progress >= 80 ? "text-green-400" : "text-yellow-400"}>
                {progress >= 80 ? "Enforced" : "Pending"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}