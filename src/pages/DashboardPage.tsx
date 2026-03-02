import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navigate } from "react-router-dom"

export function RequireAuth(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setHasSession(Boolean(data.session))
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setHasSession(Boolean(session))
      setLoading(false)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>
  if (!hasSession) return <Navigate to="/login" replace />
  return <>{props.children}</>
}