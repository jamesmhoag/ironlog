(() => {
  const React = window.React;
  const { useState, useEffect } = React;
  function SimpleLineChart({ data, height = 200, valueFormatter, labelFormatter, unit = "" }) {
    const containerRef = React.useRef(null);
    const [width, setWidth] = useState(320);
    const [hoverIndex, setHoverIndex] = useState(null);
    useEffect(() => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setWidth(entry.contentRect.width);
        }
      });
      ro.observe(el);
      setWidth(el.clientWidth);
      return () => ro.disconnect();
    }, []);
    if (!data || data.length === 0) return null;
    const padding = { top: 16, right: 12, bottom: 24, left: 40 };
    const innerW = Math.max(10, width - padding.left - padding.right);
    const innerH = Math.max(10, height - padding.top - padding.bottom);
    const values = data.map((d) => d.value);
    let minV = Math.min(...values, 0);
    let maxV = Math.max(...values, 1);
    if (minV === maxV) {
      minV -= 1;
      maxV += 1;
    }
    const range = maxV - minV;
    const xFor = (i) => data.length === 1 ? innerW / 2 : i / (data.length - 1) * innerW;
    const yFor = (v) => innerH - (v - minV) / range * innerH;
    const linePoints = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");
    const yTicks = 4;
    const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => minV + range * i / yTicks);
    const handleMove = (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = clientX - rect.left - padding.left;
      if (data.length === 1) {
        setHoverIndex(0);
        return;
      }
      const idx = Math.round(relX / innerW * (data.length - 1));
      setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
    };
    const hovered = hoverIndex != null ? data[hoverIndex] : null;
    return React.createElement(
      "div",
      {
        ref: containerRef,
        style: { position: "relative", width: "100%", height },
        onMouseMove: (e) => handleMove(e.clientX),
        onMouseLeave: () => setHoverIndex(null),
        onTouchStart: (e) => handleMove(e.touches[0].clientX),
        onTouchMove: (e) => handleMove(e.touches[0].clientX),
        onTouchEnd: () => setTimeout(() => setHoverIndex(null), 1500)
      },
      React.createElement(
        "svg",
        { width: "100%", height, viewBox: `0 0 ${width} ${height}` },
        React.createElement(
          "g",
          { transform: `translate(${padding.left},${padding.top})` },
          // gridlines + y ticks
          yTickVals.map(
            (v, i) => React.createElement(
              "g",
              { key: "yt" + i },
              React.createElement("line", { x1: 0, y1: yFor(v), x2: innerW, y2: yFor(v), stroke: "#2a2a2d", strokeDasharray: "3 3" }),
              React.createElement("text", { x: -8, y: yFor(v) + 3, fill: "#8f8a80", fontSize: 10, textAnchor: "end", fontFamily: "JetBrains Mono, monospace" }, Math.round(v).toLocaleString())
            )
          ),
          // x ticks — plain increment numbers only
          data.map(
            (d, i) => (data.length <= 12 || i % Math.ceil(data.length / 10) === 0) && React.createElement("text", { key: "xt" + i, x: xFor(i), y: innerH + 16, fill: "#8f8a80", fontSize: 10, textAnchor: "middle", fontFamily: "JetBrains Mono, monospace" }, i + 1)
          ),
          // line
          React.createElement("polyline", { points: linePoints, fill: "none", stroke: "#c4463a", strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" }),
          // dots
          data.map(
            (d, i) => React.createElement("circle", {
              key: "dot" + i,
              cx: xFor(i),
              cy: yFor(d.value),
              r: hoverIndex === i ? 5 : 3,
              fill: "#c4463a",
              stroke: hoverIndex === i ? "#1b1b1d" : "none",
              strokeWidth: 2
            })
          ),
          // hover line
          hoverIndex != null && React.createElement("line", {
            x1: xFor(hoverIndex),
            y1: 0,
            x2: xFor(hoverIndex),
            y2: innerH,
            stroke: "#8f8a80",
            strokeDasharray: "3 3",
            opacity: 0.5
          })
        )
      ),
      hovered && React.createElement(
        "div",
        {
          className: "chart-tooltip",
          style: {
            left: `${Math.min(Math.max((xFor(hoverIndex) + padding.left) / width * 100, 15), 85)}%`
          }
        },
        React.createElement("div", { className: "chart-tooltip-label" }, labelFormatter ? labelFormatter(hovered) : `#${hoverIndex + 1}`),
        React.createElement("div", { className: "chart-tooltip-value" }, valueFormatter ? valueFormatter(hovered.value) : `${hovered.value}${unit}`)
      )
    );
  }
  window.SimpleLineChart = SimpleLineChart;
})();
