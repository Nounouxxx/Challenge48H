import { useState, useEffect, useRef } from "react";
import "../challenge.css";
import { checkFinalAnswer } from "../api";

export type EnigmePage = "enigme1" | "enigme2" | "enigme3" | "enigme4";

interface ChallengePageProps {
  onNavigate: (page: EnigmePage) => void;
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

export default function ChallengePage({ onNavigate }: ChallengePageProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => getRemainingSeconds());
  const [answer, setAnswer] = useState("");
  const [placeholder, setPlaceholder] = useState("_   _   _   _   _   _   _   _");
  const [result, setResult] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLocked, setIsLocked] = useState(() => getRemainingSeconds() <= 0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      <div id="corners">
        <a className="card" onClick={() => onNavigate("enigme1")}>1</a>
        <a className="card" onClick={() => onNavigate("enigme2")}>2</a>
        <a className="card" onClick={() => onNavigate("enigme3")}>3</a>
        <a className="card" onClick={() => onNavigate("enigme4")}>4</a>
      </div>

      <div id="main">
        <div id="timer">{formatTime(secondsLeft)}</div>

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
      </div>
    </div>
  );
}
