import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Public Pages
import Landing from "./pages/Landing"
import AdminLogin from "./pages/AdminLogin"
import EmployeeLogin from "./pages/EmployeeLogin"
import EmployeeRegister from "./pages/EmployeeRegister"
import CustomerLogin from "./pages/CustomerLogin"
import CustomerRegister from "./pages/CustomerRegister"

// Customer Pages
import CustomerDashboard from "./pages/CustomerDashboard"
import PayQR from "./pages/PayQR"
import PayPhone from "./pages/PayPhone"
import PayCard from "./pages/PayCard"
import SecureGateway from "./pages/SecureGateway"
import EnterAmount from "./pages/EnterAmount"
import VerifyPaymentMpin from "./pages/VerifyPaymentMpin"
import Transactions from "./pages/Transactions"
import Profile from "./pages/Profile"
import TransferFunds from "./pages/TransferFunds"
import AccountStatement from "./pages/AccountStatement"
import PlaceholderScreen from "./pages/PlaceholderScreen"
import MyQR from "./pages/MyQR"
import MyCard from "./pages/MyCard"

// UI Global
import ThemeToggle from "./components/ThemeToggle"

// Admin / Employee
import EmployeeDashboard from "./pages/EmployeeDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import SecurityLogs from "./pages/SecurityLogs"

// Employee Isolated Domains
import Retail from "./pages/Retail"
import Corporate from "./pages/Corporate"
import Operations from "./pages/Operations"

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /* ================= TAB LEVEL SECURITY ================= */
  // Global session (all tabs): localStorage
  // Tab-specific verification: sessionStorage
  const [customerSession, setCustomerSession] = useState<string | null>(
    localStorage.getItem("customer_id")
  )
  const [tabVerified, setTabVerified] = useState<boolean>(
    sessionStorage.getItem("tab_verified") === "true"
  )
  useEffect(() => {
    const syncSessions = () => {
      setCustomerSession(localStorage.getItem("customer_id"))
      setTabVerified(sessionStorage.getItem("tab_verified") === "true")
    }

    window.addEventListener("storage", syncSessions)
    // Custom event to force tab-state sync within same window
    window.addEventListener("tabSync", syncSessions)
    
    return () => {
      window.removeEventListener("storage", syncSessions)
      window.removeEventListener("tabSync", syncSessions)
    }
  }, [])

  /* ================= SUPABASE AUTH (Admin/Employee) ================= */
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      
      // If no session, stop loading immediately
      if (!data.session) setLoading(false)
    }

    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (!session) {
          setRole(null)
          setLoading(false)
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  /* ================= FETCH ROLE ================= */
  useEffect(() => {
    const fetchRole = async () => {
      if (!session) return

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle()

      setRole(data?.role ?? null)
      setLoading(false)
    }

    if (session) {
      fetchRole()
    }
  }, [session])

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-white/70">Loading Secure Context...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Landing />} />
        
        {/* Redirect if already logged in (Global + Tab Verified) */}
        <Route 
          path="/admin-login" 
          element={session ? <Navigate to="/admin" replace /> : <AdminLogin />} 
        />
        <Route 
          path="/employee-login" 
          element={session ? <Navigate to="/employee-dashboard" replace /> : <EmployeeLogin />} 
        />
        <Route path="/employee-register" element={<EmployeeRegister />} />
        
        <Route 
          path="/customer-login" 
          element={customerSession && tabVerified ? <Navigate to="/customer-dashboard" replace /> : <CustomerLogin />} 
        />
        <Route 
          path="/customer-register" 
          element={customerSession ? <Navigate to="/customer-dashboard" replace /> : <CustomerRegister />} 
        />

        {/* ================= CUSTOMER PROTECTED ROUTES ================= */}
        {/* 🔐 DOUBLE-LOCK: Requires Global Session + Tab Verification */}
        <Route
          path="/customer-dashboard"
          element={customerSession && tabVerified ? <CustomerDashboard /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/pay-qr"
          element={customerSession && tabVerified ? <PayQR /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/pay-phone"
          element={customerSession && tabVerified ? <PayPhone /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/my-qr"
          element={customerSession && tabVerified ? <MyQR /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/my-card"
          element={customerSession && tabVerified ? <MyCard /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/transfer-funds"
          element={customerSession && tabVerified ? <TransferFunds /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/pay-card"
          element={customerSession && tabVerified ? <PayCard /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/secure-gateway"
          element={<SecureGateway />}
        />
        <Route
          path="/account-statement"
          element={customerSession && tabVerified ? <AccountStatement /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/vault"
          element={customerSession && tabVerified ? <PlaceholderScreen /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/settings"
          element={customerSession && tabVerified ? <PlaceholderScreen /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/support"
          element={customerSession && tabVerified ? <PlaceholderScreen /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/enter-amount"
          element={customerSession && tabVerified ? <EnterAmount /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/verify-payment-mpin"
          element={customerSession && tabVerified ? <VerifyPaymentMpin /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/transactions"
          element={customerSession && tabVerified ? <Transactions /> : <Navigate to="/customer-login" replace />}
        />
        <Route
          path="/profile"
          element={customerSession && tabVerified ? <Profile /> : <Navigate to="/customer-login" replace />}
        />

        {/* ================= ADMIN PROTECTED ROUTES ================= */}
        <Route
          path="/admin"
          element={session && role === "admin" ? <AdminDashboard /> : <Navigate to="/admin-login" replace />}
        />
        <Route
          path="/logs"
          element={session && role === "admin" ? <SecurityLogs role={role!} /> : <Navigate to="/admin-login" replace />}
        />

        {/* ================= EMPLOYEE PROTECTED (GATEWAY) ================= */}
        <Route
          path="/employee-dashboard"
          element={session && role && role !== "admin" ? <EmployeeDashboard /> : <Navigate to="/employee-login" replace />}
        />
        
        {/* ================= EMPLOYEE ISOLATED DOMAINS ================= */}
        <Route
          path="/retail"
          element={session && role === "retail" ? <Retail /> : <Navigate to="/employee-dashboard" replace />}
        />
        <Route
          path="/corporate"
          element={session && role === "corporate" ? <Corporate /> : <Navigate to="/employee-dashboard" replace />}
        />
        <Route
          path="/operations"
          element={session && role === "operations" ? <Operations /> : <Navigate to="/employee-dashboard" replace />}
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}