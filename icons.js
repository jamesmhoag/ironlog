(() => {
  const React = window.React;
  function Icon({ children, size = 20, strokeWidth = 2, className = "", style, ...rest }) {
    return React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        style,
        ...rest
      },
      children
    );
  }
  function P(d, key) {
    return React.createElement("path", { d, key });
  }
  function Ci(cx, cy, r, key) {
    return React.createElement("circle", { cx, cy, r, key });
  }
  function Ln(x1, y1, x2, y2, key) {
    return React.createElement("line", { x1, y1, x2, y2, key });
  }
  function Pl(points, key) {
    return React.createElement("polyline", { points, key });
  }
  function Rc(x, y, w, h, rx, key) {
    return React.createElement("rect", { x, y, width: w, height: h, rx, key });
  }
  const Dumbbell = (p) => Icon({ ...p, children: [
    P("M6.5 6.5 17.5 17.5", "a"),
    P("M2.6 2.6 5 5", "b"),
    P("M19 19l2.4 2.4", "c"),
    Rc(2, 8, 6, 8, 2, "d"),
    Rc(16, 8, 6, 8, 2, "e"),
    Ln(8, 12, 16, 12, "f")
  ] });
  const Play = (p) => Icon({ ...p, children: [P("M8 5v14l11-7z", "a")] });
  const Check = (p) => Icon({ ...p, children: [Pl("20 6 9 17 4 12", "a")] });
  const X = (p) => Icon({ ...p, children: [Ln(18, 6, 6, 18, "a"), Ln(6, 6, 18, 18, "b")] });
  const Plus = (p) => Icon({ ...p, children: [Ln(12, 5, 12, 19, "a"), Ln(5, 12, 19, 12, "b")] });
  const Settings = (p) => Icon({ ...p, children: [
    Ci(12, 12, 3, "a"),
    P("M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z", "b")
  ] });
  const HistoryIcon = (p) => Icon({ ...p, children: [
    P("M3 3v5h5", "a"),
    P("M3.05 13A9 9 0 1 0 6 5.3L3 8", "b"),
    Pl("12 7 12 12 16 14", "c")
  ] });
  const Target = (p) => Icon({ ...p, children: [Ci(12, 12, 10, "a"), Ci(12, 12, 6, "b"), Ci(12, 12, 2, "c")] });
  const NotebookPen = (p) => Icon({ ...p, children: [
    P("M13.4 2.6a2.1 2.1 0 1 1 3 3L7 15l-4 1 1-4Z", "a"),
    P("M4 22h16", "b"),
    P("M4 6h2", "c"),
    P("M4 10h2", "d"),
    P("M4 14h2", "e"),
    P("M4 18h4", "f")
  ] });
  const Star = (p) => Icon({ ...p, children: [P("M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z", "a")] });
  const ThermometerSun = (p) => Icon({ ...p, children: [
    P("M12 9a4 4 0 0 0-4 4v4.5a2.5 2.5 0 1 0 5 0V13a1 1 0 0 0-1-1", "a"),
    P("M12 3v1", "b"),
    P("M18.4 5.6l-.7.7", "c"),
    P("M21 12h-1", "d"),
    P("M4 12H3", "e"),
    P("M6.3 6.3l-.7-.7", "f")
  ] });
  const Plane = (p) => Icon({ ...p, children: [P("M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.3.5-.1 1.1.4 1.4L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.2c.3.5.9.7 1.4.4l.5-.3c.4-.2.6-.6.5-1.1z", "a")] });
  const AlertTriangle = (p) => Icon({ ...p, children: [
    P("M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "a"),
    Ln(12, 9, 12, 13, "b"),
    Ln(12, 17, 12.01, 17, "c")
  ] });
  const MessageSquare = (p) => Icon({ ...p, children: [P("M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", "a")] });
  const Trash2 = (p) => Icon({ ...p, children: [
    Ln(3, 6, 21, 6, "a"),
    P("M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", "b"),
    P("M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "c"),
    Ln(10, 11, 10, 17, "d"),
    Ln(14, 11, 14, 17, "e")
  ] });
  const TrendingUp = (p) => Icon({ ...p, children: [Pl("23 6 13.5 15.5 8.5 10.5 1 18", "a"), Pl("17 6 23 6 23 12", "b")] });
  const Clock = (p) => Icon({ ...p, children: [Ci(12, 12, 10, "a"), Pl("12 6 12 12 16 14", "b")] });
  const Flame = (p) => Icon({ ...p, children: [P("M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z", "a")] });
  const Trophy = (p) => Icon({ ...p, children: [
    P("M8 21h8", "a"),
    P("M12 17v4", "b"),
    P("M7 4h10v5a5 5 0 0 1-10 0z", "c"),
    P("M17 5h3a2 2 0 0 1-2 4h-1", "d"),
    P("M7 5H4a2 2 0 0 0 2 4h1", "e")
  ] });
  const ChevronDown = (p) => Icon({ ...p, children: [Pl("6 9 12 15 18 9", "a")] });
  const ChevronUp = (p) => Icon({ ...p, children: [Pl("18 15 12 9 6 15", "a")] });
  const Loader2 = (p) => Icon({ ...p, children: [P("M21 12a9 9 0 1 1-6.219-8.56", "a")] });
  const RotateCcw = (p) => Icon({ ...p, children: [P("M3 12a9 9 0 1 0 3-6.7L3 8", "a"), Pl("3 3 3 8 8 8", "b")] });
  const Lock = (p) => Icon({ ...p, children: [Rc(3, 11, 18, 11, 2, "a"), P("M7 11V7a5 5 0 0 1 10 0v4", "b")] });
  const Pencil = (p) => Icon({ ...p, children: [
    P("M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z", "a"),
    Ln(15, 5, 19, 9, "b")
  ] });
  const CheckIcon = Check;
  const ChevronRight = (p) => Icon({ ...p, children: [Pl("9 18 15 12 9 6", "a")] });
  const ChevronLeft = (p) => Icon({ ...p, children: [Pl("15 18 9 12 15 6", "a")] });
  window.Dumbbell = Dumbbell;
  window.Play = Play;
  window.Check = Check;
  window.X = X;
  window.Plus = Plus;
  window.Settings = Settings;
  window.HistoryIcon = HistoryIcon;
  window.Target = Target;
  window.NotebookPen = NotebookPen;
  window.Star = Star;
  window.ThermometerSun = ThermometerSun;
  window.Plane = Plane;
  window.AlertTriangle = AlertTriangle;
  window.MessageSquare = MessageSquare;
  window.Trash2 = Trash2;
  window.TrendingUp = TrendingUp;
  window.Clock = Clock;
  window.Flame = Flame;
  window.Trophy = Trophy;
  window.ChevronDown = ChevronDown;
  window.ChevronUp = ChevronUp;
  window.Loader2 = Loader2;
  window.RotateCcw = RotateCcw;
  window.Lock = Lock;
  window.Pencil = Pencil;
  window.CheckIcon = CheckIcon;
  window.ChevronRight = ChevronRight;
  window.ChevronLeft = ChevronLeft;
})();
