import { useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar"
import BottomNav from "../components/BottomNav"
import Sidebar from "../components/Sidebar"

export default function PlaceholderScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Topbar onLogout={() => navigate("/")} />
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-4">Under Construction</h1>
            <p className="text-slate-400">This module is part of the future FinSecure roadmap. Stay tuned!</p>
            <button onClick={() => navigate(-1)} className="mt-8 px-6 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Go Back</button>
        </div>
        <div className="lg:hidden"><BottomNav /></div>
      </div>
    </div>
  )
}
