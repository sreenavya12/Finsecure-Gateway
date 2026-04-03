type Props = {
  onLogout: () => void
}

export default function Topbar({ onLogout }: Props) {
  return (
    <div className="hidden lg:flex justify-between items-center bg-[#0f172a] border-b border-white/10 px-10 py-4">
      <h1 className="text-white text-lg font-semibold">
        Customer Dashboard
      </h1>

      <button
        onClick={onLogout}
        className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}