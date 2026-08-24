(() => {
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const { useState, useEffect, useMemo } = React;
  const {
    Dumbbell,
    Play,
    Check,
    X,
    Plus,
    Settings,
    HistoryIcon,
    Target,
    NotebookPen,
    Star,
    ThermometerSun,
    Plane,
    AlertTriangle,
    MessageSquare,
    Trash2,
    TrendingUp,
    Clock,
    Flame,
    Trophy,
    ChevronDown,
    ChevronUp,
    Loader2,
    RotateCcw,
    Lock,
    Pencil,
    CheckIcon,
    ChevronRight,
    ChevronLeft
  } = window;
  const SimpleLineChart = window.SimpleLineChart;
  function mkVariants(balReps, balWeight, buildReps, buildWeight) {
    return [
      { id: "v_balancing", label: "Balancing", reps: balReps, weight: balWeight, default: true },
      { id: "v_building", label: "Building", reps: buildReps, weight: buildWeight, default: false }
    ];
  }
  const RAW_EXERCISES_BASE = [
    { name: "Laying Curl", requirement: "Bench, 2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Standard Curl", requirement: "2\xD7 Dumbbell", r: [12, 18, 16, 22] },
    { name: "Overhand Curl", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Inward Curl", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Arm Bar Lift", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Milk Shakes", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Wirst Twist", requirement: "1\xD7 Cowbell", r: [10, 8, 13, 12] },
    { name: "Overhead Lift", requirement: "1\xD7 Cowbell", r: [10, 8, 13, 12] },
    { name: "Pendulum Lift", requirement: "1\xD7 Cowbell", r: [10, 8, 13, 12] },
    { name: "Bench Press", requirement: "Bench, 2\xD7 Dumbbell", r: [8, 25, 10, 30] },
    { name: "Christ Press", requirement: "Bench, 2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Rack Press", requirement: "Bench, 2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Wirst Curl", requirement: "Bench, 2\xD7 Dumbbell", r: [10, 13, 13, 17] },
    { name: "Stationary March", requirement: "2\xD7 Ankle, 2\xD7 Dumbbell", r: [14, 8, 17, 12] },
    { name: "Da Vinci Lift", requirement: "2\xD7 Dumbbell", r: [10, 13, 13, 17] },
    { name: "Chicken Lift", requirement: "2\xD7 Dumbbell", r: [10, 13, 13, 17] },
    { name: "Rowing Curls", requirement: "2\xD7 Dumbbell", r: [10, 13, 13, 17] },
    { name: "Hydrolic Extension", requirement: "1\xD7 Cowbell", r: [10, 8, 13, 12] },
    { name: "Sit Up", requirement: "Laying, 1\xD7 Dumbbell/Cowbell", r: [16, 4, 20, 8] },
    { name: "Twist Up", requirement: "Laying, 1\xD7 Dumbbell/Cowbell", r: [16, 4, 20, 8] },
    { name: "Push Up", requirement: "Laying", r: [15, 0, 20, 0] },
    { name: "Hip Up", requirement: "Laying, 2\xD7 Ankle", r: [14, 5, 17, 8] },
    { name: "Sprinter Block", requirement: "Laying, 2\xD7 Ankle", r: [14, 5, 17, 8] },
    { name: "Air Bike", requirement: "Laying, 2\xD7 Ankle", r: [16, 5, 20, 8] },
    { name: "Knee Up", requirement: "2\xD7 Ankle", r: [14, 5, 17, 8] },
    { name: "Ninja Hops", requirement: "2\xD7 Ankle", r: [14, 5, 17, 8] },
    { name: "Glute Bridges", requirement: "Laying", r: [14, 0, 17, 0] },
    { name: "Marching Lunge", requirement: "2\xD7 Ankle, 1\xD7 Dumbbell/Cowbell", r: [10, 8, 13, 12] },
    { name: "Standard Lunge", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Standard Squat", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Heel Lift", requirement: "2\xD7 Dumbbell", r: [14, 13, 17, 17] },
    { name: "Spread Squat", requirement: "1\xD7 Dumbbell/Cowbell", r: [10, 13, 13, 17] },
    { name: "Side Squats", requirement: "1\xD7 Dumbbell/Cowbell", r: [10, 13, 13, 17] },
    { name: "Crouch Walk", requirement: "2\xD7 Ankle", r: [10, 5, 13, 8] },
    { name: "Split Kick", requirement: "2\xD7 Ankle", r: [10, 5, 13, 8] },
    { name: "Donkey Kick", requirement: "Laying, 2\xD7 Ankle", r: [10, 5, 13, 8] },
    { name: "Leg Lift", requirement: "Laying, 2\xD7 Ankle", r: [10, 5, 13, 8] },
    { name: 'Sitting "L" Lift', requirement: "Bar, 2\xD7 Ankle", r: [10, 5, 13, 8] },
    { name: "Frog Lift", requirement: "Bar, 2\xD7 Ankle", r: [10, 5, 13, 8] },
    { name: "Butt Kicker", requirement: "2\xD7 Ankle", r: [14, 5, 17, 8] }
  ];
  const BONUS_DEFS = [
    { name: "Standing Press", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "RDL", requirement: "2\xD7 Dumbbell", r: [10, 18, 13, 22] },
    { name: "Core Punches", requirement: "2\xD7 Dumbbell", r: [20, 8, 25, 12] }
  ];
  const RAW_EXERCISES = [...RAW_EXERCISES_BASE, ...BONUS_DEFS].map((e, i) => ({
    id: `ex_${i}`,
    name: e.name,
    requirement: e.requirement,
    isBonus: i >= RAW_EXERCISES_BASE.length,
    variants: mkVariants(...e.r)
  }));
  const byName = Object.fromEntries(RAW_EXERCISES.map((e) => [e.name, e.id]));
  const idFor = (n) => byName[n] || null;
  const WORKOUT_SEED = [
    {
      name: "Arms",
      bonusExName: "Standing Press",
      sessions: [
        { name: "Morning", exNames: ["Milk Shakes", "Pendulum Lift", "Wirst Twist"] },
        { name: "Afternoon", exNames: ["Overhand Curl", "Inward Curl", "Arm Bar Lift", "Standard Curl", "Overhead Lift"] },
        { name: "Night", exNames: ["Standard Curl", "Milk Shakes", "Bench Press", "Laying Curl", "Christ Press", "Rack Press", "Wirst Curl"] }
      ]
    },
    {
      name: "Legs",
      bonusExName: "RDL",
      sessions: [
        { name: "Morning", exNames: ["Standard Lunge", "Butt Kicker", "Glute Bridges"] },
        { name: "Afternoon", exNames: ["Marching Lunge", "Standard Squat", "Donkey Kick", "Spread Squat", "Heel Lift"] },
        { name: "Night", exNames: ["Split Kick", "Side Squats", "Marching Lunge", "Donkey Kick", 'Sitting "L" Lift', "Frog Lift", "Leg Lift"] }
      ]
    },
    {
      name: "Core",
      bonusExName: "Core Punches",
      sessions: [
        { name: "Morning", exNames: ["Twist Up", "Hip Up", "Stationary March"] },
        { name: "Afternoon", exNames: ["Ninja Hops", "Twist Up", "Push Up", "Knee Up", "Hydrolic Extension"] },
        { name: "Night", exNames: ["Sit Up", "Air Bike", "Sprinter Block", "Ninja Hops", "Da Vinci Lift", "Rowing Curls", "Chicken Lift"] }
      ]
    },
    {
      name: "Arms II",
      bonusExName: "Standing Press",
      sessions: [
        { name: "Morning", exNames: ["Milk Shakes", "Pendulum Lift", "Wirst Twist"] },
        { name: "Afternoon", exNames: ["Overhead Lift", "Inward Curl", "Arm Bar Lift", "Standard Curl", "Overhand Curl"] },
        { name: "Night", exNames: ["Overhand Curl", "Laying Curl", "Overhead Lift", "Bench Press", "Christ Press", "Rack Press", "Wirst Curl"] }
      ]
    },
    {
      name: "Legs II",
      bonusExName: "RDL",
      sessions: [
        { name: "Morning", exNames: ["Standard Lunge", "Butt Kicker", "Glute Bridges"] },
        { name: "Afternoon", exNames: ["Marching Lunge", "Standard Squat", "Donkey Kick", "Spread Squat", "Standard Lunge"] },
        { name: "Night", exNames: ["Standard Squat", "Split Kick", "Heel Lift", "Side Squats", 'Sitting "L" Lift', "Frog Lift", "Leg Lift"] }
      ]
    },
    {
      name: "Core II",
      bonusExName: "Core Punches",
      sessions: [
        { name: "Morning", exNames: ["Twist Up", "Hip Up", "Stationary March"] },
        { name: "Afternoon", exNames: ["Rowing Curls", "Chicken Lift", "Push Up", "Sit Up", "Hydrolic Extension"] },
        { name: "Night", exNames: ["Knee Up", "Air Bike", "Sprinter Block", "Ninja Hops", "Da Vinci Lift", "Chicken Lift", "Push Up"] }
      ]
    }
  ];
  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
  function nextInstId() {
    return uid("inst");
  }
  function nextSessId() {
    return uid("sess");
  }
  function nextWorkoutId() {
    return uid("wk");
  }
  function nextPlanId() {
    return uid("plan");
  }
  function buildWorkoutsFrom(workoutSeedOrTemplate) {
    return workoutSeedOrTemplate.map((w) => ({
      id: nextWorkoutId(),
      name: w.name,
      bonusExId: w.bonusExId !== void 0 ? w.bonusExId : idFor(w.bonusExName),
      sessions: (w.sessions || []).map((s) => ({
        id: nextSessId(),
        name: s.name,
        exercises: (s.exercises || (s.exNames || []).map((n) => ({ exId: idFor(n) }))).map((x) => ({ instId: nextInstId(), exId: x.exId })).filter((x) => x.exId)
      }))
    }));
  }
  function buildWorkouts() {
    return buildWorkoutsFrom(WORKOUT_SEED);
  }
  function buildPlans() {
    return [
      {
        id: nextPlanId(),
        name: "Weekly Rotation",
        setsPerExercise: DEFAULT_SETS_PER_EXERCISE,
        workouts: buildWorkouts()
      }
    ];
  }
  function createPlanIteration(plan, defaultVariantId) {
    return {
      id: uid("iter"),
      planId: plan.id,
      planName: plan.name,
      setsPerExercise: plan.setsPerExercise || DEFAULT_SETS_PER_EXERCISE,
      defaultVariantId,
      startedAt: (/* @__PURE__ */ new Date()).toISOString(),
      workouts: buildWorkoutsFrom(plan.workouts)
    };
  }
  const SKIP_REASONS = [
    { id: "sick", label: "Sick", icon: ThermometerSun },
    { id: "vacation", label: "Vacation", icon: Plane },
    { id: "injury", label: "Injury", icon: AlertTriangle },
    { id: "custom", label: "Other", icon: MessageSquare }
  ];
  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DEFAULT_SETS_PER_EXERCISE = 3;
  const STORE_KEY = "workout-app-state-v4";
  async function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return migrateState(JSON.parse(raw));
    } catch (e) {
    }
    return null;
  }
  async function saveState(state) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("save failed", e);
    }
  }
  function migrateState(saved) {
    var _a;
    const fresh = defaultState();
    const merged = { ...fresh, ...saved };
    merged.exercises = Array.isArray(saved.exercises) ? saved.exercises : fresh.exercises;
    merged.plans = Array.isArray(saved.plans) ? saved.plans : fresh.plans;
    merged.planIterations = Array.isArray(saved.planIterations) ? saved.planIterations : [];
    merged.activeIterationId = (_a = saved.activeIterationId) != null ? _a : null;
    merged.history = Array.isArray(saved.history) ? saved.history : [];
    merged.logs = Array.isArray(saved.logs) ? saved.logs : [];
    merged.bonusStars = typeof saved.bonusStars === "number" ? saved.bonusStars : 0;
    merged.level = typeof saved.level === "number" ? saved.level : 0;
    merged.awardedIterationBonus = saved.awardedIterationBonus && typeof saved.awardedIterationBonus === "object" ? saved.awardedIterationBonus : {};
    merged.awardedWorkoutBonus = saved.awardedWorkoutBonus && typeof saved.awardedWorkoutBonus === "object" ? saved.awardedWorkoutBonus : {};
    merged.activeWorkout = saved.activeWorkout || null;
    if (merged.activeWorkout && !merged.planIterations.some((it) => it.id === merged.activeWorkout.iterationId)) {
      merged.activeWorkout = null;
    }
    if (merged.activeIterationId && !merged.planIterations.some((it) => it.id === merged.activeIterationId)) {
      merged.activeIterationId = null;
    }
    delete merged.activePlanId;
    delete merged.planVariantDefaults;
    delete merged.awardedPlanRuns;
    return merged;
  }
  function defaultState() {
    return {
      exercises: RAW_EXERCISES,
      plans: buildPlans(),
      planIterations: [],
      // independent live copies of a plan, created each time a plan is started
      activeIterationId: null,
      activeWorkout: null,
      history: [],
      logs: [],
      bonusStars: 0,
      level: 0,
      // manually purchased with bonus stars, never auto-granted
      awardedIterationBonus: {},
      // iterationId -> true, once the plan-completion star has been granted
      awardedWorkoutBonus: {}
      // "iterationId:workoutId" -> true, once that workout's bonus-exercise star has been granted
    };
  }
  function Card({ children, className = "", ...rest }) {
    return /* @__PURE__ */ React.createElement("div", { className: `card ${className}`, ...rest }, children);
  }
  function SectionTitle({ children, sub }) {
    return /* @__PURE__ */ React.createElement("div", { className: "section-title" }, /* @__PURE__ */ React.createElement("h2", null, children), sub && /* @__PURE__ */ React.createElement("p", null, sub));
  }
  const PLATE_WEIGHTS = [45, 25, 10, 5, 2.5, 1, 0.5];
  function bestPlatesForSide(target) {
    target = Math.round(target * 2) / 2;
    if (target <= 0) return [];
    const n = PLATE_WEIGHTS.length;
    const targetKey = Math.round(target * 2);
    let best = null;
    for (let mask = 1; mask < 1 << n; mask++) {
      const sizes = [];
      for (let i = 0; i < n; i++) if (mask & 1 << i) sizes.push(PLATE_WEIGHTS[i]);
      const distinct = sizes.length;
      if (best && distinct > best.distinct) continue;
      const smallest = Math.min(...sizes);
      const maxPlates = Math.round(target / smallest) + 1;
      let frontier2 = /* @__PURE__ */ new Map([[0, 0]]);
      let foundAt = null;
      for (let plates = 1; plates <= maxPlates && !foundAt; plates++) {
        const next = new Map(frontier2);
        for (const [sum, cnt] of frontier2) {
          if (cnt !== plates - 1) continue;
          for (const w of sizes) {
            const newSum = sum + Math.round(w * 2);
            if (newSum > targetKey) continue;
            if (!next.has(newSum) || next.get(newSum) > plates) next.set(newSum, plates);
          }
        }
        frontier2 = next;
        if (frontier2.get(targetKey) === plates) foundAt = plates;
      }
      if (foundAt == null) continue;
      if (!best || distinct < best.distinct || distinct === best.distinct && foundAt < best.count) {
        best = { distinct, count: foundAt, sizes };
      }
    }
    if (!best) return [];
    let frontier = /* @__PURE__ */ new Map([[0, []]]);
    for (let plates = 1; plates <= best.count; plates++) {
      const next = /* @__PURE__ */ new Map();
      for (const [sum, combo] of frontier) {
        for (const w of best.sizes) {
          const newSum = sum + Math.round(w * 2);
          if (newSum > targetKey) continue;
          if (!next.has(newSum)) next.set(newSum, [...combo, w]);
        }
      }
      frontier = next;
      if (frontier.has(targetKey) && frontier.get(targetKey).length === plates) break;
    }
    return (frontier.get(targetKey) || []).sort((a, b) => b - a);
  }
  function levelUpCost(currentLevel) {
    return Math.min(currentLevel + 1, 20);
  }
  function LevelDumbbell({ level, size = 96 }) {
    const plates = bestPlatesForSide(level / 2);
    const barLength = 60;
    const centerX = size / 2;
    const centerY = size / 2;
    const plateGap = 3;
    let offset = 10;
    const renderedPlates = plates.map((w, i) => {
      const heightForWeight = 14 + Math.min(w, 45) * 0.5;
      const thickness = 5 + Math.min(w, 10) * 0.3;
      const x = offset;
      offset += thickness + plateGap;
      return { w, x, height: heightForWeight, thickness };
    });
    const maxOffset = offset;
    return /* @__PURE__ */ React.createElement("div", { className: "level-dumbbell", style: { width: size, height: size } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size }, /* @__PURE__ */ React.createElement("rect", { x: centerX - barLength / 2, y: centerY - 3, width: barLength, height: "6", rx: "3", fill: "#8f8a80" }), renderedPlates.map((p, i) => /* @__PURE__ */ React.createElement("g", { key: `l${i}` }, /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: centerX - barLength / 2 - p.x - p.thickness,
        y: centerY - p.height / 2,
        width: p.thickness,
        height: p.height,
        rx: "2",
        fill: "var(--accent)",
        stroke: "var(--accent-dim)",
        strokeWidth: "1"
      }
    ), /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: centerX + barLength / 2 + p.x,
        y: centerY - p.height / 2,
        width: p.thickness,
        height: p.height,
        rx: "2",
        fill: "var(--accent)",
        stroke: "var(--accent-dim)",
        strokeWidth: "1"
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "level-dumbbell-label" }, "Lvl ", level));
  }
  function fmtDuration(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}m ${s}s`;
  }
  function fmtLongDuration(sec) {
    const totalHours = Math.floor(sec / 3600);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const parts = [];
    if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
    parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
    return parts.join(" ");
  }
  function fmtAdaptiveDuration(sec) {
    sec = Math.round(sec);
    if (sec >= 3600) {
      const h = Math.floor(sec / 3600);
      const m = Math.round(sec % 3600 / 60);
      return `${h}h ${m}m`;
    }
    if (sec >= 60) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}m ${s}s`;
    }
    return `${sec}s`;
  }
  function exResultWeight(e) {
    return (e.weight || 0) * (e.reps || 0) * (e.sets || DEFAULT_SETS_PER_EXERCISE);
  }
  function exResultReps(e) {
    return (e.reps || 0) * (e.sets || DEFAULT_SETS_PER_EXERCISE);
  }
  function sessionTotalWeight(record) {
    return (record.exercises || []).reduce((sum, e) => sum + exResultWeight(e), 0);
  }
  function sessionTotalReps(record) {
    return (record.exercises || []).reduce((sum, e) => sum + exResultReps(e), 0);
  }
  function fmtDateTime(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" })} \xB7 ${d.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" })}`;
  }
  function derivePlanGroups(state) {
    const byPlanName = {};
    state.planIterations.forEach((iter) => {
      if (!byPlanName[iter.planName]) byPlanName[iter.planName] = [];
      byPlanName[iter.planName].push(iter);
    });
    const groups = Object.entries(byPlanName).map(([planName, iterations]) => {
      const sortedIterations = [...iterations].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
      const buildRunSummary = (iter) => {
        var _a, _b;
        const records = state.history.filter((h) => h.iterationId === iter.id);
        const completedRecords = records.filter((r) => r.status === "completed");
        const skippedRecords = records.filter((r) => r.status === "skipped");
        const totalDurationSec = completedRecords.reduce((sum, r) => sum + (r.durationSec || 0), 0);
        const totalWeight = completedRecords.reduce((sum, r) => sum + sessionTotalWeight(r), 0);
        const totalReps = completedRecords.reduce((sum, r) => sum + sessionTotalReps(r), 0);
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        const startDate = ((_a = sorted[0]) == null ? void 0 : _a.date) || iter.startedAt;
        const endDate = (_b = sorted[sorted.length - 1]) == null ? void 0 : _b.date;
        const isResolved = (sessId) => records.some((h) => h.sessionId === sessId && (h.status === "completed" || h.status === "skipped"));
        const isComplete = iter.workouts.length > 0 && iter.workouts.every(
          (w) => w.sessions.length > 0 && w.sessions.every((sess) => isResolved(sess.id))
        );
        const workouts = iter.workouts.map((w) => ({
          workoutId: w.id,
          workoutName: w.name,
          sessions: w.sessions.map((sess) => {
            const rec = records.find((r) => r.sessionId === sess.id);
            return rec ? rec : { id: uid("pending"), sessionId: sess.id, sessionName: sess.name, status: "pending" };
          })
        }));
        return {
          id: iter.id,
          isPartial: !isComplete,
          startDate,
          endDate,
          totalDurationSec,
          totalWeight,
          totalReps,
          completedCount: completedRecords.length,
          skippedCount: skippedRecords.length,
          workouts
        };
      };
      const runSummaries = sortedIterations.map(buildRunSummary);
      const fullyCompletedRuns = runSummaries.filter((r) => !r.isPartial);
      const avgDuration = fullyCompletedRuns.length ? fullyCompletedRuns.reduce((sum, r) => sum + r.totalDurationSec, 0) / fullyCompletedRuns.length : 0;
      const totalWeightAcrossRuns = runSummaries.reduce((sum, r) => sum + r.totalWeight, 0);
      const totalRepsAcrossRuns = runSummaries.reduce((sum, r) => sum + r.totalReps, 0);
      return {
        planName,
        timesCompleted: fullyCompletedRuns.length,
        avgDurationSec: avgDuration,
        totalWeight: totalWeightAcrossRuns,
        totalReps: totalRepsAcrossRuns,
        runs: runSummaries
      };
    });
    return groups.sort((a, b) => b.timesCompleted - a.timesCompleted);
  }
  function WorkoutsView({ state, setState, onViewPlanHistory }) {
    const exMap = useMemo(() => Object.fromEntries(state.exercises.map((e) => [e.id, e])), [state.exercises]);
    const active = state.activeWorkout;
    const [pendingPlanId, setPendingPlanId] = useState(null);
    const [pendingDefaultVariant, setPendingDefaultVariant] = useState("v_balancing");
    const [focusedWorkoutId, setFocusedWorkoutId] = useState(null);
    const [focusedSessionId, setFocusedSessionId] = useState(null);
    const [selection, setSelection] = useState({});
    const [includedBonus, setIncludedBonus] = useState(null);
    const [skipTarget, setSkipTarget] = useState(false);
    const [skipNote, setSkipNote] = useState("");
    const sessionCompletedCount = (sessId) => state.history.filter((h) => h.status === "completed" && h.sessionId === sessId).length;
    const sessionSkippedCount = (sessId) => state.history.filter((h) => h.status === "skipped" && h.sessionId === sessId).length;
    const isSessionResolved = (sessId) => sessionCompletedCount(sessId) > 0 || sessionSkippedCount(sessId) > 0;
    const isWorkoutComplete = (w) => w.sessions.length > 0 && w.sessions.every((s) => isSessionResolved(s.id));
    const isIterationComplete = (iter) => iter.workouts.length > 0 && iter.workouts.every((w) => isWorkoutComplete(w));
    const hasCompletedIteration = (planId) => state.planIterations.some((iter) => iter.planId === planId && isIterationComplete(iter));
    const activeIteration = state.planIterations.find((it) => it.id === state.activeIterationId) || null;
    const focusedWorkout = (activeIteration == null ? void 0 : activeIteration.workouts.find((w) => w.id === focusedWorkoutId)) || null;
    const focusedSession = (focusedWorkout == null ? void 0 : focusedWorkout.sessions.find((s) => s.id === focusedSessionId)) || null;
    useEffect(() => {
      if (!focusedSession || !activeIteration) return;
      const planDefaultLabel = activeIteration.defaultVariantId === "v_building" ? "Building" : "Balancing";
      const m = {};
      focusedSession.exercises.forEach((inst) => {
        var _a;
        const ex = exMap[inst.exId];
        const matching = ex == null ? void 0 : ex.variants.find((v) => v.label === planDefaultLabel);
        const fallback = (ex == null ? void 0 : ex.variants.find((v) => v.default)) || (ex == null ? void 0 : ex.variants[0]);
        m[inst.instId] = (_a = matching || fallback) == null ? void 0 : _a.id;
      });
      setSelection(m);
      setIncludedBonus(null);
    }, [focusedSessionId, activeIteration == null ? void 0 : activeIteration.id]);
    if (active) {
      return /* @__PURE__ */ React.createElement(ActiveSessionView, { state, setState, exMap });
    }
    const startPlan = () => {
      const plan = state.plans.find((p) => p.id === pendingPlanId);
      if (!plan) return;
      const iteration = createPlanIteration(plan, pendingDefaultVariant);
      setState((s) => ({
        ...s,
        planIterations: [...s.planIterations, iteration],
        activeIterationId: iteration.id
      }));
      setPendingPlanId(null);
    };
    const startSession = () => {
      var _a, _b;
      if (!focusedSession || !focusedWorkout || !activeIteration) return;
      const exIds = focusedSession.exercises.map((inst) => ({
        instId: inst.instId,
        exId: inst.exId,
        variantId: selection[inst.instId]
      }));
      if (includedBonus) {
        const bonusDefaultVariant = (_b = (_a = exMap[includedBonus]) == null ? void 0 : _a.variants.find((v) => v.default)) == null ? void 0 : _b.id;
        exIds.push({ instId: uid("instbonus"), exId: includedBonus, variantId: bonusDefaultVariant, isBonus: true });
      }
      setState((s) => ({
        ...s,
        activeWorkout: {
          iterationId: activeIteration.id,
          planId: activeIteration.planId,
          planName: activeIteration.planName,
          workoutId: focusedWorkout.id,
          workoutName: focusedWorkout.name,
          sessionId: focusedSession.id,
          sessionName: focusedSession.name,
          startedAt: Date.now(),
          exIds,
          bonusExId: includedBonus
        }
      }));
    };
    const skipSession = (reasonId, note) => {
      if (!focusedSession || !focusedWorkout || !activeIteration) return;
      const record = {
        id: uid("w"),
        date: (/* @__PURE__ */ new Date()).toISOString(),
        iterationId: activeIteration.id,
        planId: activeIteration.planId,
        planName: activeIteration.planName,
        workoutId: focusedWorkout.id,
        workoutName: focusedWorkout.name,
        sessionId: focusedSession.id,
        sessionName: focusedSession.name,
        status: "skipped",
        skipReason: reasonId,
        skipNote: note || ""
      };
      setState((s) => {
        const newHistory = [record, ...s.history];
        const isResolvedAfter = (sessId) => newHistory.some((h) => h.sessionId === sessId && (h.status === "completed" || h.status === "skipped"));
        const iterNowComplete = activeIteration.workouts.length > 0 && activeIteration.workouts.every(
          (w) => w.sessions.length > 0 && w.sessions.every((sess) => isResolvedAfter(sess.id))
        );
        return {
          ...s,
          history: newHistory,
          bonusStars: s.bonusStars - 1,
          // skipping costs a star; balance can go negative
          activeIterationId: iterNowComplete ? null : s.activeIterationId
        };
      });
      setFocusedSessionId(null);
    };
    const bonusEx = focusedWorkout ? exMap[focusedWorkout.bonusExId] : null;
    const workoutBonusAlreadyDone = focusedWorkout ? state.history.some((h) => h.status === "completed" && h.workoutId === focusedWorkout.id && h.bonusExId) : false;
    if (!activeIteration) {
      return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement(SectionTitle, { sub: "Choose a plan to start" }, "Plans"), state.plans.length === 0 ? /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(Target, { size: 28, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("p", null, "No plans yet \u2014 create one in Craft."))) : /* @__PURE__ */ React.createElement("div", { className: "plan-pick-list" }, state.plans.map((p) => {
        const completedBefore = hasCompletedIteration(p.id);
        return /* @__PURE__ */ React.createElement(
          Card,
          {
            key: p.id,
            className: `plan-pick-card ${pendingPlanId === p.id ? "selected" : ""}`,
            onClick: () => setPendingPlanId(pendingPlanId === p.id ? null : p.id)
          },
          /* @__PURE__ */ React.createElement("div", { className: "plan-pick-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "plan-pick-name" }, p.name), /* @__PURE__ */ React.createElement("div", { className: "plan-pick-sub" }, p.workouts.length, " challenge", p.workouts.length !== 1 ? "s" : "")), completedBefore && /* @__PURE__ */ React.createElement(
            "button",
            {
              className: "badge badge-done badge-link",
              onClick: (e) => {
                e.stopPropagation();
                onViewPlanHistory && onViewPlanHistory(p.name);
              },
              title: "View completed results in History"
            },
            /* @__PURE__ */ React.createElement(Check, { size: 12 }),
            " Completed ",
            /* @__PURE__ */ React.createElement(ChevronRight, { size: 12 })
          )),
          pendingPlanId === p.id && /* @__PURE__ */ React.createElement("div", { className: "plan-pick-expand", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "variant-manager-label" }, "Default variant for this plan"), /* @__PURE__ */ React.createElement("div", { className: "variant-chip-row" }, /* @__PURE__ */ React.createElement(
            "button",
            {
              className: `variant-chip ${pendingDefaultVariant === "v_balancing" ? "active" : ""}`,
              onClick: () => setPendingDefaultVariant("v_balancing")
            },
            "Balancing"
          ), /* @__PURE__ */ React.createElement(
            "button",
            {
              className: `variant-chip ${pendingDefaultVariant === "v_building" ? "active" : ""}`,
              onClick: () => setPendingDefaultVariant("v_building")
            },
            "Building"
          )), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-block", style: { marginTop: 12 }, onClick: startPlan }, /* @__PURE__ */ React.createElement(Play, { size: 14 }), " ", completedBefore ? "Next Plan" : "Start Plan"))
        );
      })));
    }
    if (!focusedWorkout) {
      return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement(SectionTitle, { sub: activeIteration.planName }, "Challenges"), /* @__PURE__ */ React.createElement("div", { className: "workout-pick-list" }, activeIteration.workouts.map((w) => {
        const complete = isWorkoutComplete(w);
        const doneCount = w.sessions.filter((s) => isSessionResolved(s.id)).length;
        return /* @__PURE__ */ React.createElement(Card, { key: w.id, className: "workout-pick-card", onClick: () => setFocusedWorkoutId(w.id) }, /* @__PURE__ */ React.createElement("div", { className: "plan-pick-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "plan-pick-name" }, w.name), /* @__PURE__ */ React.createElement("div", { className: "plan-pick-sub" }, doneCount, "/", w.sessions.length, " workouts done")), complete ? /* @__PURE__ */ React.createElement("div", { className: "badge badge-done" }, /* @__PURE__ */ React.createElement(Check, { size: 12 }), " Completed") : /* @__PURE__ */ React.createElement(ChevronRight, { size: 18, className: "chevron-affordance" })));
      }), activeIteration.workouts.length === 0 && /* @__PURE__ */ React.createElement("span", { className: "empty-inline" }, "No challenges in this plan yet.")));
    }
    if (!focusedSession) {
      const workoutComplete = isWorkoutComplete(focusedWorkout);
      return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement("button", { className: "back-link", onClick: () => setFocusedWorkoutId(null) }, /* @__PURE__ */ React.createElement(ChevronLeft, { size: 14 }), " ", activeIteration.planName), /* @__PURE__ */ React.createElement(SectionTitle, { sub: workoutComplete ? "Completed" : "Choose a session" }, focusedWorkout.name), /* @__PURE__ */ React.createElement("div", { className: "workout-pick-list" }, focusedWorkout.sessions.map((s) => {
        const resolved = isSessionResolved(s.id);
        const wasSkipped = sessionSkippedCount(s.id) > 0 && sessionCompletedCount(s.id) === 0;
        return /* @__PURE__ */ React.createElement(Card, { key: s.id, className: "workout-pick-card", onClick: () => setFocusedSessionId(s.id) }, /* @__PURE__ */ React.createElement("div", { className: "plan-pick-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "plan-pick-name" }, s.name), /* @__PURE__ */ React.createElement("div", { className: "plan-pick-sub" }, s.exercises.length, " exercise", s.exercises.length !== 1 ? "s" : "")), resolved ? /* @__PURE__ */ React.createElement("div", { className: `badge ${wasSkipped ? "badge-skipped" : "badge-done"}` }, wasSkipped ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(X, { size: 12 }), " Skipped") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Check, { size: 12 }), " Completed")) : /* @__PURE__ */ React.createElement(ChevronRight, { size: 18, className: "chevron-affordance" })));
      }), focusedWorkout.sessions.length === 0 && /* @__PURE__ */ React.createElement("span", { className: "empty-inline" }, "No workouts in this challenge yet.")));
    }
    const sessionResolved = isSessionResolved(focusedSession.id);
    return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement("button", { className: "back-link", onClick: () => setFocusedSessionId(null) }, /* @__PURE__ */ React.createElement(ChevronLeft, { size: 14 }), " ", focusedWorkout.name), sessionResolved ? (() => {
      const record = state.history.find((h) => h.sessionId === focusedSession.id);
      if (!record) return null;
      if (record.status === "skipped") {
        return /* @__PURE__ */ React.createElement(Card, { className: "setup-card" }, /* @__PURE__ */ React.createElement("div", { className: "results-header" }, /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, activeIteration.planName, " \xB7 ", focusedWorkout.name, " \xB7 ", focusedSession.name), /* @__PURE__ */ React.createElement("h3", null, "Skipped")), /* @__PURE__ */ React.createElement("div", { className: "results-skip-note" }, record.skipReason, record.skipNote ? ` \u2014 ${record.skipNote}` : ""));
      }
      const totalWeight = sessionTotalWeight(record);
      const totalReps = sessionTotalReps(record);
      return /* @__PURE__ */ React.createElement(Card, { className: "setup-card" }, /* @__PURE__ */ React.createElement("div", { className: "results-header" }, /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, activeIteration.planName, " \xB7 ", focusedWorkout.name, " \xB7 ", focusedSession.name), /* @__PURE__ */ React.createElement("h3", null, "Workout Results")), /* @__PURE__ */ React.createElement("div", { className: "results-summary-row" }, /* @__PURE__ */ React.createElement("div", { className: "results-summary-stat" }, /* @__PURE__ */ React.createElement("div", { className: "results-summary-num" }, fmtDuration(record.durationSec)), /* @__PURE__ */ React.createElement("div", { className: "results-summary-label" }, "Time")), /* @__PURE__ */ React.createElement("div", { className: "results-summary-stat" }, /* @__PURE__ */ React.createElement("div", { className: "results-summary-num accent" }, totalWeight.toLocaleString(), " lb"), /* @__PURE__ */ React.createElement("div", { className: "results-summary-label" }, "Total Weight")), /* @__PURE__ */ React.createElement("div", { className: "results-summary-stat" }, /* @__PURE__ */ React.createElement("div", { className: "results-summary-num accent" }, totalReps.toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "results-summary-label" }, "Total Reps"))), /* @__PURE__ */ React.createElement("div", { className: "results-exercise-list" }, (record.exercises || []).map((e) => /* @__PURE__ */ React.createElement("div", { key: e.instId, className: "results-exercise-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "exercise-row-name" }, e.name, " ", e.isBonus && /* @__PURE__ */ React.createElement("span", { className: "bonus-tag" }, "Bonus")), /* @__PURE__ */ React.createElement("div", { className: "exercise-row-req" }, e.requirement, " \xB7 ", e.sets || DEFAULT_SETS_PER_EXERCISE, " sets \xB7 ", e.weight, " lb/set")), /* @__PURE__ */ React.createElement("div", { className: "exercise-target" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-target-num" }, e.reps, " reps/set \xB7 ", e.weight, " lb"), /* @__PURE__ */ React.createElement("div", { className: "exercise-target-total" }, exResultWeight(e).toLocaleString(), " lb \xB7 ", exResultReps(e), " reps"))))));
    })() : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionTitle, { sub: `${activeIteration.planName} \xB7 ${focusedWorkout.name} \xB7 ${activeIteration.setsPerExercise || DEFAULT_SETS_PER_EXERCISE} sets per exercise` }, focusedSession.name), /* @__PURE__ */ React.createElement(Card, { className: "setup-card" }, focusedSession.exercises.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement("p", null, "No exercises in this workout yet. Add some in Craft.")) : /* @__PURE__ */ React.createElement("div", { className: "setup-exercise-list" }, focusedSession.exercises.map((inst) => {
      const ex = exMap[inst.exId];
      if (!ex) return null;
      const chosenVariantId = selection[inst.instId];
      return /* @__PURE__ */ React.createElement("div", { key: inst.instId, className: "setup-exercise-row" }, /* @__PURE__ */ React.createElement("div", { className: "setup-exercise-info" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-row-name" }, ex.name), /* @__PURE__ */ React.createElement("div", { className: "exercise-row-req" }, ex.requirement)), /* @__PURE__ */ React.createElement("div", { className: "variant-chip-row" }, ex.variants.map((v) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: v.id,
          className: `variant-chip ${chosenVariantId === v.id ? "active" : ""}`,
          onClick: () => setSelection((s) => ({ ...s, [inst.instId]: v.id })),
          title: v.label
        },
        v.label,
        ": ",
        v.reps,
        "r \xB7 ",
        v.weight,
        "lb"
      ))));
    })), bonusEx && !workoutBonusAlreadyDone && /* @__PURE__ */ React.createElement("div", { className: "bonus-toggle-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "exercise-row-name" }, bonusEx.name, " ", /* @__PURE__ */ React.createElement("span", { className: "bonus-tag" }, "Bonus")), /* @__PURE__ */ React.createElement("div", { className: "exercise-row-req" }, bonusEx.requirement)), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `btn ${includedBonus === bonusEx.id ? "btn-primary" : "btn-ghost"}`,
        onClick: () => setIncludedBonus(includedBonus === bonusEx.id ? null : bonusEx.id)
      },
      includedBonus === bonusEx.id ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Check, { size: 14 }), " Added") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Plus, { size: 14 }), " Add")
    ))), /* @__PURE__ */ React.createElement("div", { className: "sticky-actions static-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", onClick: () => setSkipTarget(true) }, /* @__PURE__ */ React.createElement(X, { size: 16 }), " Skip"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", disabled: focusedSession.exercises.length === 0, onClick: startSession }, /* @__PURE__ */ React.createElement(Play, { size: 16 }), " Start Workout"))), skipTarget && focusedSession && /* @__PURE__ */ React.createElement("div", { className: "modal-backdrop", onClick: () => setSkipTarget(false) }, /* @__PURE__ */ React.createElement("div", { className: "modal", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("h3", null, "Skip ", focusedSession.name, "?"), /* @__PURE__ */ React.createElement("p", { className: "modal-sub" }, "Choose a reason:"), /* @__PURE__ */ React.createElement("div", { className: "skip-reasons" }, SKIP_REASONS.map((r) => /* @__PURE__ */ React.createElement("button", { key: r.id, className: "skip-reason-btn", onClick: () => {
      if (r.id === "custom" && !skipNote) return;
      skipSession(r.id, skipNote);
      setSkipTarget(false);
      setSkipNote("");
    } }, /* @__PURE__ */ React.createElement(r.icon, { size: 18 }), /* @__PURE__ */ React.createElement("span", null, r.label)))), /* @__PURE__ */ React.createElement("input", { className: "text-input", placeholder: "Optional note...", value: skipNote, onChange: (e) => setSkipNote(e.target.value) }), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block", onClick: () => setSkipTarget(false) }, "Cancel"))));
  }
  function ActiveSessionView({ state, setState, exMap }) {
    const active = state.activeWorkout;
    const [, forceTick] = useState(0);
    const [confirmingCancel, setConfirmingCancel] = useState(false);
    useEffect(() => {
      const t = setInterval(() => forceTick((n) => n + 1), 1e3);
      return () => clearInterval(t);
    }, []);
    const elapsedSec = Math.floor((Date.now() - active.startedAt) / 1e3);
    const cancelSession = () => {
      setState((s) => ({ ...s, activeWorkout: null }));
    };
    const finishWorkout = () => {
      const durationSec = Math.floor((Date.now() - active.startedAt) / 1e3);
      const iteration = state.planIterations.find((it) => it.id === active.iterationId);
      const sets = (iteration == null ? void 0 : iteration.setsPerExercise) || DEFAULT_SETS_PER_EXERCISE;
      const exerciseResults = active.exIds.map((inst) => {
        var _a, _b;
        const ex = exMap[inst.exId];
        const variant = (ex == null ? void 0 : ex.variants.find((v) => v.id === inst.variantId)) || (ex == null ? void 0 : ex.variants[0]);
        return {
          instId: inst.instId,
          exId: inst.exId,
          name: ex == null ? void 0 : ex.name,
          requirement: ex == null ? void 0 : ex.requirement,
          variantLabel: variant == null ? void 0 : variant.label,
          reps: (_a = variant == null ? void 0 : variant.reps) != null ? _a : 0,
          weight: (_b = variant == null ? void 0 : variant.weight) != null ? _b : 0,
          sets,
          isBonus: !!inst.isBonus
        };
      });
      const now = /* @__PURE__ */ new Date();
      const record = {
        id: uid("w"),
        date: now.toISOString(),
        weekday: WEEKDAYS[now.getDay()],
        iterationId: active.iterationId,
        planId: active.planId,
        planName: active.planName,
        workoutId: active.workoutId,
        workoutName: active.workoutName,
        sessionId: active.sessionId,
        sessionName: active.sessionName,
        status: "completed",
        durationSec,
        exercises: exerciseResults,
        bonusExId: active.bonusExId || null
      };
      setState((s) => {
        let bonusStars = s.bonusStars;
        const awardedIterationBonus = { ...s.awardedIterationBonus };
        const awardedWorkoutBonus = { ...s.awardedWorkoutBonus };
        const iter = s.planIterations.find((it) => it.id === active.iterationId);
        const newHistory = [record, ...s.history];
        let activeIterationId = s.activeIterationId;
        if (iter) {
          const isResolved = (sessId) => newHistory.some((h) => h.sessionId === sessId && (h.status === "completed" || h.status === "skipped"));
          const iterNowComplete = iter.workouts.length > 0 && iter.workouts.every(
            (w) => w.sessions.length > 0 && w.sessions.every((sess) => isResolved(sess.id))
          );
          if (iterNowComplete) {
            if (!awardedIterationBonus[iter.id]) {
              bonusStars += 1;
              awardedIterationBonus[iter.id] = true;
            }
            const iterHistory = newHistory.filter((h) => h.status === "completed" && h.iterationId === iter.id);
            const workoutHasBonusDone = {};
            iterHistory.forEach((h) => {
              if (h.bonusExId && h.workoutId) workoutHasBonusDone[h.workoutId] = true;
            });
            iter.workouts.forEach((w) => {
              const key = `${iter.id}:${w.id}`;
              if (workoutHasBonusDone[w.id] && !awardedWorkoutBonus[key]) {
                bonusStars += 1;
                awardedWorkoutBonus[key] = true;
              }
            });
            if (s.activeIterationId === iter.id) activeIterationId = null;
          }
        }
        return {
          ...s,
          history: newHistory,
          activeWorkout: null,
          bonusStars,
          awardedIterationBonus,
          awardedWorkoutBonus,
          activeIterationId
        };
      });
    };
    return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement("div", { className: "active-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, active.planName, " \xB7 ", active.workoutName, " \xB7 ", active.sessionName), /* @__PURE__ */ React.createElement("h2", null, "In Progress"), /* @__PURE__ */ React.createElement("div", { className: "timer-display" }, /* @__PURE__ */ React.createElement(Clock, { size: 14 }), " ", fmtDuration(elapsedSec)))), /* @__PURE__ */ React.createElement("div", { className: "exercise-log-list" }, active.exIds.map((inst) => {
      const ex = exMap[inst.exId];
      if (!ex) return null;
      const variant = ex.variants.find((v) => v.id === inst.variantId) || ex.variants[0];
      return /* @__PURE__ */ React.createElement(Card, { key: inst.instId, className: "exercise-row readonly static-row" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-row-main" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-row-name" }, ex.name, " ", inst.isBonus && /* @__PURE__ */ React.createElement("span", { className: "bonus-tag" }, "Bonus")), /* @__PURE__ */ React.createElement("div", { className: "exercise-row-req" }, ex.requirement)), /* @__PURE__ */ React.createElement("div", { className: "exercise-target" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-target-num" }, variant == null ? void 0 : variant.reps, " reps"), /* @__PURE__ */ React.createElement("div", { className: "exercise-target-num accent" }, variant == null ? void 0 : variant.weight, " lb")));
    })), /* @__PURE__ */ React.createElement("div", { className: "sticky-actions-spacer" }), /* @__PURE__ */ React.createElement("div", { className: "sticky-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", onClick: () => setConfirmingCancel(true) }, /* @__PURE__ */ React.createElement(X, { size: 16 }), " Cancel"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: finishWorkout }, /* @__PURE__ */ React.createElement(Check, { size: 16 }), " Finish Workout")), confirmingCancel && /* @__PURE__ */ React.createElement("div", { className: "modal-backdrop", onClick: () => setConfirmingCancel(false) }, /* @__PURE__ */ React.createElement("div", { className: "modal", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("h3", null, "Cancel this workout?"), /* @__PURE__ */ React.createElement("p", { className: "modal-sub" }, "Nothing will be saved."), /* @__PURE__ */ React.createElement("div", { className: "confirm-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block", onClick: () => setConfirmingCancel(false) }, "Keep Going"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-block danger-solid", onClick: cancelSession }, /* @__PURE__ */ React.createElement(X, { size: 14 }), " Cancel Workout")))));
  }
  function PlanView({ state, setState }) {
    const [tab, setTab] = useState("schedule");
    const [editingEx, setEditingEx] = useState(null);
    const [addingToSession, setAddingToSession] = useState(null);
    const [expandedPlans, setExpandedPlans] = useState(() => new Set(state.plans[0] ? [state.plans[0].id] : []));
    const [expandedWorkouts, setExpandedWorkouts] = useState(() => /* @__PURE__ */ new Set());
    const toggleExpandedPlan = (id) => setExpandedPlans((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    const toggleExpandedWorkout = (id) => setExpandedWorkouts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    const [renaming, setRenaming] = useState(null);
    const [renameValue, setRenameValue] = useState("");
    const [pendingConfirm, setPendingConfirm] = useState(null);
    const [creatingPlan, setCreatingPlan] = useState(false);
    const [newPlanSets, setNewPlanSets] = useState(DEFAULT_SETS_PER_EXERCISE);
    const askConfirm = (message, onConfirm) => setPendingConfirm({ message, onConfirm });
    const exMap = useMemo(() => Object.fromEntries(state.exercises.map((e) => [e.id, e])), [state.exercises]);
    const addPlan = () => {
      const sets = Math.max(1, Number(newPlanSets) || DEFAULT_SETS_PER_EXERCISE);
      setState((s) => ({ ...s, plans: [...s.plans, { id: nextPlanId(), name: `Plan ${s.plans.length + 1}`, setsPerExercise: sets, workouts: [] }] }));
      setCreatingPlan(false);
      setNewPlanSets(DEFAULT_SETS_PER_EXERCISE);
    };
    const updatePlanSets = (planId, sets) => {
      setState((s) => ({ ...s, plans: s.plans.map((p) => p.id === planId ? { ...p, setsPerExercise: Math.max(1, Number(sets) || 1) } : p) }));
    };
    const restoreDefaultPlan = () => {
      askConfirm("Add back the default Weekly Rotation plan (Arms, Legs, Core, Arms II, Legs II, Core II)? Your history and notes are kept.", () => {
        setState((s) => ({ ...s, plans: [...s.plans, { id: nextPlanId(), name: "Weekly Rotation", setsPerExercise: DEFAULT_SETS_PER_EXERCISE, workouts: buildWorkouts() }] }));
      });
    };
    const removePlan = (planId) => {
      askConfirm("Delete this plan and all its challenges?", () => {
        setState((s) => ({ ...s, plans: s.plans.filter((p) => p.id !== planId) }));
      });
    };
    const renamePlan = (planId, name) => {
      setState((s) => ({ ...s, plans: s.plans.map((p) => p.id === planId ? { ...p, name } : p) }));
    };
    const addWorkout = (planId) => {
      setState((s) => ({
        ...s,
        plans: s.plans.map(
          (p) => p.id === planId ? { ...p, workouts: [...p.workouts, { id: nextWorkoutId(), name: `Challenge ${p.workouts.length + 1}`, bonusExId: null, sessions: [] }] } : p
        )
      }));
    };
    const removeWorkout = (planId, workoutId) => {
      askConfirm("Delete this challenge and its workouts?", () => {
        setState((s) => ({
          ...s,
          plans: s.plans.map((p) => p.id === planId ? { ...p, workouts: p.workouts.filter((w) => w.id !== workoutId) } : p)
        }));
      });
    };
    const renameWorkout = (planId, workoutId, name) => {
      setState((s) => ({
        ...s,
        plans: s.plans.map(
          (p) => p.id === planId ? { ...p, workouts: p.workouts.map((w) => w.id === workoutId ? { ...w, name } : w) } : p
        )
      }));
    };
    const setWorkoutBonus = (planId, workoutId, exId) => {
      setState((s) => ({
        ...s,
        plans: s.plans.map(
          (p) => p.id === planId ? { ...p, workouts: p.workouts.map((w) => w.id === workoutId ? { ...w, bonusExId: exId } : w) } : p
        )
      }));
    };
    const addSession = (planId, workoutId) => {
      setState((s) => ({
        ...s,
        plans: s.plans.map(
          (p) => p.id === planId ? {
            ...p,
            workouts: p.workouts.map(
              (w) => w.id === workoutId ? { ...w, sessions: [...w.sessions, { id: nextSessId(), name: `Workout ${w.sessions.length + 1}`, exercises: [] }] } : w
            )
          } : p
        )
      }));
    };
    const removeSession = (planId, workoutId, sessionId) => {
      askConfirm("Remove this workout and its exercise list?", () => {
        setState((s) => ({
          ...s,
          plans: s.plans.map(
            (p) => p.id === planId ? { ...p, workouts: p.workouts.map((w) => w.id === workoutId ? { ...w, sessions: w.sessions.filter((sess) => sess.id !== sessionId) } : w) } : p
          )
        }));
      });
    };
    const renameSession = (planId, workoutId, sessionId, name) => {
      setState((s) => ({
        ...s,
        plans: s.plans.map(
          (p) => p.id === planId ? { ...p, workouts: p.workouts.map((w) => w.id === workoutId ? { ...w, sessions: w.sessions.map((sess) => sess.id === sessionId ? { ...sess, name } : sess) } : w) } : p
        )
      }));
    };
    const removeFromSession = (planId, workoutId, sessionId, instId) => {
      setState((s) => ({
        ...s,
        plans: s.plans.map(
          (p) => p.id === planId ? {
            ...p,
            workouts: p.workouts.map(
              (w) => w.id === workoutId ? { ...w, sessions: w.sessions.map((sess) => sess.id === sessionId ? { ...sess, exercises: sess.exercises.filter((x) => x.instId !== instId) } : sess) } : w
            )
          } : p
        )
      }));
    };
    const addToSession = (planId, workoutId, sessionId, exId) => {
      setState((s) => ({
        ...s,
        plans: s.plans.map(
          (p) => p.id === planId ? {
            ...p,
            workouts: p.workouts.map(
              (w) => w.id === workoutId ? { ...w, sessions: w.sessions.map((sess) => sess.id === sessionId ? { ...sess, exercises: [...sess.exercises, { instId: nextInstId(), exId }] } : sess) } : w
            )
          } : p
        )
      }));
    };
    const updateExercise = (id, patch) => {
      setState((s) => ({ ...s, exercises: s.exercises.map((e) => e.id === id ? { ...e, ...patch } : e) }));
    };
    const updateVariant = (exId, variantId, patch) => {
      setState((s) => ({
        ...s,
        exercises: s.exercises.map(
          (e) => e.id === exId ? { ...e, variants: e.variants.map((v) => v.id === variantId ? { ...v, ...patch } : v) } : e
        )
      }));
    };
    const setDefaultVariant = (exId, variantId) => {
      setState((s) => ({
        ...s,
        exercises: s.exercises.map(
          (e) => e.id === exId ? { ...e, variants: e.variants.map((v) => ({ ...v, default: v.id === variantId })) } : e
        )
      }));
    };
    const addExercise = () => {
      const newEx = { id: uid("exc"), name: "New Exercise", requirement: "None", isBonus: false, variants: mkVariants(10, 10, 13, 15) };
      setState((s) => ({ ...s, exercises: [...s.exercises, newEx] }));
      setEditingEx(newEx.id);
    };
    const toggleBonus = (id) => {
      setState((s) => ({ ...s, exercises: s.exercises.map((e) => e.id === id ? { ...e, isBonus: !e.isBonus } : e) }));
    };
    const deleteExercise = (id) => {
      askConfirm("Delete this exercise? It will be removed from all workouts.", () => {
        setState((s) => ({
          ...s,
          exercises: s.exercises.filter((e) => e.id !== id),
          plans: s.plans.map((p) => ({
            ...p,
            workouts: p.workouts.map((w) => ({
              ...w,
              bonusExId: w.bonusExId === id ? null : w.bonusExId,
              sessions: w.sessions.map((sess) => ({ ...sess, exercises: sess.exercises.filter((x) => x.exId !== id) }))
            }))
          }))
        }));
      });
    };
    return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement(SectionTitle, { sub: "Plans contain challenges; challenges contain workouts" }, "Craft"), /* @__PURE__ */ React.createElement("div", { className: "tab-row" }, /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "schedule" ? "active" : ""}`, onClick: () => setTab("schedule") }, "Plans"), /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "exercises" ? "active" : ""}`, onClick: () => setTab("exercises") }, "Exercise Manager")), tab === "schedule" && /* @__PURE__ */ React.createElement("div", { className: "schedule-grid" }, state.plans.map((plan) => {
      var _a;
      const isPlanExpanded = expandedPlans.has(plan.id);
      return /* @__PURE__ */ React.createElement(Card, { key: plan.id, className: "day-plan-card" }, /* @__PURE__ */ React.createElement("div", { className: "day-plan-header", onClick: () => toggleExpandedPlan(plan.id) }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "Plan"), (renaming == null ? void 0 : renaming.kind) === "plan" && renaming.id === plan.id ? /* @__PURE__ */ React.createElement("div", { className: "rename-row", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("input", { className: "text-input", value: renameValue, onChange: (e) => setRenameValue(e.target.value), autoFocus: true }), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => {
        renamePlan(plan.id, renameValue.trim() || plan.name);
        setRenaming(null);
      } }, /* @__PURE__ */ React.createElement(CheckIcon, { size: 14 }))) : /* @__PURE__ */ React.createElement("div", { className: "rename-row" }, /* @__PURE__ */ React.createElement("h3", null, plan.name), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: (e) => {
        e.stopPropagation();
        setRenaming({ kind: "plan", id: plan.id });
        setRenameValue(plan.name);
      } }, /* @__PURE__ */ React.createElement(Pencil, { size: 13 })), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: (e) => {
        e.stopPropagation();
        removePlan(plan.id);
      } }, /* @__PURE__ */ React.createElement(Trash2, { size: 13 })))), isPlanExpanded ? /* @__PURE__ */ React.createElement(ChevronUp, { size: 16 }) : /* @__PURE__ */ React.createElement(ChevronDown, { size: 16 })), isPlanExpanded && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "day-bonus-picker" }, /* @__PURE__ */ React.createElement("div", { className: "variant-manager-label" }, "Sets per exercise for this plan"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "text-input",
          type: "number",
          min: "1",
          value: (_a = plan.setsPerExercise) != null ? _a : DEFAULT_SETS_PER_EXERCISE,
          onChange: (e) => updatePlanSets(plan.id, e.target.value)
        }
      )), plan.workouts.map((workout) => {
        const isWorkoutExpanded = expandedWorkouts.has(workout.id);
        return /* @__PURE__ */ React.createElement("div", { key: workout.id, className: "workout-block" }, /* @__PURE__ */ React.createElement("div", { className: "workout-block-header", onClick: () => toggleExpandedWorkout(workout.id) }, (renaming == null ? void 0 : renaming.kind) === "workout" && renaming.id === workout.id ? /* @__PURE__ */ React.createElement("div", { className: "rename-row", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("input", { className: "text-input", value: renameValue, onChange: (e) => setRenameValue(e.target.value), autoFocus: true }), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => {
          renameWorkout(plan.id, workout.id, renameValue.trim() || workout.name);
          setRenaming(null);
        } }, /* @__PURE__ */ React.createElement(CheckIcon, { size: 14 }))) : /* @__PURE__ */ React.createElement("div", { className: "rename-row" }, /* @__PURE__ */ React.createElement("div", { className: "session-block-title" }, workout.name), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: (e) => {
          e.stopPropagation();
          setRenaming({ kind: "workout", id: workout.id });
          setRenameValue(workout.name);
        } }, /* @__PURE__ */ React.createElement(Pencil, { size: 12 })), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: (e) => {
          e.stopPropagation();
          removeWorkout(plan.id, workout.id);
        } }, /* @__PURE__ */ React.createElement(Trash2, { size: 12 }))), isWorkoutExpanded ? /* @__PURE__ */ React.createElement(ChevronUp, { size: 14 }) : /* @__PURE__ */ React.createElement(ChevronDown, { size: 14 })), isWorkoutExpanded && /* @__PURE__ */ React.createElement("div", { className: "workout-block-body" }, /* @__PURE__ */ React.createElement("div", { className: "day-bonus-picker" }, /* @__PURE__ */ React.createElement("div", { className: "variant-manager-label" }, "Challenge Bonus Exercise"), /* @__PURE__ */ React.createElement("select", { className: "text-input", value: workout.bonusExId || "", onChange: (e) => setWorkoutBonus(plan.id, workout.id, e.target.value || null) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "None"), state.exercises.filter((e) => e.isBonus).map((e) => /* @__PURE__ */ React.createElement("option", { key: e.id, value: e.id }, e.name)))), workout.sessions.map((sess) => /* @__PURE__ */ React.createElement("div", { key: sess.id, className: "session-block" }, /* @__PURE__ */ React.createElement("div", { className: "session-block-header" }, (renaming == null ? void 0 : renaming.kind) === "session" && renaming.id === sess.id ? /* @__PURE__ */ React.createElement("div", { className: "rename-row" }, /* @__PURE__ */ React.createElement("input", { className: "text-input", value: renameValue, onChange: (e) => setRenameValue(e.target.value), autoFocus: true }), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => {
          renameSession(plan.id, workout.id, sess.id, renameValue.trim() || sess.name);
          setRenaming(null);
        } }, /* @__PURE__ */ React.createElement(CheckIcon, { size: 14 }))) : /* @__PURE__ */ React.createElement("div", { className: "rename-row" }, /* @__PURE__ */ React.createElement("div", { className: "session-block-title small" }, sess.name), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => {
          setRenaming({ kind: "session", id: sess.id });
          setRenameValue(sess.name);
        } }, /* @__PURE__ */ React.createElement(Pencil, { size: 12 }))), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => removeSession(plan.id, workout.id, sess.id) }, /* @__PURE__ */ React.createElement(Trash2, { size: 13 }))), /* @__PURE__ */ React.createElement("ul", { className: "reorder-list" }, sess.exercises.map((inst) => {
          var _a2;
          return /* @__PURE__ */ React.createElement("li", { key: inst.instId }, /* @__PURE__ */ React.createElement("span", { className: "reorder-name" }, ((_a2 = exMap[inst.exId]) == null ? void 0 : _a2.name) || "?"), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => removeFromSession(plan.id, workout.id, sess.id, inst.instId) }, /* @__PURE__ */ React.createElement(Trash2, { size: 12 })));
        }), sess.exercises.length === 0 && /* @__PURE__ */ React.createElement("li", { className: "empty-row" }, "No exercises yet")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block btn-sm", onClick: () => setAddingToSession(addingToSession === sess.id ? null : sess.id) }, /* @__PURE__ */ React.createElement(Plus, { size: 12 }), " Add Exercise"), addingToSession === sess.id && /* @__PURE__ */ React.createElement("div", { className: "add-exercise-list" }, state.exercises.map((e) => /* @__PURE__ */ React.createElement("button", { key: e.id, className: "add-exercise-item", onClick: () => addToSession(plan.id, workout.id, sess.id, e.id) }, /* @__PURE__ */ React.createElement(Plus, { size: 12 }), " ", e.name, " ", e.isBonus && /* @__PURE__ */ React.createElement("span", { className: "bonus-tag" }, "Bonus")))))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-block btn-sm", onClick: () => addSession(plan.id, workout.id) }, /* @__PURE__ */ React.createElement(Plus, { size: 13 }), " Add Workout")));
      }), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-block btn-sm", style: { marginTop: 12 }, onClick: () => addWorkout(plan.id) }, /* @__PURE__ */ React.createElement(Plus, { size: 13 }), " Add Challenge")));
    }), creatingPlan ? /* @__PURE__ */ React.createElement(Card, { className: "new-plan-card" }, /* @__PURE__ */ React.createElement("div", { className: "variant-manager-label" }, "Sets per exercise for this plan"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "text-input",
        type: "number",
        min: "1",
        value: newPlanSets,
        onChange: (e) => setNewPlanSets(e.target.value)
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "confirm-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block", onClick: () => setCreatingPlan(false) }, "Cancel"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-block", onClick: addPlan }, /* @__PURE__ */ React.createElement(Plus, { size: 14 }), " Create Plan"))) : /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block", onClick: () => setCreatingPlan(true) }, /* @__PURE__ */ React.createElement(Plus, { size: 14 }), " Add New Plan"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block", onClick: restoreDefaultPlan }, /* @__PURE__ */ React.createElement(RotateCcw, { size: 14 }), " Restore Default Plan")), tab === "exercises" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-block", style: { marginBottom: 12 }, onClick: addExercise }, /* @__PURE__ */ React.createElement(Plus, { size: 14 }), " Add New Exercise"), /* @__PURE__ */ React.createElement("div", { className: "exercise-manage-list" }, state.exercises.map((ex) => /* @__PURE__ */ React.createElement(Card, { key: ex.id, className: "exercise-manage-row" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-manage-top", onClick: () => setEditingEx(editingEx === ex.id ? null : ex.id) }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "exercise-row-name" }, ex.name, " ", ex.isBonus && /* @__PURE__ */ React.createElement("span", { className: "bonus-tag" }, "Bonus")), /* @__PURE__ */ React.createElement("div", { className: "exercise-row-req" }, ex.requirement)), editingEx === ex.id ? /* @__PURE__ */ React.createElement(ChevronUp, { size: 16 }) : /* @__PURE__ */ React.createElement(ChevronDown, { size: 16 })), editingEx === ex.id && /* @__PURE__ */ React.createElement("div", { className: "exercise-edit-panel" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-edit-grid" }, /* @__PURE__ */ React.createElement("label", null, "Name", /* @__PURE__ */ React.createElement("input", { className: "text-input", value: ex.name, onChange: (e) => updateExercise(ex.id, { name: e.target.value }) })), /* @__PURE__ */ React.createElement("label", null, "Requirement", /* @__PURE__ */ React.createElement("input", { className: "text-input", value: ex.requirement, onChange: (e) => updateExercise(ex.id, { requirement: e.target.value }) }))), /* @__PURE__ */ React.createElement("div", { className: "bonus-designation-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "variant-manager-label", style: { marginBottom: 2 } }, "Bonus Exercise"), /* @__PURE__ */ React.createElement("div", { className: "bonus-designation-sub" }, "Bonus exercises can be assigned to a challenge and added to workouts before starting.")), /* @__PURE__ */ React.createElement("button", { className: `btn ${ex.isBonus ? "btn-primary" : "btn-ghost"} btn-sm`, onClick: () => toggleBonus(ex.id) }, ex.isBonus ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Check, { size: 13 }), " Bonus") : "Mark as Bonus")), /* @__PURE__ */ React.createElement("div", { className: "variant-manager" }, /* @__PURE__ */ React.createElement("div", { className: "variant-manager-label" }, "Weight / Rep Variants"), ex.variants.map((v) => /* @__PURE__ */ React.createElement("div", { key: v.id, className: "variant-row" }, /* @__PURE__ */ React.createElement("span", { className: "variant-fixed-label" }, v.label), /* @__PURE__ */ React.createElement("input", { className: "text-input variant-num-input", type: "number", value: v.reps, onChange: (e) => updateVariant(ex.id, v.id, { reps: Number(e.target.value) }) }), /* @__PURE__ */ React.createElement("span", { className: "variant-unit" }, "reps"), /* @__PURE__ */ React.createElement("input", { className: "text-input variant-num-input", type: "number", value: v.weight, onChange: (e) => updateVariant(ex.id, v.id, { weight: Number(e.target.value) }) }), /* @__PURE__ */ React.createElement("span", { className: "variant-unit" }, "lb"), /* @__PURE__ */ React.createElement("button", { className: `default-star ${v.default ? "active" : ""}`, onClick: () => setDefaultVariant(ex.id, v.id), title: "Set as default" }, /* @__PURE__ */ React.createElement(Star, { size: 13, fill: v.default ? "var(--gold)" : "none" }))))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-sm btn-block danger", onClick: () => deleteExercise(ex.id) }, /* @__PURE__ */ React.createElement(Trash2, { size: 13 }), " Delete Exercise")))))), pendingConfirm && /* @__PURE__ */ React.createElement("div", { className: "modal-backdrop", onClick: () => setPendingConfirm(null) }, /* @__PURE__ */ React.createElement("div", { className: "modal", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("h3", null, "Are you sure?"), /* @__PURE__ */ React.createElement("p", { className: "modal-sub" }, pendingConfirm.message), /* @__PURE__ */ React.createElement("div", { className: "confirm-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block", onClick: () => setPendingConfirm(null) }, "Cancel"), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-primary btn-block danger-solid",
        onClick: () => {
          pendingConfirm.onConfirm();
          setPendingConfirm(null);
        }
      },
      /* @__PURE__ */ React.createElement(Trash2, { size: 14 }),
      " Delete"
    )))));
  }
  function SessionsSubview({ state }) {
    const [expanded, setExpanded] = useState(null);
    const sorted = [...state.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted.length === 0 ? /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(HistoryIcon, { size: 28, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("p", null, "No workouts logged yet."))) : /* @__PURE__ */ React.createElement("div", { className: "history-list" }, sorted.map((h) => {
      const totalSets = (h.exercises || []).reduce((sum, e) => sum + (e.sets || DEFAULT_SETS_PER_EXERCISE), 0);
      return /* @__PURE__ */ React.createElement(Card, { key: h.id, className: "history-row-card" }, /* @__PURE__ */ React.createElement("div", { className: "history-row", onClick: () => h.status === "completed" && setExpanded(expanded === h.id ? null : h.id) }, /* @__PURE__ */ React.createElement("div", { className: `history-status-dot ${h.status}` }), /* @__PURE__ */ React.createElement("div", { className: "history-row-main" }, /* @__PURE__ */ React.createElement("div", { className: "history-row-title" }, h.planName, " \xB7 ", h.workoutName, " \xB7 ", h.sessionName, " ", h.status === "completed" && /* @__PURE__ */ React.createElement("span", { className: "weekday-tag" }, h.weekday)), /* @__PURE__ */ React.createElement("div", { className: "history-row-sub" }, fmtDateTime(h.date), h.status === "completed" && h.durationSec != null && /* @__PURE__ */ React.createElement(React.Fragment, null, " \xB7 ", /* @__PURE__ */ React.createElement(Clock, { size: 11, style: { display: "inline", verticalAlign: -2 } }), " ", fmtDuration(h.durationSec), " \xB7 ", totalSets, " sets"), h.status === "skipped" && /* @__PURE__ */ React.createElement(React.Fragment, null, " \xB7 Skipped (", h.skipReason, h.skipNote ? `: ${h.skipNote}` : "", ")"))), h.status === "completed" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "history-row-stat" }, /* @__PURE__ */ React.createElement("div", { className: "history-row-stat-num" }, sessionTotalWeight(h).toLocaleString(), " lb"), /* @__PURE__ */ React.createElement("div", { className: "history-row-stat-label" }, sessionTotalReps(h).toLocaleString(), " reps")), /* @__PURE__ */ React.createElement(Lock, { size: 13, className: "lock-icon" }))), expanded === h.id && h.exercises && /* @__PURE__ */ React.createElement("div", { className: "history-detail" }, h.exercises.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.instId, className: "history-detail-row" }, /* @__PURE__ */ React.createElement("span", null, e.name, " ", e.isBonus && /* @__PURE__ */ React.createElement("span", { className: "bonus-tag" }, "Bonus")), /* @__PURE__ */ React.createElement("span", { className: "mono" }, e.variantLabel, ": ", e.sets || DEFAULT_SETS_PER_EXERCISE, " sets \xD7 ", e.reps, "r/set \xD7 ", e.weight, "lb \u2192 ", exResultWeight(e).toLocaleString(), " lb \xB7 ", exResultReps(e), " reps")))));
    }));
  }
  function ChallengesSubview({ state }) {
    const stats = useMemo(() => {
      const map = {};
      state.history.forEach((h) => {
        if (!h.workoutName) return;
        if (!map[h.workoutName]) {
          map[h.workoutName] = { name: h.workoutName, timesLogged: 0, completedCount: 0, skippedCount: 0, totalDurationSec: 0, totalSets: 0, totalReps: 0, totalWeight: 0 };
        }
        const m = map[h.workoutName];
        m.timesLogged += 1;
        if (h.status === "completed") {
          m.completedCount += 1;
          m.totalDurationSec += h.durationSec || 0;
          m.totalWeight += sessionTotalWeight(h);
          m.totalReps += sessionTotalReps(h);
          m.totalSets += (h.exercises || []).reduce((sum, e) => sum + (e.sets || DEFAULT_SETS_PER_EXERCISE), 0);
        } else if (h.status === "skipped") {
          m.skippedCount += 1;
        }
      });
      return Object.values(map).sort((a, b) => b.totalWeight - a.totalWeight);
    }, [state.history]);
    if (stats.length === 0) {
      return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(Settings, { size: 28, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("p", null, "No challenge activity yet.")));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-list" }, stats.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.name, className: "exercise-stats-row" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-name" }, s.name), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-grid" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, s.completedCount), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Workouts done")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, s.skippedCount), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Skipped")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, s.totalSets.toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Total sets")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, s.totalReps.toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Total reps")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num accent" }, s.totalWeight.toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Total Weight (lb)"))))));
  }
  function ExercisesSubview({ state }) {
    const exMap = useMemo(() => Object.fromEntries(state.exercises.map((e) => [e.id, e])), [state.exercises]);
    const stats = useMemo(() => {
      const map = {};
      state.history.forEach((h) => {
        if (h.status !== "completed") return;
        (h.exercises || []).forEach((e) => {
          if (!map[e.exId]) map[e.exId] = { exId: e.exId, name: e.name, timesPerformed: 0, totalSets: 0, totalReps: 0, totalWeight: 0, weightPerSetSum: 0 };
          const sets = e.sets || DEFAULT_SETS_PER_EXERCISE;
          map[e.exId].timesPerformed += 1;
          map[e.exId].totalSets += sets;
          map[e.exId].totalReps += exResultReps(e);
          map[e.exId].totalWeight += exResultWeight(e);
          map[e.exId].weightPerSetSum += e.weight || 0;
        });
      });
      return Object.values(map).sort((a, b) => b.totalWeight - a.totalWeight);
    }, [state.history]);
    if (stats.length === 0) {
      return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(Dumbbell, { size: 28, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("p", null, "No completed exercises yet.")));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-list" }, stats.map((s) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Card, { key: s.exId, className: "exercise-stats-row" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-name" }, s.name, " ", ((_a = exMap[s.exId]) == null ? void 0 : _a.isBonus) && /* @__PURE__ */ React.createElement("span", { className: "bonus-tag" }, "Bonus")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-grid" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, s.timesPerformed), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Times performed")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, s.totalSets.toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Total sets")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, s.totalReps.toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Total reps")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num" }, Math.round(s.weightPerSetSum / s.timesPerformed).toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Avg lb/set")), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-cell" }, /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-num accent" }, s.totalWeight.toLocaleString()), /* @__PURE__ */ React.createElement("div", { className: "exercise-stats-label" }, "Total Weight (lb)"))));
    }));
  }
  function PlansSubview({ state, preselectPlan, onConsumePreselect }) {
    const groups = useMemo(() => derivePlanGroups(state), [state.history, state.plans]);
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [expandedRun, setExpandedRun] = useState(null);
    const [expandedWorkout, setExpandedWorkout] = useState(null);
    useEffect(() => {
      if (preselectPlan) {
        setExpandedPlan(preselectPlan);
        const group = groups.find((g) => g.planName === preselectPlan);
        if (group && group.runs[0]) setExpandedRun(group.runs[0].id);
        onConsumePreselect && onConsumePreselect();
      }
    }, [preselectPlan]);
    if (groups.length === 0) {
      return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(Target, { size: 28, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("p", null, "No plan activity yet.")));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "plan-groups-list" }, groups.map((g) => {
      const isOpen = expandedPlan === g.planName;
      return /* @__PURE__ */ React.createElement(Card, { key: g.planName, className: "plan-group-card" }, /* @__PURE__ */ React.createElement("div", { className: "plan-group-header", onClick: () => setExpandedPlan(isOpen ? null : g.planName) }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "plan-group-title" }, g.planName), /* @__PURE__ */ React.createElement("div", { className: "plan-group-sub" }, g.timesCompleted, " completed \xB7 avg ", fmtDuration(Math.round(g.avgDurationSec)), " \xB7 ", g.totalWeight.toLocaleString(), " lb \xB7 ", g.totalReps.toLocaleString(), " reps")), isOpen ? /* @__PURE__ */ React.createElement(ChevronUp, { size: 16 }) : /* @__PURE__ */ React.createElement(ChevronDown, { size: 16 })), isOpen && /* @__PURE__ */ React.createElement("div", { className: "plan-run-list" }, g.runs.map((run) => {
        const isRunOpen = expandedRun === run.id;
        return /* @__PURE__ */ React.createElement("div", { key: run.id, className: "plan-run-block" }, /* @__PURE__ */ React.createElement("div", { className: "plan-run-header", onClick: () => setExpandedRun(isRunOpen ? null : run.id) }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "plan-run-title" }, run.isPartial ? "In progress" : "Completed", " \xB7 ", fmtDateTime(run.startDate)), /* @__PURE__ */ React.createElement("div", { className: "plan-run-sub" }, fmtDuration(run.totalDurationSec), " \xB7 ", run.totalWeight.toLocaleString(), " lb \xB7 ", run.totalReps.toLocaleString(), " reps \xB7 ", run.completedCount, " done", run.skippedCount > 0 ? `, ${run.skippedCount} skipped` : "")), isRunOpen ? /* @__PURE__ */ React.createElement(ChevronUp, { size: 14 }) : /* @__PURE__ */ React.createElement(ChevronDown, { size: 14 })), isRunOpen && /* @__PURE__ */ React.createElement("div", { className: "plan-run-body" }, run.workouts.map((w) => {
          const wKey = run.id + "_" + w.workoutId;
          const isWOpen = expandedWorkout === wKey;
          const wCompleted = w.sessions.filter((s) => s.status === "completed").length;
          const wSkipped = w.sessions.filter((s) => s.status === "skipped").length;
          const wWeight = w.sessions.reduce((sum, s) => sum + (s.status === "completed" ? sessionTotalWeight(s) : 0), 0);
          const wReps = w.sessions.reduce((sum, s) => sum + (s.status === "completed" ? sessionTotalReps(s) : 0), 0);
          return /* @__PURE__ */ React.createElement("div", { key: wKey, className: "plan-run-workout" }, /* @__PURE__ */ React.createElement("div", { className: "plan-run-workout-header", onClick: () => setExpandedWorkout(isWOpen ? null : wKey) }, /* @__PURE__ */ React.createElement("div", { className: "session-block-title small" }, w.workoutName), /* @__PURE__ */ React.createElement("div", { className: "plan-run-workout-sub" }, wCompleted, " done", wSkipped > 0 ? `, ${wSkipped} skipped` : "", " \xB7 ", wWeight.toLocaleString(), " lb \xB7 ", wReps.toLocaleString(), " reps")), isWOpen && /* @__PURE__ */ React.createElement("div", { className: "plan-run-sessions" }, w.sessions.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, className: "plan-run-session-row" }, /* @__PURE__ */ React.createElement("div", { className: `history-status-dot ${s.status}` }), /* @__PURE__ */ React.createElement("div", { className: "plan-run-session-main" }, /* @__PURE__ */ React.createElement("div", { className: "plan-run-session-title" }, s.sessionName), /* @__PURE__ */ React.createElement("div", { className: "plan-run-session-sub" }, s.status === "pending" && "Not yet done", s.status !== "pending" && fmtDateTime(s.date), s.status === "completed" && /* @__PURE__ */ React.createElement(React.Fragment, null, " \xB7 ", fmtDuration(s.durationSec), " \xB7 ", sessionTotalWeight(s).toLocaleString(), " lb \xB7 ", sessionTotalReps(s).toLocaleString(), " reps \xB7 ", (s.exercises || []).reduce((sum, e) => sum + (e.sets || DEFAULT_SETS_PER_EXERCISE), 0), " sets"), s.status === "skipped" && /* @__PURE__ */ React.createElement(React.Fragment, null, " \xB7 Skipped (", s.skipReason, s.skipNote ? `: ${s.skipNote}` : "", ")"), s.bonusExId && /* @__PURE__ */ React.createElement(React.Fragment, null, " \xB7 ", /* @__PURE__ */ React.createElement(Star, { size: 10, style: { display: "inline", verticalAlign: -1 }, fill: "var(--gold)", stroke: "var(--gold)" }), " Bonus used")))))));
        })));
      })));
    }));
  }
  function HistoryView({ state, preselectPlan, onConsumePreselect }) {
    const [tab, setTab] = useState(preselectPlan ? "plans" : "plans");
    useEffect(() => {
      if (preselectPlan) {
        setTab("plans");
      }
    }, [preselectPlan]);
    return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement(SectionTitle, { sub: "Completed and skipped activity \u2014 completed workouts are locked" }, "History"), /* @__PURE__ */ React.createElement("div", { className: "tab-row" }, /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "plans" ? "active" : ""}`, onClick: () => setTab("plans") }, "Plans"), /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "challenges" ? "active" : ""}`, onClick: () => setTab("challenges") }, "Challenges"), /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "sessions" ? "active" : ""}`, onClick: () => setTab("sessions") }, "Workouts"), /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "exercises" ? "active" : ""}`, onClick: () => setTab("exercises") }, "Exercises")), tab === "plans" && /* @__PURE__ */ React.createElement(PlansSubview, { state, preselectPlan, onConsumePreselect }), tab === "challenges" && /* @__PURE__ */ React.createElement(ChallengesSubview, { state }), tab === "sessions" && /* @__PURE__ */ React.createElement(SessionsSubview, { state }), tab === "exercises" && /* @__PURE__ */ React.createElement(ExercisesSubview, { state }));
  }
  function ProgressView({ state, setState }) {
    const completed = state.history.filter((h) => h.status === "completed");
    const skipped = state.history.filter((h) => h.status === "skipped");
    const totalWeightLifted = completed.reduce((sum, h) => sum + sessionTotalWeight(h), 0);
    const totalRepsCompleted = completed.reduce((sum, h) => sum + sessionTotalReps(h), 0);
    const totalTimeSec = completed.reduce((sum, h) => sum + (h.durationSec || 0), 0);
    const workoutIds = new Set(completed.map((h) => h.workoutId));
    const exerciseIds = /* @__PURE__ */ new Set();
    completed.forEach((h) => (h.exercises || []).forEach((e) => exerciseIds.add(e.exId)));
    const planGroups = useMemo(() => derivePlanGroups(state), [state.history, state.plans]);
    const totalPlanRunsCompleted = planGroups.reduce((sum, g) => sum + g.timesCompleted, 0);
    const [range, setRange] = useState("day");
    const [metric, setMetric] = useState("weight");
    const RANGE_OPTIONS = [
      { id: "day", label: "Day", singular: "Hour" },
      { id: "month", label: "Month", singular: "Day" },
      { id: "year", label: "Year", singular: "Month" },
      { id: "plans", label: "Plans", singular: "Plan" },
      { id: "challenges", label: "Challenges", singular: "Challenge" },
      { id: "workouts", label: "Workouts", singular: "Workout" },
      { id: "exercises", label: "Exercises", singular: "Exercise" }
    ];
    const METRIC_OPTIONS = [
      { id: "weight", label: "Weight", unit: "lb" },
      { id: "reps", label: "Reps", unit: "" },
      { id: "weightPerRep", label: "Weight/Rep", unit: "lb" },
      { id: "time", label: "Time", unit: "s" }
    ];
    const isTimeRange = ["day", "month", "year"].includes(range);
    const MAX_POINTS = 10;
    const points = useMemo(() => {
      const pointFor = (records, detail) => {
        const totalW = records.reduce((sum, h) => sum + sessionTotalWeight(h), 0);
        const totalR = records.reduce((sum, h) => sum + sessionTotalReps(h), 0);
        const totalT = records.reduce((sum, h) => sum + (h.durationSec || 0), 0);
        return {
          detail,
          weight: totalW,
          reps: totalR,
          weightPerRep: totalR > 0 ? totalW / totalR : 0,
          time: totalT,
          count: records.length
        };
      };
      if (isTimeRange) {
        const now = /* @__PURE__ */ new Date();
        const buckets = [];
        if (range === "day") {
          for (let i = 23; i >= 0; i--) {
            const d = new Date(now);
            d.setMinutes(0, 0, 0);
            d.setHours(d.getHours() - i);
            const end = new Date(d);
            end.setHours(end.getHours() + 1);
            buckets.push({ start: d, end, detail: d.toLocaleTimeString(void 0, { hour: "numeric" }) });
          }
        } else if (range === "month") {
          for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            const end = new Date(d);
            end.setDate(end.getDate() + 1);
            buckets.push({ start: d, end, detail: d.toLocaleDateString(void 0, { month: "short", day: "numeric" }) });
          }
        } else {
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            buckets.push({ start: d, end, detail: d.toLocaleDateString(void 0, { month: "short", year: "2-digit" }) });
          }
        }
        return buckets.map((b) => pointFor(completed.filter((h) => {
          const d = new Date(h.date);
          return d >= b.start && d < b.end;
        }), b.detail));
      }
      if (range === "plans") {
        const allRuns = planGroups.flatMap((g) => g.runs.filter((r) => !r.isPartial).map((r) => ({ ...r, planName: g.planName })));
        allRuns.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        return allRuns.map((r) => pointFor(
          state.history.filter((h) => h.iterationId === r.id && h.status === "completed"),
          r.planName
        ));
      }
      if (range === "challenges" || range === "workouts") {
        const key = range === "challenges" ? "workoutName" : "sessionName";
        const seen = [];
        completed.forEach((h) => {
          if (h[key] && !seen.includes(h[key])) seen.push(h[key]);
        });
        return seen.map((name) => pointFor(completed.filter((h) => h[key] === name), name));
      }
      if (range === "exercises") {
        const byExercise = {};
        completed.forEach((h) => {
          (h.exercises || []).forEach((e) => {
            if (!byExercise[e.name]) byExercise[e.name] = [];
            byExercise[e.name].push(e);
          });
        });
        return Object.entries(byExercise).map(([name, exs]) => {
          const totalW = exs.reduce((sum, e) => sum + exResultWeight(e), 0);
          const totalR = exs.reduce((sum, e) => sum + exResultReps(e), 0);
          return { detail: name, weight: totalW, reps: totalR, weightPerRep: totalR > 0 ? totalW / totalR : 0, time: 0, count: exs.length };
        });
      }
      return [];
    }, [range, completed, planGroups, state.history]);
    const recentPoints = points.slice(-MAX_POINTS);
    const nonEmptyPoints = isTimeRange ? recentPoints : recentPoints.filter((p) => p.count > 0);
    const trendFor = (key) => {
      if (nonEmptyPoints.length < 2) return null;
      const mid = Math.ceil(nonEmptyPoints.length / 2);
      const firstHalf = nonEmptyPoints.slice(0, mid);
      const secondHalf = nonEmptyPoints.slice(mid);
      if (secondHalf.length === 0) return null;
      const avg = (arr) => arr.reduce((sum, p) => sum + p[key], 0) / arr.length;
      const a = avg(firstHalf);
      const b = avg(secondHalf);
      if (a === 0) return null;
      const pct = (b - a) / a * 100;
      return { pct, up: pct >= 0 };
    };
    const avgWeight = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.weight, 0) / nonEmptyPoints.length : 0;
    const avgReps = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.reps, 0) / nonEmptyPoints.length : 0;
    const avgWeightPerRep = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.weightPerRep, 0) / nonEmptyPoints.length : 0;
    const avgTime = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.time, 0) / nonEmptyPoints.length : 0;
    const AVG_STATS = [
      { key: "weight", label: "Avg Weight", value: `${Math.round(avgWeight).toLocaleString()} lb`, trend: trendFor("weight") },
      { key: "reps", label: "Avg Reps", value: Math.round(avgReps).toLocaleString(), trend: trendFor("reps") },
      { key: "weightPerRep", label: "Avg Weight/Rep", value: `${avgWeightPerRep.toFixed(1)} lb`, trend: trendFor("weightPerRep") },
      { key: "time", label: "Avg Time", value: fmtAdaptiveDuration(avgTime), trend: trendFor("time") }
    ];
    const activeMetric = METRIC_OPTIONS.find((m) => m.id === metric);
    const chartData = nonEmptyPoints.map((p, i) => ({
      x: i + 1,
      detail: p.detail,
      value: metric === "weightPerRep" ? Number(p.weightPerRep.toFixed(1)) : p[metric]
    }));
    const totalWeightTonnes = totalWeightLifted / 2e3;
    return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement(SectionTitle, { sub: "Averages, trends, and bonus stars" }, "Progress"), /* @__PURE__ */ React.createElement(SectionTitle, null, "Trends per ", RANGE_OPTIONS.find((r) => r.id === range).singular), /* @__PURE__ */ React.createElement("div", { className: "avg-stats-grid" }, AVG_STATS.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.key, className: "avg-stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "avg-stat-label" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "avg-stat-value" }, s.value), s.trend && /* @__PURE__ */ React.createElement("div", { className: `avg-stat-trend ${s.trend.up ? "up" : "down"}` }, s.trend.up ? "\u2191" : "\u2193", " ", Math.abs(s.trend.pct).toFixed(0), "%")))), /* @__PURE__ */ React.createElement("div", { className: "chart-header-row" }, /* @__PURE__ */ React.createElement(SectionTitle, null, activeMetric.label, " by ", RANGE_OPTIONS.find((r) => r.id === range).singular), /* @__PURE__ */ React.createElement("div", { className: "chart-select-group" }, /* @__PURE__ */ React.createElement("select", { className: "text-input metric-select", value: range, onChange: (e) => setRange(e.target.value) }, RANGE_OPTIONS.map((r) => /* @__PURE__ */ React.createElement("option", { key: r.id, value: r.id }, r.label))), /* @__PURE__ */ React.createElement("select", { className: "text-input metric-select", value: metric, onChange: (e) => setMetric(e.target.value) }, METRIC_OPTIONS.map((m) => /* @__PURE__ */ React.createElement("option", { key: m.id, value: m.id }, m.label))))), chartData.length === 0 ? /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement("p", null, "Complete a workout to see your trend here."))) : /* @__PURE__ */ React.createElement(Card, { className: "chart-card" }, /* @__PURE__ */ React.createElement(
      SimpleLineChart,
      {
        data: chartData,
        height: 200,
        valueFormatter: (value) => metric === "time" ? fmtAdaptiveDuration(value) : `${value.toLocaleString()} ${activeMetric.unit}`.trim(),
        labelFormatter: (point) => point.detail
      }
    )), /* @__PURE__ */ React.createElement(Card, { className: "bonus-card" }, /* @__PURE__ */ React.createElement("div", { className: "bonus-card-icon" }, /* @__PURE__ */ React.createElement(Star, { size: 22, fill: "var(--gold)", stroke: "var(--gold)" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "bonus-card-num" }, state.bonusStars), /* @__PURE__ */ React.createElement("div", { className: "bonus-card-label" }, "Bonus stars available")), /* @__PURE__ */ React.createElement("div", { className: "bonus-card-note" }, "+1 for completing a plan", /* @__PURE__ */ React.createElement("br", null), "+1 for completing each bonus exercise in the plan", /* @__PURE__ */ React.createElement("br", null), "\u22121 for each workout skipped")), /* @__PURE__ */ React.createElement(Card, { className: "level-card" }, /* @__PURE__ */ React.createElement(LevelDumbbell, { level: state.level, size: 88 }), /* @__PURE__ */ React.createElement("div", { className: "level-card-info" }, /* @__PURE__ */ React.createElement("div", { className: "level-card-num" }, "Level ", state.level), /* @__PURE__ */ React.createElement("div", { className: "level-card-sub" }, state.bonusStars < 0 ? `${Math.abs(state.bonusStars)} stars in debt` : `Next level costs ${levelUpCost(state.level)} star${levelUpCost(state.level) === 1 ? "" : "s"}`)), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-primary btn-sm",
        disabled: state.bonusStars < levelUpCost(state.level),
        onClick: () => setState((s) => ({ ...s, level: s.level + 1, bonusStars: s.bonusStars - levelUpCost(s.level) }))
      },
      "Level Up"
    )), /* @__PURE__ */ React.createElement(SectionTitle, null, "Summary"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "summary-stats" }, /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(Flame, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Total weight lifted"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, totalWeightTonnes.toFixed(2), /* @__PURE__ */ React.createElement("span", { className: "summary-unit" }, " t"))), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(Flame, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Total reps"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, totalRepsCompleted.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(Clock, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Total time spent working out"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, fmtLongDuration(totalTimeSec))), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(Target, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Plans completed"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, totalPlanRunsCompleted)), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(Settings, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Challenges completed"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, workoutIds.size)), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(TrendingUp, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Workouts completed"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, completed.length)), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(Dumbbell, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Exercises completed"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, exerciseIds.size)), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(X, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Workouts skipped"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, skipped.length)), /* @__PURE__ */ React.createElement("div", { className: "summary-row" }, /* @__PURE__ */ React.createElement(Trophy, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-desc" }, "Bonus stars earned"), " ", /* @__PURE__ */ React.createElement("span", { className: "summary-value" }, state.bonusStars)))));
  }
  function LogView({ state, setState }) {
    const [text, setText] = useState("");
    const addLog = () => {
      if (!text.trim()) return;
      setState((s) => ({ ...s, logs: [{ id: uid("log"), date: (/* @__PURE__ */ new Date()).toISOString(), text: text.trim() }, ...s.logs] }));
      setText("");
    };
    const deleteLog = (id) => setState((s) => ({ ...s, logs: s.logs.filter((l) => l.id !== id) }));
    const reminders = state.logs.slice(0, 3).map((l) => l.text.split(/[.,;]/)[0]);
    return /* @__PURE__ */ React.createElement("div", { className: "view-pad" }, /* @__PURE__ */ React.createElement(SectionTitle, { sub: "Notes, reminders, and workout observations" }, "Exercise Log"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("textarea", { className: "text-input log-textarea", placeholder: "e.g. Need to lock wrists for chicken lifts...", value: text, onChange: (e) => setText(e.target.value) }), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-block", onClick: addLog }, /* @__PURE__ */ React.createElement(NotebookPen, { size: 14 }), " Save Note")), reminders.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionTitle, null, "Reminders"), /* @__PURE__ */ React.createElement(Card, { className: "reminders-card" }, reminders.map((r, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "reminder-item" }, /* @__PURE__ */ React.createElement(Flame, { size: 13 }), /* @__PURE__ */ React.createElement("span", null, r.trim()))))), /* @__PURE__ */ React.createElement(SectionTitle, null, "All Notes"), state.logs.length === 0 ? /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement(NotebookPen, { size: 28, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("p", null, "No notes yet."))) : /* @__PURE__ */ React.createElement("div", { className: "log-list" }, state.logs.map((l) => /* @__PURE__ */ React.createElement(Card, { key: l.id, className: "log-row" }, /* @__PURE__ */ React.createElement("div", { className: "log-row-main" }, /* @__PURE__ */ React.createElement("div", { className: "log-row-date" }, new Date(l.date).toLocaleDateString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })), /* @__PURE__ */ React.createElement("div", { className: "log-row-text" }, l.text)), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => deleteLog(l.id) }, /* @__PURE__ */ React.createElement(Trash2, { size: 14 }))))));
  }
  const TABS = [
    { id: "workouts", label: "Plans", icon: Play },
    { id: "plan", label: "Craft", icon: Settings },
    { id: "history", label: "History", icon: HistoryIcon },
    { id: "progress", label: "Progress", icon: Target },
    { id: "log", label: "Log", icon: NotebookPen }
  ];
  function App() {
    const [state, setState] = useState(null);
    const [tab, setTab] = useState("workouts");
    const [loading, setLoading] = useState(true);
    const [confirmingReset, setConfirmingReset] = useState(false);
    const [historyPreselectPlan, setHistoryPreselectPlan] = useState(null);
    useEffect(() => {
      (async () => {
        const loaded = await loadState();
        setState(loaded || defaultState());
        setLoading(false);
      })();
    }, []);
    useEffect(() => {
      if (state && !loading) saveState(state);
    }, [state, loading]);
    if (loading || !state) {
      return /* @__PURE__ */ React.createElement("div", { className: "app-shell loading-shell" }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement(Loader2, { className: "spin", size: 28 }), /* @__PURE__ */ React.createElement("p", null, "Loading your workout data\u2026"));
    }
    const resetData = () => {
      setState(defaultState());
    };
    const viewPlanInHistory = (planName) => {
      setHistoryPreselectPlan(planName);
      setTab("history");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "app-shell" }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement("header", { className: "app-header" }, /* @__PURE__ */ React.createElement("div", { className: "app-header-brand" }, /* @__PURE__ */ React.createElement(Dumbbell, { size: 20 }), /* @__PURE__ */ React.createElement("span", null, "IRONLOG")), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => setConfirmingReset(true), "aria-label": "Reset data" }, /* @__PURE__ */ React.createElement(RotateCcw, { size: 16 }))), /* @__PURE__ */ React.createElement("main", { className: "app-main" }, tab === "workouts" && /* @__PURE__ */ React.createElement(WorkoutsView, { state, setState, onViewPlanHistory: viewPlanInHistory }), tab === "plan" && /* @__PURE__ */ React.createElement(PlanView, { state, setState }), tab === "history" && /* @__PURE__ */ React.createElement(HistoryView, { state, preselectPlan: historyPreselectPlan, onConsumePreselect: () => setHistoryPreselectPlan(null) }), tab === "progress" && /* @__PURE__ */ React.createElement(ProgressView, { state, setState }), tab === "log" && /* @__PURE__ */ React.createElement(LogView, { state, setState })), /* @__PURE__ */ React.createElement("nav", { className: "tab-bar" }, TABS.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, className: `tab-bar-btn ${tab === t.id ? "active" : ""}`, onClick: () => setTab(t.id) }, /* @__PURE__ */ React.createElement(t.icon, { size: 18, strokeWidth: tab === t.id ? 2.4 : 1.8 }), /* @__PURE__ */ React.createElement("span", null, t.label)))), confirmingReset && /* @__PURE__ */ React.createElement("div", { className: "modal-backdrop", onClick: () => setConfirmingReset(false) }, /* @__PURE__ */ React.createElement("div", { className: "modal", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("h3", null, "Reset all data?"), /* @__PURE__ */ React.createElement("p", { className: "modal-sub" }, "This clears all progress, plans, and notes. This cannot be undone."), /* @__PURE__ */ React.createElement("div", { className: "confirm-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-block", onClick: () => setConfirmingReset(false) }, "Cancel"), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-primary btn-block danger-solid",
        onClick: () => {
          resetData();
          setConfirmingReset(false);
        }
      },
      /* @__PURE__ */ React.createElement(RotateCcw, { size: 14 }),
      " Reset"
    )))));
  }
  const CSS = `
