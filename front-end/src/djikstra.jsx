import { useState, useRef, useEffect } from "react";

const COLORS = { green: "#00C9A7", dark: "#888", pink: "#FF6B9D" };

const initNodes = [
  { id: "S", x: 80, y: 120, label: "S" },
  { id: "A", x: 250, y: 80, label: "A" },
  { id: "B", x: 420, y: 80, label: "B" },
  { id: "C", x: 600, y: 80, label: "C" },
  { id: "D", x: 780, y: 80, label: "D" },
  { id: "F", x: 80, y: 300, label: "F" },
  { id: "G", x: 260, y: 300, label: "G" },
  { id: "H", x: 450, y: 300, label: "H" },
  { id: "I", x: 650, y: 300, label: "I" },
  { id: "J", x: 830, y: 300, label: "J" },
  { id: "K", x: 150, y: 470, label: "K" },
  { id: "L", x: 350, y: 470, label: "L" },
  { id: "M", x: 520, y: 470, label: "M" },
  { id: "Q", x: 650, y: 470, label: "Q" },
  { id: "R", x: 750, y: 470, label: "R" },
  { id: "E", x: 830, y: 520, label: "E" },
];

const initEdges = [
  { from: "S", to: "A", color: "green", weight: 4, bidir: false },
  { from: "S", to: "F", color: "green", weight: 7, bidir: true },
  { from: "A", to: "B", color: "green", weight: 2, bidir: false },
  { from: "A", to: "G", color: "green", weight: 5, bidir: false },
  { from: "A", to: "F", color: "pink", weight: 9, bidir: false },
  { from: "B", to: "C", color: "green", weight: 6, bidir: false },
  { from: "B", to: "H", color: "green", weight: 3, bidir: false },
  { from: "C", to: "D", color: "green", weight: 2, bidir: false },
  { from: "C", to: "I", color: "pink", weight: 4, bidir: false },
  { from: "D", to: "J", color: "green", weight: 5, bidir: true },
  { from: "D", to: "I", color: "dark", weight: 6, bidir: false },
  { from: "F", to: "G", color: "green", weight: 3, bidir: true },
  { from: "G", to: "H", color: "green", weight: 2, bidir: false },
  { from: "H", to: "I", color: "green", weight: 4, bidir: true },
  { from: "H", to: "M", color: "green", weight: 5, bidir: false },
  { from: "I", to: "J", color: "green", weight: 2, bidir: false },
  { from: "I", to: "Q", color: "pink", weight: 3, bidir: false },
  { from: "F", to: "K", color: "green", weight: 4, bidir: false },
  { from: "K", to: "L", color: "green", weight: 2, bidir: false },
  { from: "L", to: "M", color: "dark", weight: 4, bidir: true },
  { from: "M", to: "Q", color: "green", weight: 2, bidir: false },
  { from: "Q", to: "R", color: "green", weight: 3, bidir: false },
  { from: "R", to: "E", color: "green", weight: 2, bidir: false },
  { from: "J", to: "E", color: "green", weight: 5, bidir: false },
];

function dijkstra(nodes, edges, startId, endId) {
  const dist = {}, prev = {}, visited = new Set(), pq = [];
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[startId] = 0;
  pq.push({ id: startId, d: 0 });
  const adj = {};
  nodes.forEach(n => (adj[n.id] = []));
  edges.forEach(e => {
    adj[e.from]?.push({ to: e.to, w: e.weight });
    if (e.bidir) adj[e.to]?.push({ to: e.from, w: e.weight });
  });
  const steps = [];
  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const { id: u } = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    steps.push({ t: "v", n: u });
    if (u === endId) break;
    for (const { to, w } of adj[u] || []) {
      if (!visited.has(to) && dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w;
        prev[to] = u;
        pq.push({ id: to, d: dist[to] });
        steps.push({ t: "r", f: u, to });
      }
    }
  }
  const path = [];
  let c = endId;
  while (c) { path.unshift(c); c = prev[c]; }
  return path[0] === startId ? { dist: dist[endId], path, steps } : { dist: Infinity, path: [], steps };
}

