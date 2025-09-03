import "./App.css";
import Dashboard from "@pages/Dashboard";
import Admin from "@pages/Admin";
import { useState } from "react";

function App() {
  const [route, setRoute] = useState<"dashboard" | "admin">("dashboard");
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setRoute("dashboard")}
          disabled={route === "dashboard"}
        >
          Dashboard
        </button>
        <button onClick={() => setRoute("admin")} disabled={route === "admin"}>
          Admin
        </button>
      </nav>
      {route === "dashboard" ? <Dashboard /> : <Admin />}
    </>
  );
}

export default App;