:root {
  --bg: #121212;
  --surface: #1b1b1d;
  --surface-2: #202023;
  --border: #2a2a2d;
  --text: #e8e6e1;
  --text-dim: #8f8a80;
  --accent: #c4463a;
  --accent-dim: #8f342b;
  --success: #5c8a6b;
  --gold: #d4a94e;
  --radius: 10px;
}
* { box-sizing: border-box; }
.app-shell { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; position: relative; }
.loading-shell { align-items: center; justify-content: center; gap: 12px; color: var(--text-dim); min-height: 400px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.app-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10; }
.app-header-brand { display: flex; align-items: center; gap: 8px; font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 0.06em; color: var(--accent); }
.app-main { flex: 1; padding-bottom: 84px; }
.view-pad { padding: 20px; }
.section-title { margin-bottom: 16px; }
.section-title h2 { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 600; margin: 0 0 2px; letter-spacing: 0.01em; }
.section-title p { color: var(--text-dim); font-size: 13px; margin: 0; }
.eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin-bottom: 12px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 16px; border-radius: 8px; border: none; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; transition: opacity 0.15s, transform 0.1s; }
.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover:not(:disabled) { background: #d4544a; }
.btn-ghost { background: transparent; color: var(--text-dim); border: 1px solid var(--border); }
.btn-ghost:hover:not(:disabled) { color: var(--text); border-color: #444; }
.btn-ghost.danger { color: var(--accent); border-color: var(--accent-dim); }
.btn-block { width: 100%; }
.btn-sm { padding: 7px 10px; font-size: 12px; }
.icon-btn { background: transparent; border: none; color: var(--text-dim); cursor: pointer; padding: 8px; border-radius: 6px; display: flex; align-items: center; }
.icon-btn:hover:not(:disabled) { color: var(--text); background: var(--surface-2); }
.icon-btn:disabled { opacity: 0.25; cursor: not-allowed; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 30px 10px; color: var(--text-dim); text-align: center; }
.empty-state p { margin: 0; font-size: 13px; }
.empty-inline { font-size: 12px; color: var(--text-dim); padding: 8px 0; }
.plate-stack { position: relative; flex-shrink: 0; }
.plate-stack-label { position: absolute; bottom: -2px; left: 0; right: 0; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-dim); }

.day-picker-row { display: flex; gap: 6px; overflow-x: auto; margin-bottom: 12px; padding-bottom: 2px; }
.day-pill { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 62px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; cursor: pointer; color: var(--text-dim); flex-shrink: 0; }
.day-pill.active { border-color: var(--accent); background: rgba(196,70,58,0.1); color: var(--text); }
.day-pill.is-done { color: var(--success); }
.day-pill.is-done.active { border-color: var(--success); background: rgba(92,138,107,0.1); }
.day-pill.secondary { min-width: 0; }
.day-pill-num { font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; }
.day-pill-name { font-size: 12px; font-weight: 600; }

.session-tab-row { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.session-tab { background: var(--surface-2); border: 1px solid var(--border); color: var(--text-dim); padding: 7px 13px; border-radius: 20px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
.session-tab.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.session-tab.is-done:not(.active) { color: var(--success); border-color: var(--success); }
.session-tab.is-skipped:not(.active) { color: var(--text-dim); border-color: var(--text-dim); }
.results-header { margin-bottom: 14px; }
.results-header h3 { font-family: 'Oswald', sans-serif; font-size: 18px; margin: 2px 0 0; }
.results-summary-row { display: flex; gap: 10px; margin-bottom: 16px; }
.results-summary-stat { flex: 1; background: var(--surface-2); border-radius: 8px; padding: 12px; text-align: center; }
.results-summary-num { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; }
.results-summary-num.accent { color: var(--accent); }
.results-summary-label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
.results-exercise-list { display: flex; flex-direction: column; gap: 8px; }
.results-exercise-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.results-exercise-row:last-child { border-bottom: none; }
.exercise-target-total { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-dim); margin-top: 2px; }
.results-skip-note { font-size: 13px; color: var(--text-dim); background: var(--surface-2); border-radius: 8px; padding: 12px; }

.setup-card-header { margin-bottom: 14px; }
.setup-card-header h3 { font-family: 'Oswald', sans-serif; font-size: 18px; margin: 2px 0 0; }
.setup-exercise-list { display: flex; flex-direction: column; gap: 12px; }
.setup-exercise-row { padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.setup-exercise-row:last-child { border-bottom: none; padding-bottom: 0; }
.variant-chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.variant-chip { background: var(--surface-2); border: 1px solid var(--border); color: var(--text-dim); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 6px 10px; border-radius: 20px; cursor: pointer; }
.variant-chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.bonus-toggle-row { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
.bonus-tag { font-size: 9px; background: rgba(212,169,78,0.15); color: var(--gold); padding: 2px 6px; border-radius: 10px; margin-left: 6px; text-transform: uppercase; letter-spacing: 0.04em; }

.static-actions { position: static; background: none; padding: 16px 0 0; }

.plan-pick-list, .workout-pick-list { display: flex; flex-direction: column; gap: 10px; padding-top: 40vh; padding-bottom: 40vh; margin-top: -40vh; margin-bottom: -40vh; }
.plan-pick-card, .workout-pick-card { cursor: pointer; transition: border-color 0.15s; }
.plan-pick-card:hover, .workout-pick-card:hover { border-color: var(--accent-dim); }
.plan-pick-card.selected { border-color: var(--accent); }
.plan-pick-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.plan-pick-name { font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 600; }
.plan-pick-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
.plan-pick-expand { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); cursor: default; }
.chevron-affordance { color: var(--text-dim); flex-shrink: 0; }
.badge-skipped { background: rgba(143,138,128,0.18); color: var(--text-dim); }
.badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; padding: 4px 9px; border-radius: 20px; border: none; font-family: 'Inter', sans-serif; font-weight: 600; }
.badge-done { background: rgba(92,138,107,0.18); color: var(--success); }
.badge-link { cursor: pointer; transition: background 0.15s; }
.badge-link:hover { background: rgba(92,138,107,0.3); }
.back-link { display: inline-flex; align-items: center; gap: 4px; background: transparent; border: none; color: var(--text-dim); font-size: 12px; cursor: pointer; padding: 0; margin-bottom: 14px; }
.back-link:hover { color: var(--text); }

.exercise-row { display: flex; align-items: center; gap: 12px; padding: 12px; }
.exercise-row.static-row { padding: 14px 16px; }
.exercise-row-main { flex: 1; min-width: 0; }
.exercise-row-name { font-weight: 600; font-size: 14px; }
.exercise-row-req { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
.exercise-target { text-align: right; flex-shrink: 0; }
.exercise-target-num { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-dim); }
.exercise-target-num.accent { color: var(--accent); font-weight: 600; }

.active-header { margin-bottom: 20px; }
.active-header h2 { font-family: 'Oswald', sans-serif; font-size: 24px; margin: 4px 0 6px; }
.timer-display { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 20px; color: var(--accent); font-weight: 600; }
.exercise-log-list { display: flex; flex-direction: column; gap: 8px; }

.sticky-actions { position: fixed; bottom: 76px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; display: flex; gap: 8px; padding: 12px 20px; background: linear-gradient(to top, var(--bg) 70%, transparent); }
.sticky-actions .btn-primary { flex: 1; }
.sticky-actions-spacer { height: 76px; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: flex-end; z-index: 50; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px 16px 0 0; padding: 20px; width: 100%; max-width: 480px; margin: 0 auto; }
.modal h3 { font-family: 'Oswald', sans-serif; margin: 0 0 4px; }
.modal-sub { color: var(--text-dim); font-size: 13px; margin: 0 0 16px; }
.confirm-actions { display: flex; gap: 8px; }
.btn-primary.danger-solid { background: var(--accent); }
.skip-reasons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.skip-reason-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; background: var(--surface-2); border: 1px solid var(--border); color: var(--text-dim); border-radius: 10px; padding: 12px 6px; font-size: 10px; cursor: pointer; }
.skip-reason-btn:hover { color: var(--text); border-color: var(--accent); }

.text-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: 'Inter', sans-serif; margin-bottom: 10px; }
.text-input:focus { outline: none; border-color: var(--accent); }
.log-textarea { min-height: 80px; resize: vertical; }

