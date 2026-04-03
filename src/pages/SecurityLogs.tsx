import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { supabase } from "../lib/supabase"

interface Log {
  id: string
  action: string
  role: string
  created_at: string
}

export default function SecurityLogs({ role }: { role: string }) {
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("security_logs")
        .select("*")
        .order("created_at", { ascending: false })

      if (data) setLogs(data)
    }

    fetchLogs()
  }, [])

  const getColor = (action: string) => {
  if (action.includes("LOGIN")) return "bg-green-600"
  if (action.includes("LOGOUT")) return "bg-red-600"
  if (action.includes("FAILED")) return "bg-yellow-600"
  if (action.includes("ACCESS_") && action.includes("UNAUTHORIZED"))
    return "bg-red-700"
  return "bg-blue-600"
}

  return (
    <Layout role={role}>
      <div className="bg-slate-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6">
          Security Activity Logs
        </h2>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex justify-between items-center bg-slate-700 p-3 rounded-lg"
            >
              <span
                className={`px-3 py-1 rounded-full text-sm ${getColor(
                  log.action
                )}`}
              >
                {log.action}
              </span>

              <span className="text-gray-300 text-sm">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}