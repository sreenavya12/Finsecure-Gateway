import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function PayPhone() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  const handleNext = async () => {
    setError("")

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter valid 10-digit mobile number")
      return
    }

    // Find receiver by mobile
    const { data } = await supabase
      .from("customers")
      .select("customer_id")
      .eq("mobile_number", phone)
      .single()

    if (!data) {
      setError("User not found")
      return
    }

    // Store payment session
    localStorage.setItem("payment_data", JSON.stringify({
      receiver: data.customer_id,
      type: "PHONE"
    }))

    navigate("/enter-amount")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-2xl w-96 shadow-xl">

        <h2 className="text-xl font-bold mb-6 text-center">
          📱 Pay by Phone Number
        </h2>

        <input
          placeholder="Enter Mobile Number"
          className="w-full p-3 mb-4 rounded bg-slate-800 border border-slate-700"
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleNext}
          className="w-full bg-purple-600 p-3 rounded-xl font-semibold"
        >
          Next
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

      </div>
    </div>
  )
}