.tab-row { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; }
.tab-btn { background: transparent; border: 1px solid var(--border); color: var(--text-dim); padding: 8px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; white-space: nowrap; }
.tab-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

.schedule-grid { display: flex; flex-direction: column; gap: 12px; }
.day-plan-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 4px; }
.rename-row { display: flex; align-items: center; gap: 6px; }
.rename-row h3 { font-family: 'Oswald', sans-serif; font-size: 17px; margin: 2px 0 0; }
.rename-row .text-input { margin: 4px 0 0; }
.day-bonus-picker { margin: 12px 0 16px; padding-top: 12px; border-top: 1px solid var(--border); }
.day-bonus-picker select { cursor: pointer; }
.workout-block { margin-top: 14px; padding: 12px; background: var(--surface-2); border-radius: 8px; border: 1px solid var(--border); }
.workout-block-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.workout-block-body { margin-top: 10px; }
.session-block { margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border); }
.session-block:first-child { margin-top: 12px; }
.session-block-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.session-block-title { font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 600; }
.session-block-title.small { font-size: 13px; }
.reorder-list { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.reorder-list li { display: flex; align-items: center; gap: 8px; background: var(--surface); border-radius: 6px; padding: 6px 8px; font-size: 12px; }
.reorder-name { flex: 1; }
.empty-row { color: var(--text-dim); font-style: italic; }
.add-exercise-list { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; max-height: 220px; overflow-y: auto; }
.add-exercise-item { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); color: var(--text-dim); border-radius: 6px; padding: 8px 10px; font-size: 12px; cursor: pointer; text-align: left; }
.add-exercise-item:hover { color: var(--text); border-color: var(--accent); }

