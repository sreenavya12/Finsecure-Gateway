import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { QRCodeCanvas } from "qrcode.react"
import BottomNav from "../components/BottomNav"
import { checkHardwareSupport, registerBiometrics } from "../utils/biometric"
import { Fingerprint, CheckCircle2, ShieldCheck } from "lucide-react"

export default function Profile() {
  const [customer, setCustomer] = useState<any>(null)
  const [editingUpi, setEditingUpi] = useState(false)
  const [newUpi, setNewUpi] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [hasBiometrics, setHasBiometrics] = useState(false)
  const [linking, setLinking] = useState(false)

  const customerId = localStorage.getItem("customer_id")

  useEffect(() => {
    fetchCustomer()
    checkSupport()
  }, [])

  const checkSupport = async () => {
    const support = await checkHardwareSupport()
    setIsMobile(support.isMobile)
    setHasBiometrics(support.hasBiometrics)
  }

  const fetchCustomer = async () => {
    if (!customerId) return

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("customer_id", customerId)
      .single()

    if (data) {
      setCustomer(data)
      setNewUpi(data.upi_id || "")
    }
  }

  const updateUpi = async () => {
    if (!newUpi.includes("@")) return alert("Invalid UPI ID")

    await supabase
      .from("customers")
      .update({ upi_id: newUpi })
      .eq("customer_id", customerId)

    setEditingUpi(false)
    fetchCustomer()
  }

  const copyUpi = () => {
    navigator.clipboard.writeText(customer.upi_id)
    alert("UPI ID Copied!")
  }

  const handleLinkBiometric = async () => {
    try {
      setLinking(true)
      const { credentialId, publicKey } = await registerBiometrics(customer.customer_id, customer.full_name)
      
      const { error } = await supabase
        .from("customers")
        .update({
          biometric_credential_id: credentialId,
          biometric_public_key: publicKey,
          face_registered: true // Compatibility flag
        })
        .eq("customer_id", customerId)

      if (error) throw error

      alert("Fingerprint successfully linked! You can now login using biometrics.")
      fetchCustomer()
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Failed to link biometrics")
    } finally {
      setLinking(false)
    }
  }

  if (!customer) return null

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white p-4 md:p-10 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">

      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-400 opacity-20 blur-[120px] rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto">

        <h1 className="text-2xl md:text-3xl font-semibold mb-8">
          Profile
        </h1>

        {/* Profile Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl mb-8">
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
             <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center text-2xl font-bold">
                {customer.full_name ? customer.full_name[0] : "C"}
             </div>
             <div>
                <p className="text-2xl font-bold">{customer.full_name || "Customer Account"}</p>
                <p className="text-sm text-cyan-400 font-mono">{customer.customer_id}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Bank Name</p>
              <p className="text-md font-medium">{customer.bank_name || "FinSecure Bank"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Account Number</p>
              <p className="text-md font-mono">{customer.account_number || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">IFSC Code</p>
              <p className="text-md font-mono">{customer.ifsc_code || "FSEC0001234"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Mobile Number</p>
              <p className="text-md font-mono">{customer.mobile_number}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-2">UPI ID</p>

          {editingUpi ? (
            <div className="flex gap-3 mt-2">
              <input
                value={newUpi}
                onChange={(e) => setNewUpi(e.target.value)}
                className="flex-1 p-2 rounded bg-white/10 border border-white/20"
              />
              <button
                onClick={updateUpi}
                className="bg-blue-600 px-4 rounded-lg"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2">
              <p className="text-lg font-semibold">
                {customer.upi_id || "Not Set"}
              </p>
              <button
                onClick={() => setEditingUpi(true)}
                className="text-blue-300 text-sm"
              >
                Edit
              </button>
            </div>
          )}

          </div>

        </div>

        {/* 📱 Mobile Biometric Section */}
        {isMobile && hasBiometrics && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl mb-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                 <ShieldCheck size={28} />
              </div>
              <div>
                 <h3 className="text-xl font-bold">Biometric Security</h3>
                 <p className="text-xs text-slate-400 tracking-wide uppercase font-semibold">Native Hardware Authentication</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect your device's fingerprint or FaceID sensor to log in instantly without passwords.
              </p>

              {customer.biometric_credential_id ? (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-bold">Biometrics Linked & Active</span>
                </div>
              ) : (
                <button
                  onClick={handleLinkBiometric}
                  disabled={linking}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition shadow-lg shadow-blue-900/20"
                >
                  {linking ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Fingerprint size={20} />
                      Link Fingerprint
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* QR Section */}
        {customer.upi_id && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl text-center">

            <h3 className="text-lg font-semibold mb-4">
              Your Payment QR
            </h3>

            <div className="flex justify-center mb-6">
              <QRCodeCanvas
                value={`upi://pay?pa=${customer.upi_id}&pn=${customer.customer_id}`}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <button
              onClick={copyUpi}
              className="bg-blue-600 px-6 py-2 rounded-xl"
            >
              Copy UPI ID
            </button>

          </div>
        )}
        {/* Logout Section */}
        <div className="mt-12 space-y-4">
          <button
            onClick={() => {
              localStorage.removeItem("customer_id")
              sessionStorage.clear()
              window.location.href = "/"
            }}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-4 rounded-2xl font-bold transition flex items-center justify-center gap-3"
          >
            <Fingerprint size={20} className="opacity-50" />
            Secure Logout & Terminate Session
          </button>
          <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-medium">
             Security: Your identity will be locked to this browser until next login.
          </p>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}