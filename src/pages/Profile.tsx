import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { QRCodeCanvas } from "qrcode.react"
import BottomNav from "../components/BottomNav"

export default function Profile() {
  const [customer, setCustomer] = useState<any>(null)
  const [editingUpi, setEditingUpi] = useState(false)
  const [newUpi, setNewUpi] = useState("")

  const customerId = localStorage.getItem("customer_id")

  useEffect(() => {
    fetchCustomer()
  }, [])

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

      </div>

      <BottomNav />
    </div>
  )
}