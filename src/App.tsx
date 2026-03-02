import "./index.css"

type Portal = "master" | "slave"

function getPortal(): Portal {
  const raw = (import.meta.env.VITE_PORTAL || "slave").toString().toLowerCase()
  return raw === "master" ? "master" : "slave"
}

export default function App() {
  const portal = getPortal()

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 720, width: "100%" }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Voodoo Nexus Portal</h1>
        <p style={{ marginTop: 8, opacity: 0.8 }}>Build status: OK</p>

        <div style={{ marginTop: 18, padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Current portal</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            {portal === "master" ? "mast" : "app"}
          </div>
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>
            Env flag: VITE_PORTAL = "{portal}"
          </div>
        </div>
      </div>
    </div>
  )
}