import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) navigate("/", { replace: true })
    })

    return () => {
      active = false
    }
  }, [navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        navigate("/", { replace: true })
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      setMessage("Account created. If email confirmations are on, check your inbox. If not, you can log in now.")
      setMode("login")
    } catch (err: any) {
      setMessage(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h1 style={{ margin: 0, fontSize: 30 }}>Voodoo Nexus</h1>
        <p style={{ marginTop: 8, opacity: 0.75 }}>
          {mode === "login" ? "Log in to your portal" : "Create your account"}
        </p>

        <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
          <form onSubmit={onSubmit}>
            <label style={{ display: "block", fontSize: 13, opacity: 0.85 }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "inherit" }}
            />

            <label style={{ display: "block", marginTop: 12, fontSize: 13, opacity: 0.85 }}>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "inherit" }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", marginTop: 14, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "inherit", cursor: "pointer" }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              style={{ border: "none", background: "transparent", color: "inherit", opacity: 0.8, cursor: "pointer", padding: 0 }}
            >
              {mode === "login" ? "Create an account" : "Back to login"}
            </button>

            <button
              type="button"
              onClick={async () => {
                setMessage(null)
                setLoading(true)
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(email)
                  if (error) throw error
                  setMessage("Password reset email sent, if that email exists.")
                } catch (err: any) {
                  setMessage(err?.message || "Something went wrong")
                } finally {
                  setLoading(false)
                }
              }}
              style={{ border: "none", background: "transparent", color: "inherit", opacity: 0.8, cursor: "pointer", padding: 0 }}
            >
              Forgot password
            </button>
          </div>

          {message ? <div style={{ marginTop: 12, fontSize: 13, opacity: 0.85 }}>{message}</div> : null}
        </div>
      </div>
    </div>
  )
}