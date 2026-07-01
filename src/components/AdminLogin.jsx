import { useState } from "react";

function AdminLogin({ children }) {
  const [authed, setAuthed] = useState(
    sessionStorage.getItem("atlas_admin") === "true"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      if (res.ok) {
        sessionStorage.setItem("atlas_admin", "true");
        setAuthed(true);
      } else {
        setError("Invalid credentials.");
      }
    } catch {
      setError("Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  if (authed) return children;

  return (
    <div style={loginStyles.overlay}>
      <div style={loginStyles.box}>
        <div style={loginStyles.title}>Atlas Manager</div>
        <div style={loginStyles.subtitle}>Restricted access</div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={loginStyles.input}
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={loginStyles.input}
        />
        {error && <div style={loginStyles.error}>{error}</div>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={loginStyles.btn}
        >
          {loading ? "Authenticating..." : "Enter"}
        </button>
      </div>
    </div>
  );
}

const loginStyles = {
  overlay: {
    background: "#13151d",
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "12px",
    padding: "2.5rem",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#c8d0d4",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  subtitle: {
    fontSize: "0.75rem",
    color: "#4b595d",
    marginBottom: "0.5rem",
  },
  input: {
    background: "#13151d",
    border: "1px solid #2a2d3a",
    borderRadius: "6px",
    padding: "10px 12px",
    color: "#c8d0d4",
    fontSize: "0.85rem",
    outline: "none",
  },
  error: {
    fontSize: "0.75rem",
    color: "#f04a4a",
  },
  btn: {
    background: "rgba(122, 157, 82, 0.15)",
    color: "#7a9d52",
    border: "1px solid rgba(122, 157, 82, 0.3)",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    cursor: "pointer",
    marginTop: "0.5rem",
    letterSpacing: "0.05em",
  },
};

export default AdminLogin;