function EdgeLine({ x1, y1, x2, y2, color, weight, bidir, highlight, selected, onSelect, offset }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const ux = dx / len, uy = dy / len;
  const nx = -uy * offset * 12, ny = ux * offset * 12;
  const R = 24;
  const sx = x1 + nx + ux * R, sy = y1 + ny + uy * R;
  const ex = x2 + nx - ux * R, ey = y2 + ny - uy * R;
  const mx = (sx + ex) / 2, my = (sy + ey) / 2;
  const ang = Math.atan2(ey - sy, ex - sx);
  const S = 9;
  const col = highlight ? "#FFD700" : selected ? "#fff" : color;
  const sw = highlight ? 3.5 : selected ? 3 : 2;
  const arrow = (px, py, a) => {
    const p1x = px - S * Math.cos(a - 0.38), p1y = py - S * Math.sin(a - 0.38);
    const p2x = px - S * Math.cos(a + 0.38), p2y = py - S * Math.sin(a + 0.38);
    return <polygon points={`${px},${py} ${p1x},${p1y} ${p2x},${p2y}`} fill={col} />;
  };
  return (
    <g style={{ cursor: "pointer" }} onClick={e => { e.stopPropagation(); onSelect(); }}>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="transparent" strokeWidth={18} />
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col} strokeWidth={sw} opacity={0.85} />
      {arrow(ex, ey, ang)}
      {bidir && arrow(sx, sy, ang + Math.PI)}
      <rect x={mx - 13} y={my - 11} width={26} height={17} rx={3} fill="#0a0a0f" opacity={0.9} />
      <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fill={col} fontSize={11} fontWeight={700} fontFamily="monospace">{weight}</text>
    </g>
  );
}

let _nid = 100;