.exercise-manage-list { display: flex; flex-direction: column; gap: 8px; }
.exercise-manage-row { padding: 0; overflow: hidden; }
.exercise-manage-top { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; color: var(--text-dim); }
.exercise-edit-panel { padding: 0 16px 16px; border-top: 1px solid var(--border); padding-top: 12px; }
.exercise-edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.exercise-edit-grid label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.04em; grid-column: span 2; }
.exercise-edit-grid .text-input { margin-top: 4px; margin-bottom: 0; }
.bonus-designation-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.bonus-designation-sub { font-size: 11px; color: var(--text-dim); line-height: 1.4; max-width: 220px; }
.variant-manager { margin-bottom: 12px; }
.variant-manager-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim); margin-bottom: 8px; }
.variant-row { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.variant-fixed-label { flex: 1; font-size: 12px; font-weight: 600; }
.variant-num-input { width: 50px; margin-bottom: 0; font-size: 12px; padding: 6px; text-align: center; font-family: 'JetBrains Mono', monospace; }
.variant-unit { font-size: 10px; color: var(--text-dim); }
.default-star { background: transparent; border: none; cursor: pointer; color: var(--text-dim); display: flex; padding: 4px; }
.default-star.active { color: var(--gold); }

.history-list { display: flex; flex-direction: column; gap: 8px; }
.history-row-card { padding: 0; }
.history-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
.history-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.history-status-dot.completed { background: var(--success); }
.history-status-dot.skipped { background: var(--text-dim); }
.history-status-dot.pending { background: transparent; border: 1px solid var(--border); }
.history-row-main { flex: 1; min-width: 0; }
.history-row-title { font-weight: 600; font-size: 13px; }
.weekday-tag { font-size: 10px; color: var(--text-dim); font-weight: 400; margin-left: 4px; }
.history-row-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
.history-row-stat { text-align: right; }
.history-row-stat-num { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--accent); }
.history-row-stat-label { font-size: 9px; color: var(--text-dim); text-transform: uppercase; }
.lock-icon { color: var(--text-dim); flex-shrink: 0; }
.history-detail { padding: 0 16px 14px; border-top: 1px solid var(--border); }
.history-detail-row { display: flex; justify-content: space-between; font-size: 12px; padding: 8px 0; border-bottom: 1px dashed var(--border); }
.history-detail-row:last-child { border-bottom: none; }
.mono { font-family: 'JetBrains Mono', monospace; color: var(--text-dim); }

