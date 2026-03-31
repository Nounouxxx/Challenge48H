import { useState, useEffect, useRef } from "react";
import "../challenge.css";
import { checkFinalAnswer } from "../api";

export type EnigmePage = "enigme1" | "enigme2" | "enigme3" | "enigme4" | "dijkstra";

interface ChallengePageProps {
  onNavigate: (page: EnigmePage) => void;
  completedCount?: number;
}

const TOTAL = 12 * 60;
const STORAGE_KEY = "challenge48h_start";

function getRemainingSeconds(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    return TOTAL;
  }
  const elapsed = Math.floor((Date.now() - parseInt(stored)) / 1000);
  return Math.max(0, TOTAL - elapsed);
}

export default function ChallengePage({ onNavigate, completedCount = 0 }: ChallengePageProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => getRemainingSeconds());
  const [answer, setAnswer] = useState("");
  const [placeholder, setPlaceholder] = useState("_   _   _   _   _   _   _   _");
  const [result, setResult] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLocked, setIsLocked] = useState(() => getRemainingSeconds() <= 0);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(() => localStorage.getItem(STORAGE_KEY) !== null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStart = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setGameStarted(true);
    setSecondsLeft(TOTAL);
    setIsLocked(false);
    setResult("");
  };

  const handleReset = () => {
    if (confirm("Êtes-vous sûr ? Cela réinitialiera tout le progrès.")) {
      localStorage.clear();
      setSecondsLeft(TOTAL);
      setIsLocked(false);
      setGameStarted(false);
      setAnswer("");
      setResult("");
      setPlaceholder("_   _   _   _   _   _   _   _");
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (getRemainingSeconds() <= 0) {
      setIsLocked(true);
      setResult("⏰ Temps écoulé !");
      return;
    }
    intervalRef.current = setInterval(() => {
      const remaining = getRemainingSeconds();
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        setIsLocked(true);
        setResult("⏰ Temps écoulé !");
      }
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const formatTime = (secs: number): string => {
    if (secs <= 0) return "⏰ TERMINÉ";
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCheck = async () => {
    if (isLocked || loading || !answer.trim()) return;
    setLoading(true);
    try {
      const data = await checkFinalAnswer(answer.trim());
      if (data.success) {
        setResult(`✅ ${data.success}`);
        setIsError(false);
        clearInterval(intervalRef.current!);
        setIsLocked(true);
      } else {
        setResult(`❌ ${data.error ?? "Incorrect"}`);
        setIsError(false);
        requestAnimationFrame(() => setIsError(true));
      }
    } catch {
      setResult("❌ Erreur réseau — serveur inaccessible");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="challenge-wrapper">
      {!gameStarted ? (
        <div id="main" style={{
          display: "flex", flexDirection: "column", gap: 20, justifyContent: "center", alignItems: "center",
        }}>
          <h1 style={{ fontSize: "3rem", color: "#00ffcc", textAlign: "center", marginBottom: 40 }}>
            🎮 CHALLENGE 48H
          </h1>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 15, alignItems: "center" }}>
            <button
              onClick={handleStart}
              style={{
                padding: "15px 40px", fontSize: "1.5rem", fontFamily: "monospace",
                background: "linear-gradient(135deg, #00ffcc, #00aa99)", color: "#000",
                border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 0 30px rgba(0, 255, 204, 0.5)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 50px rgba(0, 255, 204, 0.8)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 255, 204, 0.5)";
              }}
            >
              ▶ DÉMARRER
            </button>

            <button
              onClick={handleReset}
              style={{
                padding: "10px 30px", fontSize: "1rem", fontFamily: "monospace",
                background: "transparent", color: "#FF6B9D", border: "1px solid #FF6B9D",
                borderRadius: 6, cursor: "pointer", transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 107, 157, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🔄 Recommencer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div id="corners">
            <button className="card" onClick={() => onNavigate("enigme1")}>1</button>
            <button className="card" onClick={() => onNavigate("enigme2")}>2</button>
            <button className="card" onClick={() => onNavigate("enigme3")}>3</button>
            <button className="card" onClick={() => onNavigate("enigme4")}>4</button>
          </div>

          <div id="main">
            <div id="timer">{formatTime(secondsLeft)}</div>

            <div style={{
              position: "absolute", top: 20, right: 20, fontFamily: "monospace",
              color: "#00ffcc", fontSize: "1.1rem", background: "#0a0a0a",
              border: "1px solid #00ffcc", padding: "8px 16px", borderRadius: 6,
            }}>
              Énigmes: {completedCount}/4
            </div>

            <input
              type="text"
              id="answer"
              placeholder={placeholder}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onFocus={() => setPlaceholder("")}
              onBlur={() => setPlaceholder("_   _   _   _   _   _   _   _")}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              disabled={isLocked}
            />

            <button onClick={handleCheck} disabled={isLocked || loading}>
              {loading ? "..." : "Valider"}
            </button>

            <div id="result" className={isError ? "error" : ""}>
              {result}
            </div>

            <button
              onClick={() => onNavigate("dijkstra")}
              style={{
                position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontFamily: "monospace",
                padding: "10px 20px", background: "transparent", border: "1px solid #00ffcc",
                color: "#00ffcc", fontSize: "1rem", fontWeight: "bold", cursor: "pointer",
                borderRadius: 6,
              }}
            >
              📊 Dijkstra
            </button>

            <button
              onClick={handleReset}
              style={{
                position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", fontFamily: "monospace",
                padding: "8px 16px", background: "transparent", border: "1px solid #FF6B9D",
                color: "#FF6B9D", fontSize: "0.9rem", cursor: "pointer", borderRadius: 4,
              }}
            >
              🔄 Recommencer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
