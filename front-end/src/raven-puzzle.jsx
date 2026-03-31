import { useState } from "react";

// â”€â”€â”€ Shape SVG renderer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Shape({ shape, cx, cy, r, fill = "full", color = "#00C9A7" }) {
  const filled = fill === "full" ? color : "none";
  const sw = 2;

  if (shape === "circle") {
    if (fill === "half") return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} />
        <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`} fill={color} />
      </g>
    );
    return <circle cx={cx} cy={cy} r={r} fill={filled} stroke={color} strokeWidth={sw} />;
  }

  if (shape === "square") {
    const p = r * 0.88;
    if (fill === "half") return (
      <g>
        <rect x={cx - p} y={cy - p} width={p * 2} height={p * 2} fill="none" stroke={color} strokeWidth={sw} />
        <rect x={cx - p} y={cy - p} width={p} height={p * 2} fill={color} />
      </g>
    );
    return <rect x={cx - p} y={cy - p} width={p * 2} height={p * 2} fill={filled} stroke={color} strokeWidth={sw} />;
  }

  if (shape === "triangle") {
    const h = r * 1.6;
    const pts = `${cx},${cy - h * 0.65} ${cx - r},${cy + h * 0.35} ${cx + r},${cy + h * 0.35}`;
    if (fill === "half") {
      const clipId = `tc-${cx}-${cy}`;
      return (
        <g>
          <defs>
            <clipPath id={clipId}><polygon points={pts} /></clipPath>
          </defs>
          <polygon points={pts} fill="none" stroke={color} strokeWidth={sw} />
          <rect x={cx - r} y={cy - h} width={r} height={h * 2} clipPath={`url(#${clipId})`} fill={color} />
        </g>
      );
    }
    return <polygon points={pts} fill={filled} stroke={color} strokeWidth={sw} />;
  }

  if (shape === "star") {
    const inner = r * 0.42;
    let pts = "";
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rad = i % 2 === 0 ? r : inner;
      pts += `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)} `;
    }
    return <polygon points={pts.trim()} fill={filled} stroke={color} strokeWidth={1.5} />;
  }

  if (shape === "diamond") {
    const pts = `${cx},${cy - r} ${cx + r * 0.7},${cy} ${cx},${cy + r} ${cx - r * 0.7},${cy}`;
    return <polygon points={pts} fill={filled} stroke={color} strokeWidth={sw} />;
  }

  return null;
}

