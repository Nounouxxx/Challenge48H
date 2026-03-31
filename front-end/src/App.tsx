// @ts-ignore
import { useState } from "react";
// @ts-ignore
import Dijkstra from "./djikstra.jsx";
// @ts-ignore
import RavenPuzzle from "./raven-puzzle.jsx";
import ChallengePage from "./pages/ChallengePage";
import type { EnigmePage } from "./pages/ChallengePage";
import Enigme1 from "./pages/Enigme1";
import Enigme2 from "./pages/Enigme2";
import Enigme3 from "./pages/Enigme3";
import Enigme4 from "./pages/Enigme4";

type Scene = "menu" | "dijkstra" | "raven" | "challenge" | EnigmePage;

export default function App() {
  const [scene, setScene] = useState<Scene>("menu");

  if (scene === "dijkstra") return <Dijkstra />;
  if (scene === "raven")    return <RavenPuzzle />;
  if (scene === "challenge") return <ChallengePage onNavigate={(page) => setScene(page)} />;
  if (scene === "enigme1")  return <Enigme1 onBack={() => setScene("challenge")} />;
  if (scene === "enigme2")  return <Enigme2 onBack={() => setScene("challenge")} />;
  if (scene === "enigme3")  return <Enigme3 onBack={() => setScene("challenge")} />;
  if (scene === "enigme4")  return <Enigme4 onBack={() => setScene("challenge")} />;

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 24, fontFamily: "monospace",
    }}>
      <h1 style={{ color: "#00C9A7", margin: 0, fontSize: 26, letterSpacing: 2 }}>CHALLENGE 48H</h1>
      <p style={{ color: "#444", margin: 0, fontSize: 13, letterSpacing: 1 }}>Choisissez une scène</p>
      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setScene("challenge")} style={btnStyle}>
          🔐 Challenge
        </button>
        <button onClick={() => setScene("dijkstra")} style={btnStyle}>
          ⬡ Dijkstra
        </button>
        <button onClick={() => setScene("raven")} style={btnStyle}>
          ◈ Matrices de Raven
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700,
  background: "#10101a", border: "2px solid #00C9A7", color: "#00C9A7",
  cursor: "pointer", fontFamily: "monospace", letterSpacing: 1,
};