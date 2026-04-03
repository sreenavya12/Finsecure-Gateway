import { useNavigate, useLocation } from "react-router-dom"

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: "Home", icon: "🏠", path: "/customer-dashboard" },
    { label: "Pay", icon: "💸", path: "/pay-phone" },
    { label: "History", icon: "📊", path: "/transactions" },
    { label: "Profile", icon: "👤", path: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden backdrop-blur-xl bg-white/10 border-t border-white/20 shadow-2xl z-50">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const active = location.pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center text-xs transition ${
                active ? "text-blue-300" : "text-white/70"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}