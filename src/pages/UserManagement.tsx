import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")

    if (!error) setUsers(data || [])
    setLoading(false)
  }

  const updateRole = async (id: string, newRole: string) => {
    await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id)

    fetchUsers()
  }

  if (loading) return <div className="text-white p-10">Loading Users...</div>

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-slate-800 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-400">
                Role: {user.role || "Pending"}
              </p>
            </div>

            <select
              value={user.role || ""}
              onChange={(e) => updateRole(user.id, e.target.value)}
              className="bg-slate-700 px-3 py-1 rounded"
            >
              <option value="">Pending</option>
              <option value="retail">Retail</option>
              <option value="corporate">Corporate</option>
              <option value="operations">Operations</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}