.progress-pace-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
.progress-pace-row.single { grid-template-columns: 1fr; }
.pace-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 8px; }
.pace-card-label { font-size: 11px; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.06em; }
.pace-card-sub { font-size: 10px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }

.range-row { display: flex; gap: 6px; overflow-x: auto; margin-bottom: 16px; padding-bottom: 2px; }
.avg-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
.avg-stat-card { padding: 14px; }
.avg-stat-label { font-size: 10px; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.04em; margin-bottom: 6px; }
.avg-stat-value { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 600; }
.avg-stat-trend { font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-top: 4px; }
.avg-stat-trend.up { color: var(--success); }
.avg-stat-trend.down { color: var(--accent); }
.chart-header-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
.chart-header-row .section-title { margin-bottom: 0; flex: 1; min-width: 140px; }
.chart-select-group { display: flex; gap: 6px; }
.metric-select { width: auto; margin-bottom: 16px; padding: 8px 10px; font-size: 12px; }
.chart-card { padding: 12px 8px 4px; margin-bottom: 20px; position: relative; }
.chart-tooltip { position: absolute; top: 8px; transform: translateX(-50%); background: #1b1b1d; border: 1px solid #2a2a2d; border-radius: 8px; padding: 6px 10px; font-size: 12px; pointer-events: none; white-space: nowrap; }
.chart-tooltip-label { color: #e8e6e1; font-weight: 600; margin-bottom: 2px; }
.chart-tooltip-value { color: #c4463a; font-family: 'JetBrains Mono', monospace; }

.exercise-stats-list { display: flex; flex-direction: column; gap: 8px; }
.exercise-stats-row { padding: 14px 16px; }
.exercise-stats-name { font-weight: 600; font-size: 14px; margin-bottom: 10px; }
.exercise-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.exercise-stats-cell { text-align: center; background: var(--surface-2); border-radius: 8px; padding: 8px 4px; }
.exercise-stats-num { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; }
.exercise-stats-num.accent { color: var(--accent); }
.exercise-stats-label { font-size: 9px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.03em; margin-top: 2px; }

.plan-groups-list { display: flex; flex-direction: column; gap: 10px; }
.plan-group-card { padding: 0; overflow: hidden; }
.plan-group-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; }
.plan-group-title { font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 600; }
.plan-group-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
.plan-run-list { border-top: 1px solid var(--border); padding: 10px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
.plan-run-block { background: var(--surface-2); border-radius: 8px; overflow: hidden; }
.plan-run-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; cursor: pointer; }
.plan-run-title { font-size: 12px; font-weight: 600; }
.plan-run-sub { font-size: 10px; color: var(--text-dim); margin-top: 2px; font-family: 'JetBrains Mono', monospace; }
.plan-run-body { padding: 0 12px 10px; display: flex; flex-direction: column; gap: 6px; }
.plan-run-workout { background: var(--surface); border-radius: 6px; overflow: hidden; }
.plan-run-workout-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; cursor: pointer; }
.plan-run-workout-sub { font-size: 10px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }
.plan-run-sessions { padding: 0 10px 8px; display: flex; flex-direction: column; gap: 6px; }
.plan-run-session-row { display: flex; align-items: flex-start; gap: 8px; padding-top: 6px; border-top: 1px dashed var(--border); }
.plan-run-session-main { flex: 1; min-width: 0; }
.plan-run-session-title { font-size: 12px; font-weight: 600; }
.plan-run-session-sub { font-size: 10px; color: var(--text-dim); margin-top: 2px; line-height: 1.4; }
.bonus-card { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.bonus-card-icon { width: 44px; height: 44px; background: rgba(212,169,78,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.level-card { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.level-dumbbell { position: relative; flex-shrink: 0; }
.level-dumbbell-label { position: absolute; bottom: -4px; left: 0; right: 0; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-dim); }
.level-card-info { flex: 1; }
.level-card-num { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 600; color: var(--accent); }
.level-card-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
.bonus-card-num { font-family: 'Oswald', sans-serif; font-size: 24px; color: var(--gold); }
.bonus-card-label { font-size: 12px; color: var(--text-dim); }
.bonus-card-note { margin-left: auto; font-size: 10px; color: var(--text-dim); max-width: 140px; text-align: right; line-height: 1.5; }
.summary-stats { display: flex; flex-direction: column; gap: 10px; }
.summary-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-dim); }
.summary-row svg { color: var(--accent); flex-shrink: 0; }
.summary-desc { flex: 1; }
.summary-value { font-family: 'JetBrains Mono', monospace; color: var(--text); font-weight: 600; white-space: nowrap; }
.summary-unit { font-family: 'Inter', sans-serif; font-weight: 400; color: var(--text-dim); }

.reminders-card { display: flex; flex-direction: column; gap: 8px; }
.reminder-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-dim); }
.reminder-item svg { color: var(--accent); flex-shrink: 0; }
.log-list { display: flex; flex-direction: column; gap: 8px; }
.log-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.log-row-date { font-size: 10px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
.log-row-text { font-size: 13px; line-height: 1.4; }

.tab-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; display: flex; background: var(--surface); border-top: 1px solid var(--border); padding: 8px 4px calc(8px + env(safe-area-inset-bottom)); z-index: 20; }
.tab-bar-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; background: transparent; border: none; color: var(--text-dim); padding: 6px 2px; cursor: pointer; font-size: 10px; font-family: 'Inter', sans-serif; }
.tab-bar-btn.active { color: var(--accent); }

@media (max-width: 380px) { .skip-reasons { grid-template-columns: repeat(2, 1fr); } }
`;
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();