export default function App() {
  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);
  const [mode, setMode] = useState("move");
  const [selNode, setSelNode] = useState(null);
  const [selEdge, setSelEdge] = useState(null);
  const [edgeSrc, setEdgeSrc] = useState(null);
  const [edgeColor, setEdgeColor] = useState("green");
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [edgeBidir, setEdgeBidir] = useState(false);
  const [startN, setStartN] = useState("S");
  const [endN, setEndN] = useState("E");
  const [result, setResult] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [relaxed, setRelaxed] = useState(new Set());
  const [animating, setAnimating] = useState(false);
  const [animIdx, setAnimIdx] = useState(-1);
  const [mousePos, setMousePos] = useState(null);

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const dragOff = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);

  const nmap = {};
  nodes.forEach(n => nmap[n.id] = n);

  const toSVG = e => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    return { x: (e.clientX - r.left) * vb.width / r.width, y: (e.clientY - r.top) * vb.height / r.height };
  };

  // ── Pointer handlers: drag always works via left click hold ──
  const onNodePointerDown = (e, id) => {
    if (e.button !== 0) return; // left click only
    e.preventDefault();
    e.stopPropagation();

    didDrag.current = false; // reset pour tous les modes

    // In move mode: start drag
    if (mode === "move" || mode === "select") {
      const pt = toSVG(e);
      const n = nmap[id];
      dragRef.current = id;
      dragOff.current = { x: pt.x - n.x, y: pt.y - n.y };
      svgRef.current?.setPointerCapture(e.pointerId);
    }
  };

  // Left click on node (not drag) — handles mode actions
  const onNodeClick = (e, id) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    // If we just dragged, ignore click
    if (didDrag.current) return;

    if (mode === "edge") {
      if (!edgeSrc) {
        setEdgeSrc(id);
      } else if (edgeSrc !== id) {
        setEdges(p => [...p, { from: edgeSrc, to: id, color: edgeColor, weight: edgeWeight, bidir: edgeBidir }]);
        setEdgeSrc(null);
      } else {
        setEdgeSrc(null);
      }
    } else if (mode === "delete") {
      setNodes(p => p.filter(n => n.id !== id));
      setEdges(p => p.filter(ed => ed.from !== id && ed.to !== id));
      if (selNode === id) setSelNode(null);
    } else if (mode === "add") {
      // clicking on existing node in add mode = select
      setSelNode(id);
      setSelEdge(null);
    } else {
      // move or select
      setSelNode(id);
      setSelEdge(null);
    }
  };

  const onPointerMove = e => {
    const pt = toSVG(e);
    setMousePos(pt);
    if (!dragRef.current) return;
    didDrag.current = true;
    const { x: ox, y: oy } = dragOff.current;
    setNodes(prev => prev.map(n => n.id === dragRef.current
      ? { ...n, x: Math.max(20, Math.min(940, pt.x - ox)), y: Math.max(20, Math.min(580, pt.y - oy)) }
      : n
    ));
  };

  const onPointerUp = e => {
    if (dragRef.current) {
      svgRef.current?.releasePointerCapture(e.pointerId);
      dragRef.current = null;
    }
  };

  // Canvas left click
  const onCanvasClick = e => {
    if (e.button !== 0) return;
    if (mode === "add") {
      const pt = toSVG(e);
      _nid++;
      const label = String.fromCharCode(65 + (_nid % 26));
      setNodes(p => [...p, { id: `n${_nid}`, x: pt.x, y: pt.y, label }]);
      return;
    }
    if (mode === "edge" && edgeSrc) {
      setEdgeSrc(null);
      return;
    }
    setSelNode(null);
    setSelEdge(null);
  };

  // Dijkstra
  const solve = () => {
    const r = dijkstra(nodes, edges, startN, endN);
    setResult(r);
    setVisited(new Set());
    setRelaxed(new Set());
    setAnimating(false);
    setAnimIdx(-1);
  };

  const anim = () => {
    if (!result?.steps?.length) return;
    setAnimating(true);
    setAnimIdx(0);
    setVisited(new Set());
    setRelaxed(new Set());
  };

  useEffect(() => {
    if (!animating || !result) return;
    if (animIdx >= result.steps.length) { setAnimating(false); return; }
    const t = setTimeout(() => {
      const s = result.steps[animIdx];
      if (s.t === "v") setVisited(p => new Set([...p, s.n]));
      else setRelaxed(p => new Set([...p, `${s.f}-${s.to}`]));
      setAnimIdx(i => i + 1);
    }, 350);
    return () => clearTimeout(t);
  }, [animIdx, animating, result]);

  const isOnPath = (from, to) => {
    if (!result?.path?.length) return false;
    for (let i = 0; i < result.path.length - 1; i++) {
      if (result.path[i] === from && result.path[i + 1] === to) return true;
      const ed = edges.find(e => e.from === from && e.to === to);
      if (ed?.bidir && result.path[i] === to && result.path[i + 1] === from) return true;
    }
    return false;
  };

  const edgeOff = (edge, idx) => {
    const dup = edges.findIndex((e2, j) => j !== idx && ((e2.from === edge.from && e2.to === edge.to) || (e2.from === edge.to && e2.to === edge.from)));
    return dup === -1 ? 0 : idx < dup ? 1 : -1;
  };

  const btnStyle = (active, col) => ({
    padding: "5px 10px", borderRadius: 6,
    border: active ? `2px solid ${col || "#00C9A7"}` : "1px solid #222",
    background: active ? (col || "#00C9A7") + "12" : "#111",
    color: active ? (col || "#00C9A7") : "#777",
    cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "monospace",
    whiteSpace: "nowrap",
  });

  const modes = [
    { m: "move", icon: "✋", t: "Déplacer" },
    { m: "add", icon: "⊕", t: "Ajouter nœud" },
    { m: "edge", icon: "↗", t: "Ajouter arête" },
    { m: "delete", icon: "✕", t: "Supprimer" },
    { m: "select", icon: "◎", t: "Éditer" },
  ];

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e0e0e0", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      {/* Toolbar */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", background: "#0d0d14" }}>
        <span style={{ fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg,#00C9A7,#FF6B9D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginRight: 4 }}>DIJKSTRA</span>
        <div style={{ width: 1, height: 20, background: "#222" }} />
        {modes.map(({ m, icon, t }) => (
          <button key={m} onClick={() => { setMode(m); setEdgeSrc(null); }} style={btnStyle(mode === m)}>{icon} {t}</button>
        ))}
      </div>

      {/* Edge creation bar */}
      {mode === "edge" && (
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #1a1a2e", background: "#0b0b12", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#555" }}>Couleur:</span>
          {Object.entries(COLORS).map(([k, v]) => (
            <button key={k} onClick={() => setEdgeColor(k)} style={{
              width: 26, height: 26, borderRadius: "50%", background: v,
              border: edgeColor === k ? "3px solid #fff" : "2px solid #333",
              cursor: "pointer", boxShadow: edgeColor === k ? `0 0 10px ${v}` : "none",
            }} />
          ))}
          <span style={{ fontSize: 12, color: "#555", marginLeft: 6 }}>Poids:</span>
          <input type="number" value={edgeWeight} onChange={e => setEdgeWeight(Math.max(1, +e.target.value))} min={1}
            style={{ width: 48, padding: "3px 6px", borderRadius: 4, border: "1px solid #333", background: "#111", color: "#fff", fontSize: 13, textAlign: "center" }} />
          <button onClick={() => setEdgeBidir(!edgeBidir)} style={{ ...btnStyle(edgeBidir, "#FFD700"), padding: "5px 14px" }}>
            {edgeBidir ? "⟷ Double sens" : "→ Sens unique"}
          </button>
          {edgeSrc ? (
            <span style={{ color: "#FFD700", fontSize: 13, fontWeight: 700 }}>
              ⚡ {nmap[edgeSrc]?.label} → clic gauche sur destination
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "#555" }}>Clic gauche sur un nœud de départ</span>
          )}
        </div>
      )}

      {mode === "add" && (
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #1a1a2e", background: "#0b0b12" }}>
          <span style={{ fontSize: 12, color: "#00C9A7" }}>Clic gauche sur le canvas pour placer un nœud</span>
        </div>
      )}

      {/* Dijkstra controls */}
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #1a1a2e", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", background: "#0b0b12" }}>
        <span style={{ fontSize: 12, color: "#555" }}>De:</span>
        <select value={startN} onChange={e => setStartN(e.target.value)} style={{ padding: "3px 6px", borderRadius: 4, border: "1px solid #333", background: "#111", color: "#00C9A7", fontSize: 13 }}>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "#555" }}>À:</span>
        <select value={endN} onChange={e => setEndN(e.target.value)} style={{ padding: "3px 6px", borderRadius: 4, border: "1px solid #333", background: "#111", color: "#FF6B9D", fontSize: 13 }}>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        <button onClick={solve} style={{ padding: "5px 16px", borderRadius: 6, border: "none", background: "linear-gradient(135deg,#00C9A7,#00A98F)", color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>▶ Dijkstra</button>
        {result && <button onClick={anim} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid #FF6B9D", background: "transparent", color: "#FF6B9D", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>⏯ Animer</button>}
        {result && (
          <span style={{ fontSize: 12, fontWeight: 700, color: result.dist === Infinity ? "#ff4444" : "#FFD700" }}>
            {result.dist === Infinity ? "Aucun chemin" : `Distance: ${result.dist} | ${result.path.map(id => nmap[id]?.label || id).join(" → ")}`}
          </span>
        )}
      </div>

      {/* Node editor */}
      {selNode && (mode === "move" || mode === "select") && nmap[selNode] && (
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #1a1a2e", background: "#0d0d18", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#888" }}>Nœud {nmap[selNode]?.label}:</span>
          <input value={nmap[selNode]?.label || ""} onChange={e => setNodes(p => p.map(n => n.id === selNode ? { ...n, label: e.target.value } : n))}
            style={{ padding: "3px 6px", borderRadius: 4, border: "1px solid #333", background: "#111", color: "#fff", fontSize: 13, width: 60, textAlign: "center" }} />
          <button onClick={() => { setNodes(p => p.filter(n => n.id !== selNode)); setEdges(p => p.filter(e => e.from !== selNode && e.to !== selNode)); setSelNode(null); }}
            style={{ ...btnStyle(false), color: "#ff4444", borderColor: "#ff4444" }}>Supprimer</button>
        </div>
      )}

      {/* Edge editor */}
      {selEdge !== null && edges[selEdge] && (
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #1a1a2e", background: "#0d0d18", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#888" }}>
            {nmap[edges[selEdge].from]?.label} {edges[selEdge].bidir ? "⟷" : "→"} {nmap[edges[selEdge].to]?.label}
          </span>
          <input type="number" value={edges[selEdge].weight}
            onChange={e => setEdges(p => p.map((ed, i) => i === selEdge ? { ...ed, weight: Math.max(1, +e.target.value) } : ed))} min={1}
            style={{ width: 48, padding: "3px 6px", borderRadius: 4, border: "1px solid #333", background: "#111", color: "#fff", fontSize: 13, textAlign: "center" }} />
          {Object.entries(COLORS).map(([k, v]) => (
            <button key={k} onClick={() => setEdges(p => p.map((ed, i) => i === selEdge ? { ...ed, color: k } : ed))}
              style={{ width: 22, height: 22, borderRadius: "50%", background: v, border: edges[selEdge].color === k ? "3px solid #fff" : "2px solid #333", cursor: "pointer" }} />
          ))}
          <button onClick={() => setEdges(p => p.map((ed, i) => i === selEdge ? { ...ed, bidir: !ed.bidir } : ed))}
            style={{ ...btnStyle(edges[selEdge].bidir, "#FFD700") }}>
            {edges[selEdge].bidir ? "⟷ Double" : "→ Simple"}
          </button>
          <button onClick={() => { setEdges(p => p.filter((_, i) => i !== selEdge)); setSelEdge(null); }}
            style={{ ...btnStyle(false), color: "#ff4444", borderColor: "#ff4444" }}>Suppr</button>
        </div>
      )}

      {/* SVG */}
      <svg ref={svgRef} width="100%" viewBox="0 0 960 600"
        style={{ display: "block", background: "#0a0a0f", touchAction: "none",
          cursor: mode === "add" ? "crosshair" : mode === "delete" ? "not-allowed" : mode === "edge" ? "crosshair" : "default" }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onCanvasClick}
      >
        <defs>
          <radialGradient id="ng" cx="35%" cy="30%"><stop offset="0%" stopColor="#22223a"/><stop offset="100%" stopColor="#111120"/></radialGradient>
          <filter id="gl"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.5" fill="#151525" />
        </pattern>
        <rect width="960" height="600" fill="url(#grid)" />

        {/* Edges */}
        {edges.map((edge, i) => {
          const f = nmap[edge.from], t = nmap[edge.to];
          if (!f || !t) return null;
          return (
            <EdgeLine key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
              color={COLORS[edge.color]} weight={edge.weight} bidir={edge.bidir}
              highlight={isOnPath(edge.from, edge.to)}
              selected={selEdge === i}
              onSelect={() => { setSelEdge(i); setSelNode(null); }}
              offset={edgeOff(edge, i)}
            />
          );
        })}

        {/* Temp line while creating edge */}
        {edgeSrc && nmap[edgeSrc] && mousePos && (
          <line x1={nmap[edgeSrc].x} y1={nmap[edgeSrc].y} x2={mousePos.x} y2={mousePos.y}
            stroke="#FFD70066" strokeWidth={2} strokeDasharray="8 4" pointerEvents="none" />
        )}

        {/* Nodes */}
        {nodes.map(node => {
          const isS = node.id === startN, isE = node.id === endN;
          const isV = visited.has(node.id);
          const onP = result?.path?.includes(node.id) && !animating;
          let stroke = "#333";
          if (isS) stroke = "#00C9A7";
          if (isE) stroke = "#FF6B9D";
          if (onP) stroke = "#FFD700";
          if (isV && animating) stroke = "#FFD700";
          const isSel = selNode === node.id;
          const isSrc = edgeSrc === node.id;

          return (
            <g key={node.id}
              onPointerDown={e => onNodePointerDown(e, node.id)}
              onClick={e => onNodeClick(e, node.id)}
              style={{ cursor: mode === "move" || mode === "select" ? "grab" : mode === "edge" ? "crosshair" : mode === "delete" ? "not-allowed" : "pointer" }}
            >
              {onP && <circle cx={node.x} cy={node.y} r={32} fill="none" stroke="#FFD70030" strokeWidth={5} filter="url(#gl)" />}
              {isS && <circle cx={node.x} cy={node.y} r={28} fill="none" stroke="#00C9A730" strokeWidth={6} />}
              {isE && <circle cx={node.x} cy={node.y} r={28} fill="none" stroke="#FF6B9D30" strokeWidth={6} />}
              {isSrc && (
                <circle cx={node.x} cy={node.y} r={30} fill="none" stroke="#FFD700" strokeWidth={2.5} strokeDasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={node.x} cy={node.y} r={22} fill="url(#ng)" stroke={isSel ? "#fff" : stroke} strokeWidth={isSel ? 3 : 2} />
              <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central"
                fill={isS ? "#00C9A7" : isE ? "#FF6B9D" : onP ? "#FFD700" : "#e0e0e0"}
                fontSize={14} fontWeight={700} fontFamily="monospace"
                style={{ pointerEvents: "none", userSelect: "none" }}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Footer */}
      <div style={{ padding: "8px 16px", borderTop: "1px solid #1a1a2e", display: "flex", gap: 14, fontSize: 11, color: "#444", flexWrap: "wrap" }}>
        {Object.entries(COLORS).map(([k, v]) => (
          <span key={k}><span style={{ color: v }}>●</span> {k === "green" ? "Vert" : k === "dark" ? "Noir" : "Rose"}</span>
        ))}
        <span style={{ color: "#333" }}>|</span>
        <span>{nodes.length} nœuds · {edges.length} arêtes · {edges.filter(e => e.bidir).length} ⟷</span>
      </div>
    </div>
  );
}