function Arrow({ direction, color = "#00C9A7" }) {
  const cx = 42, cy = 42, r = 18;
  const angles = { up: -90, right: 0, down: 90, left: 180 };
  const rad = ((angles[direction] || 0) * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const x1 = cx - cos * r, y1 = cy - sin * r;
  const x2 = cx + cos * r, y2 = cy + sin * r;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hs = 10;
  const p1x = x2 - hs * Math.cos(a - 0.45), p1y = y2 - hs * Math.sin(a - 0.45);
  const p2x = x2 - hs * Math.cos(a + 0.45), p2y = y2 - hs * Math.sin(a + 0.45);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`} fill={color} />
    </g>
  );
}

// Positions for N shapes inside an 84x84 cell
const POS = {
  1: [[42, 42]],
  2: [[27, 42], [57, 42]],
  3: [[20, 42], [42, 42], [64, 42]],
  4: [[26, 26], [58, 26], [26, 58], [58, 58]],
  5: [[20, 22], [58, 22], [39, 42], [20, 62], [58, 62]],
  6: [[18, 22], [42, 22], [66, 22], [18, 62], [42, 62], [66, 62]],
};

function CellContent({ cell, highlight = false }) {
  if (!cell) return (
    <text x={42} y={50} textAnchor="middle" fontSize={36} fontWeight={800}
      fill="#555" fontFamily="monospace">?</text>
  );
  const color = highlight ? "#FFD700" : "#00C9A7";
  if (cell.isArrow) return <Arrow direction={cell.direction} color={color} />;
  const positions = POS[cell.count] || [[42, 42]];
  const r = cell.size === "s" ? 8 : cell.size === "l" ? 20 : 13;
  return positions.map((pos, i) => (
    <Shape key={i} shape={cell.shape} cx={pos[0]} cy={pos[1]} r={r} fill={cell.fill} color={color} />
  ));
}

function Cell({ cell, onClick, selected, isAnswer, showAnswer, small = false }) {
  const sz = small ? 72 : 84;
  const border = selected ? "#FFD700" : isAnswer && showAnswer ? "#00C9A7" : "#1e1e2a";
  const bg = selected ? "#2a2600" : "#10101a";
  return (
    <div onClick={onClick} style={{
      width: sz, height: sz, border: `2px solid ${border}`,
      borderRadius: 8, background: bg, cursor: onClick ? "pointer" : "default",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "border-color 0.15s, background 0.15s",
      flexShrink: 0,
    }}>
      <svg width={sz - 4} height={sz - 4} viewBox="0 0 84 84">
        <CellContent cell={cell} highlight={selected} />
      </svg>
    </div>
  );
}

// â”€â”€â”€ Puzzle data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


// ─── Puzzle data (free-text input, no multiple choice) ────────────────────────
// Each puzzle: observe the 3×3 grid pattern, deduce the missing value, type it.
// answer = exact string to match (case-insensitive). digit = code digit (same here).

const PUZZLES = [
  {
    title: "Puzzle 1 / 4",
    question: "Combien de symboles dans la case manquante ?",
    hint: "Le nombre de symboles = numéro de ligne + numéro de colonne, en comptant à partir de 1.",
    // count = row + col : 2,3,4 / 3,4,5 / 4,5,?=6
    grid: [
      { shape:"circle", count:2, size:"s", fill:"full" },
      { shape:"circle", count:3, size:"s", fill:"full" },
      { shape:"circle", count:4, size:"s", fill:"full" },
      { shape:"circle", count:3, size:"s", fill:"full" },
      { shape:"circle", count:4, size:"s", fill:"full" },
      { shape:"circle", count:5, size:"s", fill:"full" },
      { shape:"circle", count:4, size:"s", fill:"full" },
      { shape:"circle", count:5, size:"s", fill:"full" },
      null,
    ],
    answer: "6",
    digit: "6",
  },
  {
    title: "Puzzle 2 / 4",
    question: "Quel nombre complète la série ?",
    hint: "Dans chaque ligne, la 3ème case = 1ère case + 2ème case.",
    // col3 = col1 + col2 : 2+5=7, 3+4=7, 5+2=?=7
    grid: [
      { isNum: true, value: 2 },
      { isNum: true, value: 5 },
      { isNum: true, value: 7 },
      { isNum: true, value: 3 },
      { isNum: true, value: 4 },
      { isNum: true, value: 7 },
      { isNum: true, value: 5 },
      { isNum: true, value: 2 },
      null,
    ],
    answer: "7",
    digit: "7",
  },
  {
    title: "Puzzle 3 / 4",
    question: "Quel nombre manque ?",
    hint: "Dans chaque ligne, la somme des 3 cases vaut toujours le même total. Trouve ce total.",
    // Row sum = 12: (2,6,4),(4,3,5),(5,?,3) → ?=4
    grid: [
      { isNum: true, value: 2 },
      { isNum: true, value: 6 },
      { isNum: true, value: 4 },
      { isNum: true, value: 4 },
      { isNum: true, value: 3 },
      { isNum: true, value: 5 },
      { isNum: true, value: 5 },
      null,
      { isNum: true, value: 3 },
    ],
    missingIdx: 7,
    answer: "4",
    digit: "4",
  },
  {
    title: "Puzzle 4 / 4",
    question: "Combien de formes dans la case manquante ?",
    hint: "Les valeurs diminuent de 1 à chaque pas vers la droite ET vers le bas.",
    // row1: 6,5,4 | row2: 5,4,3 | row3: 4,3,?=2
    grid: [
      { shape:"star", count:6, size:"s", fill:"full" },
      { shape:"star", count:5, size:"s", fill:"full" },
      { shape:"star", count:4, size:"s", fill:"full" },
      { shape:"star", count:5, size:"s", fill:"full" },
      { shape:"star", count:4, size:"s", fill:"full" },
      { shape:"star", count:3, size:"s", fill:"full" },
      { shape:"star", count:4, size:"s", fill:"full" },
      { shape:"star", count:3, size:"s", fill:"full" },
      null,
    ],
    answer: "2",
    digit: "2",
  },
];

const FINAL_CODE = PUZZLES.map(p => p.digit).join(""); // "6742"
const COOLDOWN_S = 20; // seconds to wait after a wrong answer

// ─── Updated CellContent to support isNum ────────────────────────────────────

function NumCell({ value, highlight }) {
  const color = highlight ? "#FFD700" : "#00C9A7";
  return (
    <text x={42} y={52} textAnchor="middle" fontSize={30} fontWeight={800}
      fill={color} fontFamily="monospace">{value}</text>
  );
}

function GridCell({ cell }) {
  if (!cell) return (
    <div style={{
      width: 88, height: 88, border: "2px solid #1e1e2a", borderRadius: 8,
      background: "#10101a", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width={84} height={84} viewBox="0 0 84 84">
        <text x={42} y={52} textAnchor="middle" fontSize={36} fontWeight={800}
          fill="#444" fontFamily="monospace">?</text>
      </svg>
    </div>
  );
  const POS = {
    1:[[42,42]],2:[[27,42],[57,42]],3:[[20,42],[42,42],[64,42]],
    4:[[26,26],[58,26],[26,58],[58,58]],5:[[20,22],[58,22],[39,42],[20,62],[58,62]],
    6:[[18,22],[42,22],[66,22],[18,62],[42,62],[66,62]],
  };
  return (
    <div style={{
      width: 88, height: 88, border: "2px solid #1e1e2a", borderRadius: 8,
      background: "#10101a", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width={84} height={84} viewBox="0 0 84 84">
        {cell.isNum ? (
          <NumCell value={cell.value} />
        ) : (
          (POS[cell.count] || [[42,42]]).map((pos, i) => (
            <Shape key={i} shape={cell.shape} cx={pos[0]} cy={pos[1]}
              r={cell.size === "s" ? 8 : cell.size === "l" ? 20 : 13}
              fill={cell.fill} color="#00C9A7" />
          ))
        )}
      </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RavenPuzzle() {
  const [step, setStep]         = useState(0);
  const [input, setInput]       = useState("");
  const [locked, setLocked]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [wrongMsg, setWrongMsg] = useState(null);  // error message
  const [cooldown, setCooldown] = useState(0);     // seconds remaining
  const [digits, setDigits]     = useState([]);
  const [digitStates, setDigitStates] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hasWronged, setHasWronged] = useState(false);
  const [codeInput, setCodeInput]   = useState("");
  const [codeResult, setCodeResult] = useState(null);

  const puzzle = PUZZLES[step] || null;

  // countdown tick
  const startCooldown = () => {
    setCooldown(COOLDOWN_S);
    const iv = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(iv); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleValidate = () => {
    if (locked || cooldown > 0 || !input.trim()) return;
    if (input.trim() === puzzle.answer) {
      setLocked(true);
      setSuccess(true);
      setWrongMsg(null);
      setDigits(d => [...d, puzzle.digit]);
      setDigitStates(d => [...d, "ok"]);
    } else {
      setWrongMsg(`« ${input.trim()} » est incorrect. Observe bien le motif…`);
      setInput("");
      setHasWronged(true);
      startCooldown();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleValidate();
  };

  const handleNext = () => {
    setInput("");
    setLocked(false);
    setSuccess(false);
    setWrongMsg(null);
    setCooldown(0);
    setShowHint(false);
    setHasWronged(false);
    if (step + 1 >= PUZZLES.length) setStep(PUZZLES.length);
    else setStep(s => s + 1);
  };

  const handleCodeSubmit = () => {
    setCodeResult(codeInput === FINAL_CODE ? "ok" : "wrong");
  };

  const base = {
    minHeight: "100vh", background: "#07070f", color: "#ccc", fontFamily: "monospace",
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "30px 16px 48px", gap: 0,
  };

  // ── Final code screen ──
  if (step === PUZZLES.length) {
    return (
      <div style={base}>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 6, letterSpacing: 2 }}>VALIDATION FINALE</div>
        <h1 style={{ color: "#00C9A7", margin: "0 0 24px", fontSize: 22 }}>Scène terminée</h1>
        <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              width: 48, height: 58, borderRadius: 8,
              background: digitStates[i] === "ok" ? "#001a14" : "#1a0008",
              border: `2px solid ${digitStates[i] === "ok" ? "#00C9A7" : "#FF6B9D"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 800,
              color: digitStates[i] === "ok" ? "#FFD700" : "#FF6B9D",
            }}>{d}</div>
          ))}
        </div>
        <p style={{ color: "#666", marginBottom: 20, textAlign: "center", maxWidth: 360 }}>
          Entre le code à {PUZZLES.length} chiffres pour valider la scène.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            value={codeInput}
            onChange={e => { setCodeInput(e.target.value.replace(/\D/g, "").slice(0, PUZZLES.length)); setCodeResult(null); }}
            onKeyDown={e => e.key === "Enter" && handleCodeSubmit()}
            maxLength={PUZZLES.length}
            placeholder={"_".repeat(PUZZLES.length)}
            style={{
              width: 180, padding: "10px 14px", fontSize: 24, fontWeight: 800,
              letterSpacing: 8, textAlign: "center", fontFamily: "monospace",
              background: "#10101a", border: "2px solid #222", borderRadius: 8,
              color: "#fff", outline: "none",
            }}
          />
          <button onClick={handleCodeSubmit} style={{
            padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700,
            background: "#00C9A7", color: "#07070f", border: "none", cursor: "pointer",
          }}>VALIDER</button>
        </div>
        {codeResult === "ok" && (
          <div style={{ marginTop: 16, padding: "18px 32px", borderRadius: 12,
            background: "#001a14", border: "2px solid #00C9A7",
            color: "#00C9A7", fontSize: 18, fontWeight: 700, textAlign: "center" }}>
            ✓ Code correct — Scène validée !
          </div>
        )}
        {codeResult === "wrong" && (
          <div style={{ marginTop: 16, padding: "14px 24px", borderRadius: 10,
            background: "#1a0008", border: "2px solid #FF6B9D",
            color: "#FF6B9D", fontSize: 15, fontWeight: 600 }}>
            ✗ Code incorrect.
          </div>
        )}
      </div>
    );
  }

  const gridToShow = puzzle.missingIdx !== undefined
    ? puzzle.grid.map((c, i) => (i === puzzle.missingIdx ? null : c))
    : puzzle.grid;

  return (
    <div style={base}>
      <div style={{ fontSize: 11, color: "#444", letterSpacing: 3, marginBottom: 6 }}>MATRICES DE RAVEN</div>
      <div style={{ fontSize: 13, color: "#00C9A7", marginBottom: 20, letterSpacing: 1 }}>{puzzle.title}</div>

      {/* Progress bar */}
      <div style={{ width: 300, height: 4, background: "#1a1a2a", borderRadius: 2, marginBottom: 28 }}>
        <div style={{ width: `${(step / PUZZLES.length) * 100}%`, height: "100%", background: "#00C9A7", borderRadius: 2, transition: "width 0.4s" }} />
      </div>

      {/* Digit slots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, minHeight: 40 }}>
        {PUZZLES.map((_, i) => {
          const d = digits[i];
          const state = digitStates[i];
          const isCurrent = i === step;
          return (
            <div key={i} style={{
              width: 36, height: 40, borderRadius: 6,
              background: state === "ok" ? "#001a14" : "#0d0d18",
              border: `2px solid ${isCurrent && !locked ? "#444" : state === "ok" ? "#00C9A7" : "#1a1a2a"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800,
              color: state === "ok" ? "#FFD700" : "#333",
              transition: "all 0.3s",
            }}>{d || (isCurrent ? "…" : "·")}</div>
          );
        })}
      </div>

      {/* 3×3 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 92px)", gap: 5, marginBottom: 24 }}>
        {gridToShow.map((cell, idx) => <GridCell key={idx} cell={cell} />)}
      </div>

      {/* Question */}
      <div style={{ color: "#aaa", fontSize: 14, marginBottom: 16, textAlign: "center", maxWidth: 320 }}>
        {puzzle.question}
      </div>

      {/* Hint — only unlocked after at least one wrong answer */}
      <div style={{ marginBottom: 16, minHeight: 20 }}>
        {!hasWronged
          ? <div style={{ color: "#2a2a3a", fontSize: 11, fontFamily: "monospace" }}>💡 Indice (disponible après une erreur)</div>
          : !showHint
            ? <button onClick={() => setShowHint(true)} style={{
                background: "none", border: "1px solid #444", color: "#888",
                borderRadius: 6, padding: "3px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace",
              }}>💡 Voir l'indice</button>
            : <div style={{ color: "#555", fontSize: 12, maxWidth: 320, textAlign: "center", lineHeight: 1.5 }}>{puzzle.hint}</div>
        }
      </div>

      {/* Wrong message */}
      {wrongMsg && (
        <div style={{ color: "#FF6B9D", fontSize: 12, marginBottom: 10, maxWidth: 320, textAlign: "center" }}>
          {wrongMsg}
        </div>
      )}

      {/* Input + validate */}
      {!locked ? (
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
            onKeyDown={handleKeyDown}
            disabled={cooldown > 0}
            placeholder="?"
            autoFocus
            style={{
              width: 64, padding: "10px 0", fontSize: 26, fontWeight: 800,
              textAlign: "center", fontFamily: "monospace",
              background: "#10101a",
              border: `2px solid ${cooldown > 0 ? "#FF6B9D44" : "#333"}`,
              borderRadius: 8, color: "#fff", outline: "none",
            }}
          />
          <button
            onClick={handleValidate}
            disabled={!input.trim() || cooldown > 0}
            style={{
              padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700,
              background: (input.trim() && cooldown === 0) ? "#00C9A7" : "#111",
              color: (input.trim() && cooldown === 0) ? "#07070f" : "#444",
              border: "none", cursor: (input.trim() && cooldown === 0) ? "pointer" : "not-allowed",
              fontFamily: "monospace", transition: "all 0.2s", minWidth: 120,
            }}>
            {cooldown > 0 ? `Attends ${cooldown}s…` : "VALIDER"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#001a14", border: "2px solid #00C9A7",
            borderRadius: 10, padding: "10px 24px",
          }}>
            <span style={{ color: "#00C9A7", fontSize: 14, fontWeight: 700 }}>✓ Correct !</span>
            <span style={{ color: "#555", fontSize: 14 }}>Chiffre débloqué :</span>
            <span style={{ color: "#FFD700", fontSize: 26, fontWeight: 800 }}>{puzzle.digit}</span>
          </div>
          <button onClick={handleNext} style={{
            padding: "10px 32px", borderRadius: 8, fontSize: 14, fontWeight: 700,
            background: "#00C9A7", color: "#07070f", border: "none", cursor: "pointer",
            fontFamily: "monospace",
          }}>{step + 1 < PUZZLES.length ? "PUZZLE SUIVANT →" : "VOIR MON CODE →"}</button>
        </div>
      )}
    </div>
  );
}

