(() => {
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const {
    useState,
    useEffect,
    useMemo
  } = React;
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
    ChevronLeft,
    Minus,
    Copy,
    PauseIcon,
    SkipForwardIcon,
    Volume2,
    VolumeX
  } = window;
  const SimpleLineChart = window.SimpleLineChart;

  /* ============================================================
     SEED DATA — derived from Workout_Guide.xlsx, restructured
     Hierarchy: Plan -> Workout -> Session -> Exercise instance
     ============================================================ */

  function mkWeightEntry(gearId, weight, count) {
    return {
      id: uid("we"),
      gearId: gearId || null,
      weight,
      count: count || 1
    };
  }
  function variantTotalWeight(variant) {
    return (variant.weightEntries || []).reduce((sum, e) => sum + e.weight * e.count, 0);
  }
  function fmtWeightEntries(weightEntries) {
    if (!weightEntries || weightEntries.length === 0) return "0lb";
    return weightEntries.map(e => e.count > 1 ? `${e.count}×${e.weight}` : `${e.weight}`).join(" + ") + "lb";
  }
  // Weight-entry names are now derived live from Gear items via gearId, rather
  // than stored redundantly on the entry itself. Historical results still carry
  // a "gearName" snapshot (captured at completion time) so History stays
  // accurate even if a gear item is later renamed or removed.
  function fmtWeightNames(weightEntries, gearMap) {
    const names = (weightEntries || []).map(e => e.gearName || gearMap && gearMap[e.gearId]?.name || "").filter(Boolean);
    if (names.length === 0) return "";
    return [...new Set(names)].join(", ");
  }
  function roundToFive(n) {
    return Math.max(5, Math.round(n / 5) * 5);
  }
  function mkVariants(balReps, balWeight, buildReps, buildWeight, gearId) {
    return [{
      id: "v_balancing",
      label: "Balancing",
      reps: roundToFive(balReps),
      weightEntries: [mkWeightEntry(gearId, balWeight, 1)],
      default: true
    }, {
      id: "v_building",
      label: "Building",
      reps: roundToFive(buildReps),
      weightEntries: [mkWeightEntry(gearId, buildWeight, 1)],
      default: false
    }];
  }
  // Requirement strings in the old data model described equipment as a whole
  // (e.g. "Bench, 2× Dumbbell"). Each weight entry now owns its own name instead;
  // since most exercises here carry a single weight entry, only the LAST
  // comma-separated part (the actual weight-bearing equipment) becomes that
  // entry's name — earlier descriptive parts (Bench, Laying, Bar) don't map to
  // any weight and are dropped, matching how a mismatched part count resolves.
  function lastRequirementPart(requirement) {
    const parts = requirement.split(",").map(p => p.trim());
    return parts[parts.length - 1] || "";
  }
  const RAW_EXERCISES_BASE = [{
    name: "Laying Curl",
    requirement: "Bench, 2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Standard Curl",
    requirement: "2× Dumbbell",
    r: [12, 18, 16, 22]
  }, {
    name: "Overhand Curl",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Inward Curl",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Arm Bar Lift",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Milk Shakes",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Wirst Twist",
    requirement: "1× Cowbell",
    r: [10, 8, 13, 12]
  }, {
    name: "Overhead Lift",
    requirement: "1× Cowbell",
    r: [10, 8, 13, 12]
  }, {
    name: "Pendulum Lift",
    requirement: "1× Cowbell",
    r: [10, 8, 13, 12]
  }, {
    name: "Bench Press",
    requirement: "Bench, 2× Dumbbell",
    r: [8, 25, 10, 30]
  }, {
    name: "Christ Press",
    requirement: "Bench, 2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Rack Press",
    requirement: "Bench, 2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Wirst Curl",
    requirement: "Bench, 2× Dumbbell",
    r: [10, 13, 13, 17]
  }, {
    name: "Stationary March",
    requirement: "2× Ankle, 2× Dumbbell",
    r: [14, 8, 17, 12]
  }, {
    name: "Da Vinci Lift",
    requirement: "2× Dumbbell",
    r: [10, 13, 13, 17]
  }, {
    name: "Chicken Lift",
    requirement: "2× Dumbbell",
    r: [10, 13, 13, 17]
  }, {
    name: "Rowing Curls",
    requirement: "2× Dumbbell",
    r: [10, 13, 13, 17]
  }, {
    name: "Hydrolic Extension",
    requirement: "1× Cowbell",
    r: [10, 8, 13, 12]
  }, {
    name: "Sit Up",
    requirement: "Laying, 1× Dumbbell/Cowbell",
    r: [16, 4, 20, 8]
  }, {
    name: "Twist Up",
    requirement: "Laying, 1× Dumbbell/Cowbell",
    r: [16, 4, 20, 8]
  }, {
    name: "Push Up",
    requirement: "Laying",
    r: [15, 0, 20, 0]
  }, {
    name: "Hip Up",
    requirement: "Laying, 2× Ankle",
    r: [14, 5, 17, 8]
  }, {
    name: "Sprinter Block",
    requirement: "Laying, 2× Ankle",
    r: [14, 5, 17, 8]
  }, {
    name: "Air Bike",
    requirement: "Laying, 2× Ankle",
    r: [16, 5, 20, 8]
  }, {
    name: "Knee Up",
    requirement: "2× Ankle",
    r: [14, 5, 17, 8]
  }, {
    name: "Ninja Hops",
    requirement: "2× Ankle",
    r: [14, 5, 17, 8]
  }, {
    name: "Glute Bridges",
    requirement: "Laying",
    r: [14, 0, 17, 0]
  }, {
    name: "Marching Lunge",
    requirement: "2× Ankle, 1× Dumbbell/Cowbell",
    r: [10, 8, 13, 12]
  }, {
    name: "Standard Lunge",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Standard Squat",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Heel Lift",
    requirement: "2× Dumbbell",
    r: [14, 13, 17, 17]
  }, {
    name: "Spread Squat",
    requirement: "1× Dumbbell/Cowbell",
    r: [10, 13, 13, 17]
  }, {
    name: "Side Squats",
    requirement: "1× Dumbbell/Cowbell",
    r: [10, 13, 13, 17]
  }, {
    name: "Crouch Walk",
    requirement: "2× Ankle",
    r: [10, 5, 13, 8]
  }, {
    name: "Split Kick",
    requirement: "2× Ankle",
    r: [10, 5, 13, 8]
  }, {
    name: "Donkey Kick",
    requirement: "Laying, 2× Ankle",
    r: [10, 5, 13, 8]
  }, {
    name: "Leg Lift",
    requirement: "Laying, 2× Ankle",
    r: [10, 5, 13, 8]
  }, {
    name: 'Sitting "L" Lift',
    requirement: "Bar, 2× Ankle",
    r: [10, 5, 13, 8]
  }, {
    name: "Frog Lift",
    requirement: "Bar, 2× Ankle",
    r: [10, 5, 13, 8]
  }, {
    name: "Butt Kicker",
    requirement: "2× Ankle",
    r: [14, 5, 17, 8]
  }];
  const BONUS_DEFS = [{
    name: "Standing Press",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "RDL",
    requirement: "2× Dumbbell",
    r: [10, 18, 13, 22]
  }, {
    name: "Core Punches",
    requirement: "2× Dumbbell",
    r: [20, 8, 25, 12]
  }];

  // Build the initial Gear roster from the unique equipment names implied by the
  // original requirement strings, seeding each gear item's weight list with every
  // distinct weight value any seed exercise actually uses it at.
  const ALL_SEED_EXERCISES = [...RAW_EXERCISES_BASE, ...BONUS_DEFS];
  const gearNameToWeights = {};
  ALL_SEED_EXERCISES.forEach(e => {
    const gearName = lastRequirementPart(e.requirement);
    if (!gearName) return;
    if (!gearNameToWeights[gearName]) gearNameToWeights[gearName] = new Set();
    gearNameToWeights[gearName].add(e.r[1]); // balancing weight
    gearNameToWeights[gearName].add(e.r[3]); // building weight
  });
  const RAW_GEAR = Object.entries(gearNameToWeights).map(([name, weightSet]) => ({
    id: uid("gear"),
    name,
    weights: [...weightSet].sort((a, b) => a - b)
  }));
  const gearIdByName = Object.fromEntries(RAW_GEAR.map(g => [g.name, g.id]));
  // Fallback lookup used during migration: exercise name -> its seed gear name,
  // so built-in exercises can recover a gear link even if per-entry names were
  // already stripped by an earlier version of the migration.
  const SEED_GEAR_NAME_BY_EXERCISE = Object.fromEntries(ALL_SEED_EXERCISES.map(e => [e.name, lastRequirementPart(e.requirement)]));
  const RAW_EXERCISES = [...RAW_EXERCISES_BASE, ...BONUS_DEFS].map((e, i) => ({
    id: `ex_${i}`,
    name: e.name,
    isBonus: i >= RAW_EXERCISES_BASE.length,
    variants: mkVariants(...e.r, gearIdByName[lastRequirementPart(e.requirement)] || null)
  }));
  const byName = Object.fromEntries(RAW_EXERCISES.map(e => [e.name, e.id]));
  const idFor = n => byName[n] || null;

  // One Plan ("Weekly Rotation") containing 6 Workouts, each with sessions.
  // Fully editable afterward: plans, workouts, and sessions can all be added/removed/renamed.
  const WORKOUT_SEED = [{
    name: "Arms",
    bonusExName: "Standing Press",
    sessions: [{
      name: "Morning",
      exNames: ["Milk Shakes", "Pendulum Lift", "Wirst Twist"]
    }, {
      name: "Afternoon",
      exNames: ["Overhand Curl", "Inward Curl", "Arm Bar Lift", "Standard Curl", "Overhead Lift"]
    }, {
      name: "Night",
      exNames: ["Standard Curl", "Milk Shakes", "Bench Press", "Laying Curl", "Christ Press", "Rack Press", "Wirst Curl"]
    }]
  }, {
    name: "Legs",
    bonusExName: "RDL",
    sessions: [{
      name: "Morning",
      exNames: ["Standard Lunge", "Butt Kicker", "Glute Bridges"]
    }, {
      name: "Afternoon",
      exNames: ["Marching Lunge", "Standard Squat", "Donkey Kick", "Spread Squat", "Heel Lift"]
    }, {
      name: "Night",
      exNames: ["Split Kick", "Side Squats", "Marching Lunge", "Donkey Kick", 'Sitting "L" Lift', "Frog Lift", "Leg Lift"]
    }]
  }, {
    name: "Core",
    bonusExName: "Core Punches",
    sessions: [{
      name: "Morning",
      exNames: ["Twist Up", "Hip Up", "Stationary March"]
    }, {
      name: "Afternoon",
      exNames: ["Ninja Hops", "Twist Up", "Push Up", "Knee Up", "Hydrolic Extension"]
    }, {
      name: "Night",
      exNames: ["Sit Up", "Air Bike", "Sprinter Block", "Ninja Hops", "Da Vinci Lift", "Rowing Curls", "Chicken Lift"]
    }]
  }, {
    name: "Arms II",
    bonusExName: "Standing Press",
    sessions: [{
      name: "Morning",
      exNames: ["Milk Shakes", "Pendulum Lift", "Wirst Twist"]
    }, {
      name: "Afternoon",
      exNames: ["Overhead Lift", "Inward Curl", "Arm Bar Lift", "Standard Curl", "Overhand Curl"]
    }, {
      name: "Night",
      exNames: ["Overhand Curl", "Laying Curl", "Overhead Lift", "Bench Press", "Christ Press", "Rack Press", "Wirst Curl"]
    }]
  }, {
    name: "Legs II",
    bonusExName: "RDL",
    sessions: [{
      name: "Morning",
      exNames: ["Standard Lunge", "Butt Kicker", "Glute Bridges"]
    }, {
      name: "Afternoon",
      exNames: ["Marching Lunge", "Standard Squat", "Donkey Kick", "Spread Squat", "Standard Lunge"]
    }, {
      name: "Night",
      exNames: ["Standard Squat", "Split Kick", "Heel Lift", "Side Squats", 'Sitting "L" Lift', "Frog Lift", "Leg Lift"]
    }]
  }, {
    name: "Core II",
    bonusExName: "Core Punches",
    sessions: [{
      name: "Morning",
      exNames: ["Twist Up", "Hip Up", "Stationary March"]
    }, {
      name: "Afternoon",
      exNames: ["Rowing Curls", "Chicken Lift", "Push Up", "Sit Up", "Hydrolic Extension"]
    }, {
      name: "Night",
      exNames: ["Knee Up", "Air Bike", "Sprinter Block", "Ninja Hops", "Da Vinci Lift", "Chicken Lift", "Push Up"]
    }]
  }];
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

  // ============================================================
  // AUDIO PLAYER — a module-level singleton, kept outside React state since it
  // holds live File/Audio objects that can't be serialized into saved state.
  // Browsers require a real user gesture to open a file picker and to start
  // playback, so nothing here can be triggered automatically on app load —
  // the closest to "invisible" is a single tap that both re-imports files (by
  // matching filenames against previously enabled tracks) and starts playing.
  // ============================================================
  const audioPlayer = (() => {
    let fileByName = new Map(); // track name -> File (in-memory only, cleared on reload)
    let audioEl = null;
    let queue = [];
    let queueIndex = -1;
    let listeners = new Set();
    let muted = false;
    let volume = 1;
    function notify() {
      listeners.forEach(fn => fn(getStatus()));
    }
    function getStatus() {
      return {
        hasFiles: fileByName.size > 0,
        isPlaying: !!audioEl && !audioEl.paused,
        currentName: queueIndex >= 0 && queue[queueIndex] ? queue[queueIndex] : null,
        muted,
        volume
      };
    }
    function subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
    function importFiles(fileList) {
      Array.from(fileList).forEach(f => fileByName.set(f.name, f));
      notify();
      return Array.from(fileList).map(f => f.name);
    }
    // Rebuilds the queue from scratch against the CURRENT list of enabled track
    // names every time it's called (never reuses a stale queue), so tracks that
    // have been turned off or deleted since the last build are dropped
    // immediately. If the track that's currently loaded is still enabled and
    // available, it's kept in place so playback isn't interrupted.
    function buildQueue(enabledNames) {
      const uniqueNames = Array.from(new Set(enabledNames));
      const available = uniqueNames.filter(n => fileByName.has(n));
      const currentName = queueIndex >= 0 ? queue[queueIndex] : null;
      let shuffled = [...available];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      if (currentName && shuffled.includes(currentName)) {
        queue = [currentName, ...shuffled.filter(n => n !== currentName)];
        queueIndex = 0;
      } else {
        queue = shuffled;
        queueIndex = -1;
      }
    }
    // Searches for the given (enabled) track names among the files currently
    // held in memory, without touching playback. Returns which ones were
    // found vs. couldn't be found, plus whether we have ANY file data at all
    // (used to decide whether it's worth prompting for a re-import).
    function search(enabledNames) {
      const uniqueNames = Array.from(new Set(enabledNames));
      return {
        found: uniqueNames.filter(n => fileByName.has(n)),
        notFound: uniqueNames.filter(n => !fileByName.has(n)),
        hadAnyFiles: fileByName.size > 0
      };
    }
    // Loads the queue for the enabled tracks that are found, without starting
    // playback (browsers won't allow autoplay without a gesture anyway). Used
    // to get the player "loaded and ready" as soon as a session/plan starts.
    function prepare(enabledNames) {
      buildQueue(enabledNames);
      notify();
    }
    function ensureAudioEl() {
      if (!audioEl) {
        audioEl = new Audio();
        audioEl.muted = muted;
        audioEl.volume = volume;
        audioEl.addEventListener("ended", () => next());
        audioEl.addEventListener("play", notify);
        audioEl.addEventListener("pause", notify);
      }
      return audioEl;
    }
    function playIndex(i) {
      if (i < 0 || i >= queue.length) {
        queueIndex = -1;
        notify();
        return;
      }
      queueIndex = i;
      const file = fileByName.get(queue[i]);
      if (!file) {
        next();
        return;
      }
      const el = ensureAudioEl();
      el.src = URL.createObjectURL(file);
      el.play().catch(() => {});
      notify();
    }
    function play(enabledNames) {
      // Always resync against the latest ON/available list — never trust a
      // previously-built queue, so removed/disabled tracks can't keep playing.
      buildQueue(enabledNames);
      if (queue.length === 0) {
        stopAndClearQueue();
        return;
      }
      if (queueIndex === -1) {
        playIndex(0);
        return;
      }
      const el = ensureAudioEl();
      el.play().catch(() => {});
      notify();
    }
    function pause() {
      if (audioEl) audioEl.pause();
      notify();
    }
    function next() {
      if (queue.length === 0) return;
      playIndex((queueIndex + 1) % queue.length);
    }
    function stopAndClearQueue() {
      if (audioEl) {
        audioEl.pause();
        audioEl.src = "";
      }
      queue = [];
      queueIndex = -1;
      notify();
    }
    // Fully scrubs a track's file data from memory (e.g. when the user deletes
    // it from the Tracks list) and removes any trace of it from the live
    // queue, so it can never be found or played again until re-imported.
    function removeFile(name) {
      fileByName.delete(name);
      const idx = queue.indexOf(name);
      if (idx === -1) {
        notify();
        return;
      }
      const wasCurrent = idx === queueIndex;
      const wasPlaying = wasCurrent && !!audioEl && !audioEl.paused;
      queue.splice(idx, 1);
      if (wasCurrent) {
        if (audioEl) {
          audioEl.pause();
          audioEl.src = "";
        }
        queueIndex = -1;
        if (wasPlaying && queue.length > 0) {
          playIndex(idx % queue.length);
        }
      } else if (idx < queueIndex) {
        queueIndex -= 1;
      }
      notify();
    }
    // Wipes everything — all cached file data plus whatever's queued/playing.
    // Used when the user resets all app data, so old tracks can't linger in
    // memory or keep playing after their metadata has been cleared.
    function clearAll() {
      if (audioEl) {
        audioEl.pause();
        audioEl.src = "";
      }
      fileByName.clear();
      queue = [];
      queueIndex = -1;
      notify();
    }
    function hasFile(name) {
      return fileByName.has(name);
    }
    function knownFileNames() {
      return Array.from(fileByName.keys());
    }
    function setMuted(v) {
      muted = !!v;
      if (audioEl) audioEl.muted = muted;
      notify();
    }
    function toggleMute() {
      setMuted(!muted);
    }
    function setVolume(v) {
      volume = Math.max(0, Math.min(1, v));
      if (audioEl) audioEl.volume = volume;
      notify();
    }
    return {
      subscribe,
      importFiles,
      search,
      prepare,
      play,
      pause,
      next,
      stopAndClearQueue,
      removeFile,
      clearAll,
      hasFile,
      knownFileNames,
      setMuted,
      toggleMute,
      setVolume,
      getStatus
    };
  })();
  function buildWorkoutsFrom(workoutSeedOrTemplate) {
    return workoutSeedOrTemplate.map(w => ({
      id: nextWorkoutId(),
      name: w.name,
      bonusExId: w.bonusExId !== undefined ? w.bonusExId : idFor(w.bonusExName),
      sessions: (w.sessions || []).map(s => ({
        id: nextSessId(),
        name: s.name,
        exercises: (s.exercises || (s.exNames || []).map(n => ({
          exId: idFor(n)
        }))).map(x => ({
          instId: nextInstId(),
          exId: x.exId
        })).filter(x => x.exId)
      }))
    }));
  }
  function buildWorkouts() {
    return buildWorkoutsFrom(WORKOUT_SEED);
  }
  function buildPlans() {
    return [{
      id: nextPlanId(),
      name: "Weekly Rotation",
      setsPerExercise: DEFAULT_SETS_PER_EXERCISE,
      workouts: buildWorkouts()
    }];
  }

  // Plans are templates. Starting a plan creates an independent "iteration" — a deep
  // copy of the template's current workout/session/exercise structure with entirely
  // fresh ids, so its own completion history never mixes with any other iteration of
  // the same plan (past or future).
  function createPlanIteration(plan, defaultVariantId) {
    return {
      id: uid("iter"),
      planId: plan.id,
      planName: plan.name,
      setsPerExercise: plan.setsPerExercise || DEFAULT_SETS_PER_EXERCISE,
      defaultVariantId,
      startedAt: new Date().toISOString(),
      workouts: buildWorkoutsFrom(plan.workouts)
    };
  }
  const SKIP_REASONS = [{
    id: "sick",
    label: "Sick",
    icon: ThermometerSun
  }, {
    id: "vacation",
    label: "Vacation",
    icon: Plane
  }, {
    id: "injury",
    label: "Injury",
    icon: AlertTriangle
  }, {
    id: "custom",
    label: "Other",
    icon: MessageSquare
  }];
  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Each configured exercise is performed in a number of sets per workout, defaulting
  // to 3 but overridable per-plan at creation time. The actual sets value used is
  // captured on the exercise result at completion time so historical totals stay
  // accurate even if the plan's setting changes later.
  const DEFAULT_SETS_PER_EXERCISE = 3;

  /* ============================================================
     STORAGE
     ============================================================ */

  const STORE_KEY = "workout-app-state-v4";
  const IDB_NAME = "ironlog-db";
  const IDB_STORE = "state";

  // IndexedDB is the durable layer: browsers (especially Chrome on Android)
  // treat localStorage as more evictable under storage pressure than
  // IndexedDB, which is the documented cause of installed-PWA data quietly
  // disappearing. We write to both and prefer IndexedDB on read, with
  // localStorage as a same-tab-speed fallback.
  function openIDB() {
    return new Promise(resolve => {
      if (typeof indexedDB === "undefined") {
        resolve(null);
        return;
      }
      try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = () => {
          req.result.createObjectStore(IDB_STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }
  async function idbGet(key) {
    const db = await openIDB();
    if (!db) return null;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(IDB_STORE, "readonly");
        const req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }
  async function idbSet(key, value) {
    const db = await openIDB();
    if (!db) return false;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(value, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }
  async function loadState() {
    let raw = null;
    try {
      raw = await idbGet(STORE_KEY);
    } catch (e) {}
    if (!raw) {
      try {
        raw = window.localStorage.getItem(STORE_KEY);
      } catch (e) {}
    }
    if (!raw) return null; // genuinely nothing saved anywhere yet
    try {
      return migrateState(JSON.parse(raw));
    } catch (e) {
      // Something's saved but we couldn't parse/migrate it. Never silently
      // discard it — keep the raw copy under a backup key so it's recoverable,
      // and surface the failure instead of letting the caller treat this as
      // "no data" (which would otherwise get immediately overwritten with a
      // blank default on the very next save).
      console.error("loadState: saved data failed to parse/migrate, preserving raw backup", e);
      try {
        window.localStorage.setItem(STORE_KEY + ".corrupt-backup." + Date.now(), raw);
      } catch (e2) {}
      throw e;
    }
  }
  async function saveState(state) {
    const json = JSON.stringify(state);
    try {
      window.localStorage.setItem(STORE_KEY, json);
    } catch (e) {
      console.error("localStorage save failed", e);
    }
    try {
      await idbSet(STORE_KEY, json);
    } catch (e) {
      console.error("indexedDB save failed", e);
    }
  }

  // Backfills any fields introduced after a user's save was created, and discards
  // fields whose meaning has since changed, so old saved data never crashes a
  // newer build of the app.
  function migrateVariant(v) {
    const reps = roundToFive(v.reps || 5);
    return {
      ...v,
      reps
    };
  }

  // Migrates exercises + weight entries from the pre-Gear model (each entry
  // carried its own free-text "name") into Gear-linked entries. Any distinct
  // name found (from saved data, or from the built-in seed lookup as a fallback
  // for exercises that already lost their name in an earlier migration) becomes
  // its own Gear item, seeded with whatever weight that entry was using.
  function migrateExercisesToGear(savedExercises, existingGear) {
    const gearByName = {};
    (existingGear || []).forEach(g => {
      gearByName[g.name] = g;
    });
    const ensureGear = (name, weight) => {
      if (!name) return null;
      if (!gearByName[name]) {
        gearByName[name] = {
          id: uid("gear"),
          name,
          weights: []
        };
      }
      const g = gearByName[name];
      if (typeof weight === "number" && !g.weights.includes(weight)) {
        g.weights = [...g.weights, weight].sort((a, b) => a - b);
      }
      return g.id;
    };
    const exercises = savedExercises.map(e => {
      const fallbackName = typeof e.requirement === "string" ? lastRequirementPart(e.requirement) : SEED_GEAR_NAME_BY_EXERCISE[e.name] || "";
      const {
        requirement,
        ...rest
      } = e;
      const variants = (e.variants || []).map(v => {
        const reps = roundToFive(v.reps || 5);
        const weightEntries = (v.weightEntries || []).map(we => {
          if (we.gearId) return we; // already migrated
          const name = we.name || fallbackName;
          const gearId = ensureGear(name, we.weight);
          const {
            name: _drop,
            ...weRest
          } = we;
          return {
            ...weRest,
            gearId
          };
        });
        return {
          ...v,
          reps,
          weightEntries
        };
      });
      return {
        ...rest,
        variants
      };
    });
    return {
      exercises,
      gear: Object.values(gearByName)
    };
  }
  function migrateState(saved) {
    const fresh = defaultState();
    const merged = {
      ...fresh,
      ...saved
    };
    const savedExercises = Array.isArray(saved.exercises) ? saved.exercises : fresh.exercises;
    const savedGear = Array.isArray(saved.gear) ? saved.gear : [];
    const {
      exercises,
      gear
    } = migrateExercisesToGear(savedExercises, savedGear);
    merged.exercises = exercises;
    merged.gear = gear;
    merged.plans = Array.isArray(saved.plans) ? saved.plans : fresh.plans;
    merged.planIterations = Array.isArray(saved.planIterations) ? saved.planIterations : [];
    merged.activeIterationId = saved.activeIterationId ?? null;
    merged.history = Array.isArray(saved.history) ? saved.history : [];
    merged.logs = Array.isArray(saved.logs) ? saved.logs : [];
    merged.bonusStars = typeof saved.bonusStars === "number" ? saved.bonusStars : 0;
    merged.level = typeof saved.level === "number" ? saved.level : 0;
    merged.awardedIterationBonus = saved.awardedIterationBonus && typeof saved.awardedIterationBonus === "object" ? saved.awardedIterationBonus : {};
    merged.awardedWorkoutBonus = saved.awardedWorkoutBonus && typeof saved.awardedWorkoutBonus === "object" ? saved.awardedWorkoutBonus : {};
    // exerciseRepRecords is now nested per weight: { exId: { weight: highestReps } }.
    // Migrate any old flat-number shape (exId -> number) forward by dropping it,
    // since it can't be mapped to a specific weight after the fact.
    const savedRepRecords = saved.exerciseRepRecords && typeof saved.exerciseRepRecords === "object" ? saved.exerciseRepRecords : {};
    merged.exerciseRepRecords = Object.fromEntries(Object.entries(savedRepRecords).filter(([, v]) => v && typeof v === "object" && !Array.isArray(v)));
    merged.awardedRepGainBonus = saved.awardedRepGainBonus && typeof saved.awardedRepGainBonus === "object" ? saved.awardedRepGainBonus : {};
    merged.tracks = Array.isArray(saved.tracks) ? saved.tracks : [];
    merged.activeWorkout = saved.activeWorkout || null;
    // If an in-progress workout references an iteration that no longer exists
    // (e.g. carried over from a pre-iteration save), drop it rather than crash later.
    if (merged.activeWorkout && !merged.planIterations.some(it => it.id === merged.activeWorkout.iterationId)) {
      merged.activeWorkout = null;
    }
    if (merged.activeIterationId && !merged.planIterations.some(it => it.id === merged.activeIterationId)) {
      merged.activeIterationId = null;
    }
    // Fields from earlier data models that no longer apply — drop them rather than
    // carry stale shapes forward.
    delete merged.activePlanId;
    delete merged.planVariantDefaults;
    delete merged.awardedPlanRuns;
    return merged;
  }
  function defaultState() {
    return {
      exercises: RAW_EXERCISES,
      gear: RAW_GEAR,
      // { id, name, weights: [w1, w2, ...] } — configured equipment and its available weights
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
      awardedWorkoutBonus: {},
      // "iterationId:workoutId" -> true, once that workout's bonus-exercise star has been granted
      exerciseRepRecords: {},
      // exId -> { [weight]: highest reps ever performed at that weight in a completed plan }
      awardedRepGainBonus: {},
      // "iterationId:exId:weight" -> true, once a rep-gain star has been granted for this exercise+weight in this iteration
      tracks: [] // { id, name, enabled } — audio track metadata only; actual file data lives in memory for the session and must be re-picked after a reload
    };
  }

  /* ============================================================
     PRIMITIVES
     ============================================================ */

  function Card({
    children,
    className = "",
    ...rest
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: `card ${className}`,
      ...rest
    }, children);
  }
  const SORT_OPTIONS_WITH_DURATION = [{
    id: "default",
    label: "Default"
  }, {
    id: "totalDurationAsc",
    label: "Total Duration (shortest first)"
  }, {
    id: "avgDurationAsc",
    label: "Avg Duration (shortest first)"
  }, {
    id: "weightDesc",
    label: "Weight (most first)"
  }, {
    id: "repsDesc",
    label: "Reps (most first)"
  }, {
    id: "weightPerRepDesc",
    label: "Weight/Rep (most first)"
  }, {
    id: "alpha",
    label: "Alphabetical (A-Z)"
  }];
  const SORT_OPTIONS_NO_DURATION = SORT_OPTIONS_WITH_DURATION.filter(o => !o.id.includes("Duration"));
  const SORT_OPTIONS_PLANS = [{
    id: "recency",
    label: "Recency (most recent first)"
  }, ...SORT_OPTIONS_WITH_DURATION.filter(o => o.id !== "default")];
  function sortStats(stats, sortId, originalOrder) {
    const arr = [...stats];
    switch (sortId) {
      case "totalDurationAsc":
        return arr.sort((a, b) => (a.totalDurationSec || 0) - (b.totalDurationSec || 0));
      case "avgDurationAsc":
        return arr.sort((a, b) => (a.avgDurationSec || 0) - (b.avgDurationSec || 0));
      case "weightDesc":
        return arr.sort((a, b) => (b.totalWeight || 0) - (a.totalWeight || 0));
      case "repsDesc":
        return arr.sort((a, b) => (b.totalReps || 0) - (a.totalReps || 0));
      case "weightPerRepDesc":
        return arr.sort((a, b) => {
          const wprA = a.totalReps ? a.totalWeight / a.totalReps : 0;
          const wprB = b.totalReps ? b.totalWeight / b.totalReps : 0;
          return wprB - wprA;
        });
      case "alpha":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return originalOrder ? arr.sort((a, b) => originalOrder.indexOf(a.name) - originalOrder.indexOf(b.name)) : arr;
    }
  }
  function SortSelect({
    value,
    onChange,
    options
  }) {
    return /*#__PURE__*/React.createElement("select", {
      className: "text-input sort-select",
      value: value,
      onChange: e => onChange(e.target.value)
    }, options.map(o => /*#__PURE__*/React.createElement("option", {
      key: o.id,
      value: o.id
    }, o.label)));
  }

  // A number input that shows an empty field while the user is actively typing
  // (rather than forcing a stray leading zero), but always resolves back to a
  // real number — defaulting to 0 — once the field loses focus or a value is
  // read elsewhere in the app.
  function NumberField({
    value,
    onChange,
    className = "",
    min,
    ...rest
  }) {
    const [text, setText] = useState(String(value ?? 0));
    useEffect(() => {
      // Keep in sync if the value changes from outside (e.g. loading saved data)
      // without fighting the user's in-progress keystrokes.
      if (Number(text) !== value && document.activeElement?.dataset?.numfieldSynced !== "false") {
        setText(String(value ?? 0));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return /*#__PURE__*/React.createElement("input", {
      className: `text-input ${className}`,
      type: "text",
      inputMode: "decimal",
      value: text,
      onChange: e => {
        let v = e.target.value;
        // Strip anything that isn't a digit or a single decimal point.
        v = v.replace(/[^0-9.]/g, "");
        // Collapse any leading zeros ("00", "05") down to a single digit,
        // unless it's "0." (typing a decimal like 0.5).
        if (/^0+[0-9]/.test(v)) v = v.replace(/^0+/, "");
        setText(v);
        const num = v === "" ? 0 : Number(v);
        if (!Number.isNaN(num)) onChange(min != null ? Math.max(min, num) : num);
      },
      onBlur: () => {
        if (text === "" || text === ".") setText("0");
      },
      ...rest
    });
  }
  function useAudioPlayerStatus() {
    const [status, setStatus] = useState(() => audioPlayer.getStatus());
    useEffect(() => audioPlayer.subscribe(setStatus), []);
    return status;
  }
  function SectionTitle({
    children,
    sub
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "section-title"
    }, /*#__PURE__*/React.createElement("h2", null, children), sub && /*#__PURE__*/React.createElement("p", null, sub));
  }
  function PlateStackRing({
    pct,
    size = 84
  }) {
    const plates = 6;
    const filled = Math.round(pct / 100 * plates);
    return /*#__PURE__*/React.createElement("div", {
      className: "plate-stack",
      style: {
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 100 100",
      width: size,
      height: size
    }, /*#__PURE__*/React.createElement("line", {
      x1: "50",
      y1: "8",
      x2: "50",
      y2: "92",
      stroke: "#3a3a3d",
      strokeWidth: "6",
      strokeLinecap: "round"
    }), Array.from({
      length: plates
    }).map((_, i) => {
      const y = 88 - i * 13;
      const isFilled = i < filled;
      const w = 46 - i * 1.5;
      return /*#__PURE__*/React.createElement("rect", {
        key: i,
        x: 50 - w / 2,
        y: y - 5,
        width: w,
        height: "10",
        rx: "2",
        fill: isFilled ? "var(--accent)" : "#2a2a2d",
        stroke: isFilled ? "var(--accent-dim)" : "#3a3a3d",
        strokeWidth: "1"
      });
    })), /*#__PURE__*/React.createElement("div", {
      className: "plate-stack-label"
    }, Math.round(pct), "%"));
  }
  const PLATE_WEIGHTS = [45, 25, 10, 5, 2.5, 1, 0.5];

  // Finds the plate combination for one side of the dumbbell that uses the FEWEST
  // DISTINCT plate sizes, tie-broken by fewest total plates. The level is the total
  // dumbbell weight (both sides combined, bar weightless), so each side carries
  // level/2. Small fixed plate set, so an exhaustive subset search is cheap.
  function bestPlatesForSide(target) {
    target = Math.round(target * 2) / 2; // snap to nearest 0.5
    if (target <= 0) return [];
    const n = PLATE_WEIGHTS.length;
    const targetKey = Math.round(target * 2);
    let best = null; // { distinct, count, sizes }

    for (let mask = 1; mask < 1 << n; mask++) {
      const sizes = [];
      for (let i = 0; i < n; i++) if (mask & 1 << i) sizes.push(PLATE_WEIGHTS[i]);
      const distinct = sizes.length;
      if (best && distinct > best.distinct) continue;
      const smallest = Math.min(...sizes);
      const maxPlates = Math.round(target / smallest) + 1;
      let frontier = new Map([[0, 0]]); // sum*2 -> plates used
      let foundAt = null;
      for (let plates = 1; plates <= maxPlates && !foundAt; plates++) {
        const next = new Map(frontier);
        for (const [sum, cnt] of frontier) {
          if (cnt !== plates - 1) continue;
          for (const w of sizes) {
            const newSum = sum + Math.round(w * 2);
            if (newSum > targetKey) continue;
            if (!next.has(newSum) || next.get(newSum) > plates) next.set(newSum, plates);
          }
        }
        frontier = next;
        if (frontier.get(targetKey) === plates) foundAt = plates;
      }
      if (foundAt == null) continue;
      if (!best || distinct < best.distinct || distinct === best.distinct && foundAt < best.count) {
        best = {
          distinct,
          count: foundAt,
          sizes
        };
      }
    }
    if (!best) return [];

    // Reconstruct one valid combo of best.sizes summing to target in best.count plates.
    let frontier = new Map([[0, []]]);
    for (let plates = 1; plates <= best.count; plates++) {
      const next = new Map();
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
  const PLATE_COLOR_BY_WEIGHT = {
    45: "#c4463a",
    // largest — bold accent red
    25: "#d4784e",
    // orange
    10: "#d4a94e",
    // gold
    5: "#5c8a6b",
    // green
    2.5: "#4e8fa8",
    // blue
    1: "#8f8a80",
    // neutral grey
    0.5: "#6b6660" // dim grey
  };
  function LevelDumbbell({
    level,
    size = 96
  }) {
    const plates = bestPlatesForSide(level / 2);
    const barLength = 44;
    const plateGap = 3;
    const plateHeightFor = w => 20 + Math.min(w, 45) * 0.9; // clearly distinct heights per weight tier
    const plateThicknessFor = w => 6 + Math.min(w, 45) * 0.35;
    let offset = 6; // gap from bar edge to first plate
    const renderedPlates = plates.map(w => {
      const height = plateHeightFor(w);
      const thickness = plateThicknessFor(w);
      const x = offset;
      offset += thickness + plateGap;
      return {
        w,
        x,
        height,
        thickness
      };
    });
    const sideSpan = offset; // total width used by plates on one side
    const maxPlateHeight = renderedPlates.length ? Math.max(...renderedPlates.map(p => p.height)) : 20;
    const viewW = barLength + sideSpan * 2 + 12;
    const viewH = Math.max(size, maxPlateHeight + 16);
    const centerX = viewW / 2;
    const centerY = viewH / 2;
    return /*#__PURE__*/React.createElement("div", {
      className: "level-dumbbell",
      style: {
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${viewW} ${viewH}`,
      width: size,
      height: size,
      preserveAspectRatio: "xMidYMid meet"
    }, /*#__PURE__*/React.createElement("rect", {
      x: centerX - barLength / 2,
      y: centerY - 3,
      width: barLength,
      height: "6",
      rx: "3",
      fill: "#8f8a80"
    }), renderedPlates.map((p, i) => /*#__PURE__*/React.createElement("g", {
      key: `plate-${i}`
    }, /*#__PURE__*/React.createElement("rect", {
      x: centerX - barLength / 2 - p.x - p.thickness,
      y: centerY - p.height / 2,
      width: p.thickness,
      height: p.height,
      rx: "2",
      fill: PLATE_COLOR_BY_WEIGHT[p.w] || "var(--accent)",
      stroke: "#00000033",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: centerX + barLength / 2 + p.x,
      y: centerY - p.height / 2,
      width: p.thickness,
      height: p.height,
      rx: "2",
      fill: PLATE_COLOR_BY_WEIGHT[p.w] || "var(--accent)",
      stroke: "#00000033",
      strokeWidth: "1"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "level-dumbbell-label"
    }, "Lvl ", level));
  }
  function fmtDuration(sec) {
    const m = Math.floor(sec / 60),
      s = sec % 60;
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

  // Plan/Challenge/Workout durations are each expressed at their own natural
  // scale — primary unit plus its direct subunit only (days+hours, hours+minutes,
  // minutes+seconds respectively) — computed from real wall-clock elapsed time.
  function fmtPlanDuration(sec) {
    const totalHours = Math.floor(sec / 3600);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days}d ${hours}h`;
  }
  function fmtChallengeDuration(sec) {
    const totalMinutes = Math.floor(sec / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
  function fmtWorkoutDuration(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}m ${seconds}s`;
  }

  // A "workout" event's own duration is simply its recorded start-to-finish time.
  function workoutDurationSec(record) {
    return record.durationSec || 0;
  }
  // A challenge's (or plan's) duration spans from the earliest workout-start
  // timestamp among the given records to the latest completion timestamp —
  // real wall-clock elapsed time, not a sum of individual workout durations.
  function spanDurationSec(records) {
    const completed = records.filter(r => r.status === "completed" && r.startedAt && r.date);
    if (completed.length === 0) return 0;
    const starts = completed.map(r => new Date(r.startedAt).getTime());
    const ends = completed.map(r => new Date(r.date).getTime());
    const earliestStart = Math.min(...starts);
    const latestEnd = Math.max(...ends);
    return Math.max(0, Math.floor((latestEnd - earliestStart) / 1000));
  }
  function mondayOf(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
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
    return `${d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    })} · ${d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit"
    })}`;
  }

  // Derives "plan runs" from session-level history: a run is one full pass through
  // every workout/session slot of a plan (matched by name). Runs are grouped by
  // plan name so edited/recreated plans with the same name still bucket together.
  function derivePlanGroups(state) {
    const byPlanName = {};
    state.planIterations.forEach(iter => {
      if (!byPlanName[iter.planName]) byPlanName[iter.planName] = [];
      byPlanName[iter.planName].push(iter);
    });
    const groups = Object.entries(byPlanName).map(([planName, iterations]) => {
      const sortedIterations = [...iterations].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
      const buildRunSummary = iter => {
        const records = state.history.filter(h => h.iterationId === iter.id);
        const completedRecords = records.filter(r => r.status === "completed");
        const skippedRecords = records.filter(r => r.status === "skipped");
        // A plan's duration is real wall-clock elapsed time: earliest workout-start
        // to latest workout-completion within this iteration — not a sum of each
        // workout's own duration.
        const totalDurationSec = spanDurationSec(completedRecords);
        const totalWeight = completedRecords.reduce((sum, r) => sum + sessionTotalWeight(r), 0);
        const totalReps = completedRecords.reduce((sum, r) => sum + sessionTotalReps(r), 0);
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        const startDate = sorted[0]?.date || iter.startedAt;
        const endDate = sorted[sorted.length - 1]?.date;
        const isResolved = sessId => records.some(h => h.sessionId === sessId && (h.status === "completed" || h.status === "skipped"));
        const isComplete = iter.workouts.length > 0 && iter.workouts.every(w => w.sessions.length > 0 && w.sessions.every(sess => isResolved(sess.id)));

        // Group records by workout for the breakdown view — walk the iteration's own
        // structure so unresolved workouts/sessions still show up as "not yet done".
        // Each workout (challenge) also gets its own span duration: earliest
        // workout-start to latest completion among just its own sessions.
        const workouts = iter.workouts.map(w => {
          const sessions = w.sessions.map(sess => {
            const rec = records.find(r => r.sessionId === sess.id);
            return rec ? rec : {
              id: uid("pending"),
              sessionId: sess.id,
              sessionName: sess.name,
              status: "pending"
            };
          });
          const workoutCompletedSessions = sessions.filter(r => r.status === "completed");
          return {
            workoutId: w.id,
            workoutName: w.name,
            sessions,
            durationSec: spanDurationSec(workoutCompletedSessions)
          };
        });
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
      const fullyCompletedRuns = runSummaries.filter(r => !r.isPartial);
      const avgDuration = fullyCompletedRuns.length ? fullyCompletedRuns.reduce((sum, r) => sum + r.totalDurationSec, 0) / fullyCompletedRuns.length : 0;
      const totalWeightAcrossRuns = runSummaries.reduce((sum, r) => sum + r.totalWeight, 0);
      const totalRepsAcrossRuns = runSummaries.reduce((sum, r) => sum + r.totalReps, 0);
      const totalDurationAcrossRuns = fullyCompletedRuns.reduce((sum, r) => sum + r.totalDurationSec, 0);
      return {
        planName,
        timesCompleted: fullyCompletedRuns.length,
        avgDurationSec: avgDuration,
        totalDurationSec: totalDurationAcrossRuns,
        totalWeight: totalWeightAcrossRuns,
        totalReps: totalRepsAcrossRuns,
        runs: runSummaries
      };
    });
    return groups.sort((a, b) => b.timesCompleted - a.timesCompleted);
  }

  /* ============================================================
     WORKOUTS PAGE (formerly "Today")
     ============================================================ */

  function WorkoutsView({
    state,
    setState,
    onViewPlanHistory
  }) {
    const exMap = useMemo(() => Object.fromEntries(state.exercises.map(e => [e.id, e])), [state.exercises]);
    const gearMap = useMemo(() => Object.fromEntries((state.gear || []).map(g => [g.id, g])), [state.gear]);
    const active = state.activeWorkout;
    const [pendingPlanId, setPendingPlanId] = useState(null); // plan template selected but not yet started
    const [pendingDefaultVariant, setPendingDefaultVariant] = useState("v_balancing");
    const [focusedWorkoutId, setFocusedWorkoutId] = useState(null); // workout being viewed/started within active iteration
    const [focusedSessionId, setFocusedSessionId] = useState(null); // session being viewed/configured
    const [selection, setSelection] = useState({});
    const [includedBonus, setIncludedBonus] = useState(null);
    const [skipTarget, setSkipTarget] = useState(false);
    const [skipNote, setSkipNote] = useState("");
    const sessionCompletedCount = sessId => state.history.filter(h => h.status === "completed" && h.sessionId === sessId).length;
    const sessionSkippedCount = sessId => state.history.filter(h => h.status === "skipped" && h.sessionId === sessId).length;
    const isSessionResolved = sessId => sessionCompletedCount(sessId) > 0 || sessionSkippedCount(sessId) > 0;
    const isWorkoutComplete = w => w.sessions.length > 0 && w.sessions.every(s => isSessionResolved(s.id));
    const isIterationComplete = iter => iter.workouts.length > 0 && iter.workouts.every(w => isWorkoutComplete(w));

    // A plan template is "completed" if any of its past iterations completed fully.
    const hasCompletedIteration = planId => state.planIterations.some(iter => iter.planId === planId && isIterationComplete(iter));
    const activeIteration = state.planIterations.find(it => it.id === state.activeIterationId) || null;
    const focusedWorkout = activeIteration?.workouts.find(w => w.id === focusedWorkoutId) || null;
    const focusedSession = focusedWorkout?.sessions.find(s => s.id === focusedSessionId) || null;

    // Seed per-exercise variant selection whenever the focused session changes, defaulting
    // to the iteration's chosen Balancing/Building variant (falling back to each exercise's
    // own default variant if it doesn't have one with that label).
    useEffect(() => {
      if (!focusedSession || !activeIteration) return;
      const planDefaultLabel = activeIteration.defaultVariantId === "v_building" ? "Building" : "Balancing";
      const m = {};
      focusedSession.exercises.forEach(inst => {
        const ex = exMap[inst.exId];
        const matching = ex?.variants.find(v => v.label === planDefaultLabel);
        const fallback = ex?.variants.find(v => v.default) || ex?.variants[0];
        m[inst.instId] = (matching || fallback)?.id;
      });
      setSelection(m);
      setIncludedBonus(null);
    }, [focusedSessionId, activeIteration?.id]);
    if (active) {
      return /*#__PURE__*/React.createElement(ActiveSessionView, {
        state: state,
        setState: setState,
        exMap: exMap
      });
    }
    const startPlan = () => {
      const plan = state.plans.find(p => p.id === pendingPlanId);
      if (!plan) return;
      const iteration = createPlanIteration(plan, pendingDefaultVariant);
      setState(s => ({
        ...s,
        planIterations: [...s.planIterations, iteration],
        activeIterationId: iteration.id
      }));
      setPendingPlanId(null);
    };
    const startSession = () => {
      if (!focusedSession || !focusedWorkout || !activeIteration) return;
      const exIds = focusedSession.exercises.map(inst => ({
        instId: inst.instId,
        exId: inst.exId,
        variantId: selection[inst.instId]
      }));
      if (includedBonus) {
        const planDefaultLabel = activeIteration.defaultVariantId === "v_building" ? "Building" : "Balancing";
        const bonusEx = exMap[includedBonus];
        const matching = bonusEx?.variants.find(v => v.label === planDefaultLabel);
        const fallback = bonusEx?.variants.find(v => v.default) || bonusEx?.variants[0];
        const bonusVariantId = (matching || fallback)?.id;
        exIds.push({
          instId: uid("instbonus"),
          exId: includedBonus,
          variantId: bonusVariantId,
          isBonus: true
        });
      }
      setState(s => ({
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
        date: new Date().toISOString(),
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
      setState(s => {
        const newHistory = [record, ...s.history];
        const isResolvedAfter = sessId => newHistory.some(h => h.sessionId === sessId && (h.status === "completed" || h.status === "skipped"));
        const iterNowComplete = activeIteration.workouts.length > 0 && activeIteration.workouts.every(w => w.sessions.length > 0 && w.sessions.every(sess => isResolvedAfter(sess.id)));
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
    const bonusExDisplayVariant = (() => {
      if (!bonusEx || !activeIteration) return null;
      const planDefaultLabel = activeIteration.defaultVariantId === "v_building" ? "Building" : "Balancing";
      return bonusEx.variants.find(v => v.label === planDefaultLabel) || bonusEx.variants.find(v => v.default) || bonusEx.variants[0];
    })();
    const workoutBonusAlreadyDone = focusedWorkout ? state.history.some(h => h.status === "completed" && h.workoutId === focusedWorkout.id && h.bonusExId) : false;

    // ---- View 1: no active iteration — pick a plan to start ----
    if (!activeIteration) {
      return /*#__PURE__*/React.createElement("div", {
        className: "view-pad"
      }, /*#__PURE__*/React.createElement(SectionTitle, {
        sub: "Choose a plan to start"
      }, "Plans"), state.plans.length === 0 ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
        className: "empty-state"
      }, /*#__PURE__*/React.createElement(Target, {
        size: 28,
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("p", null, "No plans yet — create one in Craft."))) : /*#__PURE__*/React.createElement("div", {
        className: "plan-pick-list"
      }, state.plans.map(p => {
        const completedBefore = hasCompletedIteration(p.id);
        return /*#__PURE__*/React.createElement(Card, {
          key: p.id,
          className: `plan-pick-card ${pendingPlanId === p.id ? "selected" : ""}`,
          onClick: () => setPendingPlanId(pendingPlanId === p.id ? null : p.id)
        }, /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-row"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-name"
        }, p.name), /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-sub"
        }, p.workouts.length, " challenge", p.workouts.length !== 1 ? "s" : "")), completedBefore && /*#__PURE__*/React.createElement("button", {
          className: "badge badge-done badge-link",
          onClick: e => {
            e.stopPropagation();
            onViewPlanHistory && onViewPlanHistory(p.name);
          },
          title: "View completed results in History"
        }, /*#__PURE__*/React.createElement(Check, {
          size: 12
        }), " Completed ", /*#__PURE__*/React.createElement(ChevronRight, {
          size: 12
        }))), pendingPlanId === p.id && /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-expand",
          onClick: e => e.stopPropagation()
        }, /*#__PURE__*/React.createElement("div", {
          className: "variant-manager-label"
        }, "Default variant for this plan"), /*#__PURE__*/React.createElement("div", {
          className: "variant-chip-row"
        }, /*#__PURE__*/React.createElement("button", {
          className: `variant-chip ${pendingDefaultVariant === "v_balancing" ? "active" : ""}`,
          onClick: () => setPendingDefaultVariant("v_balancing")
        }, "Balancing"), /*#__PURE__*/React.createElement("button", {
          className: `variant-chip ${pendingDefaultVariant === "v_building" ? "active" : ""}`,
          onClick: () => setPendingDefaultVariant("v_building")
        }, "Building")), /*#__PURE__*/React.createElement("button", {
          className: "btn btn-primary btn-block",
          style: {
            marginTop: 12
          },
          onClick: startPlan
        }, /*#__PURE__*/React.createElement(Play, {
          size: 14
        }), " ", completedBefore ? "Next Plan" : "Start Plan")));
      })));
    }

    // ---- View 2: iteration active, no workout focused yet — pick a workout ----
    if (!focusedWorkout) {
      return /*#__PURE__*/React.createElement("div", {
        className: "view-pad"
      }, /*#__PURE__*/React.createElement(SectionTitle, {
        sub: activeIteration.planName
      }, "Challenges"), /*#__PURE__*/React.createElement("div", {
        className: "workout-pick-list"
      }, activeIteration.workouts.map(w => {
        const complete = isWorkoutComplete(w);
        const doneCount = w.sessions.filter(s => isSessionResolved(s.id)).length;
        return /*#__PURE__*/React.createElement(Card, {
          key: w.id,
          className: "workout-pick-card",
          onClick: () => setFocusedWorkoutId(w.id)
        }, /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-row"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-name"
        }, w.name), /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-sub"
        }, doneCount, "/", w.sessions.length, " workouts done")), complete ? /*#__PURE__*/React.createElement("div", {
          className: "badge badge-done"
        }, /*#__PURE__*/React.createElement(Check, {
          size: 12
        }), " Completed") : /*#__PURE__*/React.createElement(ChevronRight, {
          size: 18,
          className: "chevron-affordance"
        })));
      }), activeIteration.workouts.length === 0 && /*#__PURE__*/React.createElement("span", {
        className: "empty-inline"
      }, "No challenges in this plan yet.")));
    }

    // ---- View 3: workout focused, no session focused yet — pick a session ----
    if (!focusedSession) {
      const workoutComplete = isWorkoutComplete(focusedWorkout);
      return /*#__PURE__*/React.createElement("div", {
        className: "view-pad"
      }, /*#__PURE__*/React.createElement("button", {
        className: "back-link",
        onClick: () => setFocusedWorkoutId(null)
      }, /*#__PURE__*/React.createElement(ChevronLeft, {
        size: 14
      }), " ", activeIteration.planName), /*#__PURE__*/React.createElement(SectionTitle, {
        sub: workoutComplete ? "Completed" : "Choose a session"
      }, focusedWorkout.name), /*#__PURE__*/React.createElement("div", {
        className: "workout-pick-list"
      }, focusedWorkout.sessions.map(s => {
        const resolved = isSessionResolved(s.id);
        const wasSkipped = sessionSkippedCount(s.id) > 0 && sessionCompletedCount(s.id) === 0;
        return /*#__PURE__*/React.createElement(Card, {
          key: s.id,
          className: "workout-pick-card",
          onClick: () => setFocusedSessionId(s.id)
        }, /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-row"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-name"
        }, s.name), /*#__PURE__*/React.createElement("div", {
          className: "plan-pick-sub"
        }, s.exercises.length, " exercise", s.exercises.length !== 1 ? "s" : "")), resolved ? /*#__PURE__*/React.createElement("div", {
          className: `badge ${wasSkipped ? "badge-skipped" : "badge-done"}`
        }, wasSkipped ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(X, {
          size: 12
        }), " Skipped") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
          size: 12
        }), " Completed")) : /*#__PURE__*/React.createElement(ChevronRight, {
          size: 18,
          className: "chevron-affordance"
        })));
      }), focusedWorkout.sessions.length === 0 && /*#__PURE__*/React.createElement("span", {
        className: "empty-inline"
      }, "No workouts in this challenge yet.")));
    }

    // ---- View 4: session focused — review (if resolved) or configure+start ----
    const sessionResolved = isSessionResolved(focusedSession.id);
    return /*#__PURE__*/React.createElement("div", {
      className: "view-pad"
    }, /*#__PURE__*/React.createElement("button", {
      className: "back-link",
      onClick: () => setFocusedSessionId(null)
    }, /*#__PURE__*/React.createElement(ChevronLeft, {
      size: 14
    }), " ", focusedWorkout.name), sessionResolved ? (() => {
      const record = state.history.find(h => h.sessionId === focusedSession.id);
      if (!record) return null;
      if (record.status === "skipped") {
        return /*#__PURE__*/React.createElement(Card, {
          className: "setup-card"
        }, /*#__PURE__*/React.createElement("div", {
          className: "results-header"
        }, /*#__PURE__*/React.createElement("span", {
          className: "eyebrow"
        }, activeIteration.planName, " · ", focusedWorkout.name, " · ", focusedSession.name), /*#__PURE__*/React.createElement("h3", null, "Skipped")), /*#__PURE__*/React.createElement("div", {
          className: "results-skip-note"
        }, record.skipReason, record.skipNote ? ` — ${record.skipNote}` : ""));
      }
      const totalWeight = sessionTotalWeight(record);
      const totalReps = sessionTotalReps(record);
      return /*#__PURE__*/React.createElement(Card, {
        className: "setup-card"
      }, /*#__PURE__*/React.createElement("div", {
        className: "results-header"
      }, /*#__PURE__*/React.createElement("span", {
        className: "eyebrow"
      }, activeIteration.planName, " · ", focusedWorkout.name, " · ", focusedSession.name), /*#__PURE__*/React.createElement("h3", null, "Workout Results")), /*#__PURE__*/React.createElement("div", {
        className: "results-summary-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "results-summary-stat"
      }, /*#__PURE__*/React.createElement("div", {
        className: "results-summary-num"
      }, fmtWorkoutDuration(record.durationSec)), /*#__PURE__*/React.createElement("div", {
        className: "results-summary-label"
      }, "Time")), /*#__PURE__*/React.createElement("div", {
        className: "results-summary-stat"
      }, /*#__PURE__*/React.createElement("div", {
        className: "results-summary-num accent"
      }, totalWeight.toLocaleString(), " lb"), /*#__PURE__*/React.createElement("div", {
        className: "results-summary-label"
      }, "Total Weight")), /*#__PURE__*/React.createElement("div", {
        className: "results-summary-stat"
      }, /*#__PURE__*/React.createElement("div", {
        className: "results-summary-num accent"
      }, totalReps.toLocaleString()), /*#__PURE__*/React.createElement("div", {
        className: "results-summary-label"
      }, "Total Reps"))), /*#__PURE__*/React.createElement("div", {
        className: "results-exercise-list"
      }, (record.exercises || []).map(e => /*#__PURE__*/React.createElement("div", {
        key: e.instId,
        className: "results-exercise-row"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "exercise-row-name"
      }, e.name, " ", e.isBonus && /*#__PURE__*/React.createElement("span", {
        className: "bonus-tag"
      }, "Bonus")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-row-req"
      }, fmtWeightNames(e.weightEntries), " · ", e.sets || DEFAULT_SETS_PER_EXERCISE, " sets · ", fmtWeightEntries(e.weightEntries))), /*#__PURE__*/React.createElement("div", {
        className: "exercise-target"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-target-num"
      }, e.reps, " reps/set"), /*#__PURE__*/React.createElement("div", {
        className: "exercise-target-total"
      }, exResultWeight(e).toLocaleString(), " lb · ", exResultReps(e), " reps"))))));
    })() : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      sub: `${activeIteration.planName} · ${focusedWorkout.name} · ${activeIteration.setsPerExercise || DEFAULT_SETS_PER_EXERCISE} sets per exercise`
    }, focusedSession.name), focusedSession.exercises.length === 0 ? /*#__PURE__*/React.createElement(Card, {
      className: "setup-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-state"
    }, /*#__PURE__*/React.createElement("p", null, "No exercises in this workout yet. Add some in Craft."))) : /*#__PURE__*/React.createElement("div", {
      className: "setup-exercise-list"
    }, focusedSession.exercises.map(inst => {
      const ex = exMap[inst.exId];
      if (!ex) return null;
      const chosenVariantId = selection[inst.instId];
      const displayVariant = ex.variants.find(v => v.id === chosenVariantId) || ex.variants.find(v => v.default) || ex.variants[0];
      return /*#__PURE__*/React.createElement(Card, {
        key: inst.instId,
        className: "setup-exercise-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "setup-exercise-info"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-row-name"
      }, ex.name), /*#__PURE__*/React.createElement("div", {
        className: "exercise-row-req"
      }, fmtWeightNames(displayVariant?.weightEntries, gearMap))), /*#__PURE__*/React.createElement("div", {
        className: "variant-chip-row"
      }, ex.variants.map(v => /*#__PURE__*/React.createElement("button", {
        key: v.id,
        className: `variant-chip ${chosenVariantId === v.id ? "active" : ""}`,
        onClick: () => setSelection(s => ({
          ...s,
          [inst.instId]: v.id
        })),
        title: v.label
      }, v.label, ": ", v.reps, "r · ", fmtWeightEntries(v.weightEntries)))));
    })), bonusEx && !workoutBonusAlreadyDone && /*#__PURE__*/React.createElement(Card, {
      className: "bonus-toggle-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "setup-exercise-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-name"
    }, bonusEx.name, " ", /*#__PURE__*/React.createElement("span", {
      className: "bonus-tag"
    }, "Bonus")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-req"
    }, fmtWeightNames(bonusExDisplayVariant?.weightEntries, gearMap)), /*#__PURE__*/React.createElement("div", {
      className: "bonus-toggle-target"
    }, bonusExDisplayVariant?.reps, " reps · ", fmtWeightEntries(bonusExDisplayVariant?.weightEntries))), /*#__PURE__*/React.createElement("button", {
      className: `btn ${includedBonus === bonusEx.id ? "btn-primary" : "btn-ghost"}`,
      onClick: () => setIncludedBonus(includedBonus === bonusEx.id ? null : bonusEx.id)
    }, includedBonus === bonusEx.id ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
      size: 14
    }), " Added") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Plus, {
      size: 14
    }), " Add"))), /*#__PURE__*/React.createElement("div", {
      className: "sticky-actions-spacer"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sticky-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: () => setSkipTarget(true)
    }, /*#__PURE__*/React.createElement(X, {
      size: 16
    }), " Skip"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      disabled: focusedSession.exercises.length === 0,
      onClick: startSession
    }, /*#__PURE__*/React.createElement(Play, {
      size: 16
    }), " Start Workout"))), skipTarget && focusedSession && /*#__PURE__*/React.createElement("div", {
      className: "modal-backdrop",
      onClick: () => setSkipTarget(false)
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("h3", null, "Skip ", focusedSession.name, "?"), /*#__PURE__*/React.createElement("p", {
      className: "modal-sub"
    }, "Choose a reason:"), /*#__PURE__*/React.createElement("div", {
      className: "skip-reasons"
    }, SKIP_REASONS.map(r => /*#__PURE__*/React.createElement("button", {
      key: r.id,
      className: "skip-reason-btn",
      onClick: () => {
        if (r.id === "custom" && !skipNote) return;
        skipSession(r.id, skipNote);
        setSkipTarget(false);
        setSkipNote("");
      }
    }, /*#__PURE__*/React.createElement(r.icon, {
      size: 18
    }), /*#__PURE__*/React.createElement("span", null, r.label)))), /*#__PURE__*/React.createElement("input", {
      className: "text-input",
      placeholder: "Optional note...",
      value: skipNote,
      onChange: e => setSkipNote(e.target.value)
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-block",
      onClick: () => setSkipTarget(false)
    }, "Cancel"))));
  }
  function ActiveSessionView({
    state,
    setState,
    exMap
  }) {
    const active = state.activeWorkout;
    const gearMap = useMemo(() => Object.fromEntries((state.gear || []).map(g => [g.id, g])), [state.gear]);
    const [, forceTick] = useState(0);
    const [confirmingCancel, setConfirmingCancel] = useState(false);
    const audioStatus = useAudioPlayerStatus();
    const fileInputRef = React.useRef(null);
    useEffect(() => {
      const t = setInterval(() => forceTick(n => n + 1), 1000);
      return () => clearInterval(t);
    }, []);
    const enabledTrackNames = (state.tracks || []).filter(t => t.enabled).map(t => t.name);

    // When the session starts, immediately search for every ON track among
    // whatever's already in memory this browser session and get the player
    // loaded and ready. Tracks that are OFF or no longer in the list are never
    // searched for. If some ON tracks genuinely can't be found (and we do have
    // *some* file data to search against, so this isn't just "nothing's been
    // imported yet"), drop them from the ON/OFF list quietly — no popup — so
    // dead entries don't linger and block future imports/playback.
    useEffect(() => {
      const enabled = (state.tracks || []).filter(t => t.enabled).map(t => t.name);
      if (enabled.length === 0) return;
      const {
        found,
        notFound,
        hadAnyFiles
      } = audioPlayer.search(enabled);
      audioPlayer.prepare(found);
      if (hadAnyFiles && notFound.length > 0) {
        setState(s => ({
          ...s,
          tracks: (s.tracks || []).filter(t => !notFound.includes(t.name))
        }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handlePlayPause = () => {
      if (audioStatus.isPlaying) {
        audioPlayer.pause();
        return;
      }
      if (enabledTrackNames.length === 0) return;
      const {
        found,
        notFound,
        hadAnyFiles
      } = audioPlayer.search(enabledTrackNames);
      if (!hadAnyFiles) {
        // No file data in memory yet this session — one tap opens the picker,
        // which is as close to "invisible" as a browser will allow.
        fileInputRef.current?.click();
        return;
      }
      if (notFound.length > 0) {
        // Searched for them and they're not there — skip silently and drop
        // them from the list instead of leaving dead entries behind.
        setState(s => ({
          ...s,
          tracks: (s.tracks || []).filter(t => !notFound.includes(t.name))
        }));
      }
      if (found.length === 0) return;
      audioPlayer.play(found);
    };
    const handleFilesPicked = e => {
      const files = e.target.files;
      if (files && files.length > 0) {
        audioPlayer.importFiles(files);
        const {
          found,
          notFound
        } = audioPlayer.search(enabledTrackNames);
        if (notFound.length > 0) {
          setState(s => ({
            ...s,
            tracks: (s.tracks || []).filter(t => !notFound.includes(t.name))
          }));
        }
        if (found.length > 0) audioPlayer.play(found);
      }
      e.target.value = "";
    };
    const elapsedSec = Math.floor((Date.now() - active.startedAt) / 1000);
    const cancelSession = () => {
      setState(s => ({
        ...s,
        activeWorkout: null
      }));
    };
    const finishWorkout = () => {
      const durationSec = Math.floor((Date.now() - active.startedAt) / 1000);
      const iteration = state.planIterations.find(it => it.id === active.iterationId);
      const sets = iteration?.setsPerExercise || DEFAULT_SETS_PER_EXERCISE;
      const gearMap = Object.fromEntries((state.gear || []).map(g => [g.id, g]));
      const exerciseResults = active.exIds.map(inst => {
        const ex = exMap[inst.exId];
        const variant = ex?.variants.find(v => v.id === inst.variantId) || ex?.variants[0];
        // Snapshot each weight entry's gear name at the moment of completion, so
        // History stays accurate even if the gear item is later renamed or removed.
        const snapshotEntries = (variant?.weightEntries || []).map(we => ({
          ...we,
          gearName: gearMap[we.gearId]?.name || ""
        }));
        return {
          instId: inst.instId,
          exId: inst.exId,
          name: ex?.name,
          variantLabel: variant?.label,
          reps: variant?.reps ?? 0,
          weight: variantTotalWeight(variant || {
            weightEntries: []
          }),
          weightEntries: snapshotEntries,
          sets,
          isBonus: !!inst.isBonus
        };
      });
      const now = new Date();
      const record = {
        id: uid("w"),
        date: now.toISOString(),
        startedAt: new Date(active.startedAt).toISOString(),
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
      setState(s => {
        let bonusStars = s.bonusStars;
        const awardedIterationBonus = {
          ...s.awardedIterationBonus
        }; // iterationId -> true once the plan-completion star is granted
        const awardedWorkoutBonus = {
          ...s.awardedWorkoutBonus
        }; // "iterationId:workoutId" -> true once that workout's bonus star is granted
        const exerciseRepRecords = {
          ...s.exerciseRepRecords
        }; // exId -> { [weight]: highest reps ever performed at that weight }
        const awardedRepGainBonus = {
          ...s.awardedRepGainBonus
        }; // "iterationId:exId:weight" -> true once a rep-gain star is granted for this exercise+weight in this iteration

        const iter = s.planIterations.find(it => it.id === active.iterationId);
        const newHistory = [record, ...s.history];

        // Once every workout/session in this iteration is resolved, it's finished —
        // award the plan-completion star, award a star for each workout whose bonus
        // exercise was completed, award a gains star for each exercise+weight combo
        // that hit a new rep personal-best, and clear it from "active".
        let activeIterationId = s.activeIterationId;
        if (iter) {
          const isResolved = sessId => newHistory.some(h => h.sessionId === sessId && (h.status === "completed" || h.status === "skipped"));
          const iterNowComplete = iter.workouts.length > 0 && iter.workouts.every(w => w.sessions.length > 0 && w.sessions.every(sess => isResolved(sess.id)));
          if (iterNowComplete) {
            if (!awardedIterationBonus[iter.id]) {
              bonusStars += 1; // +1 for completing the plan
              awardedIterationBonus[iter.id] = true;
            }
            const iterHistory = newHistory.filter(h => h.status === "completed" && h.iterationId === iter.id);
            const workoutHasBonusDone = {};
            iterHistory.forEach(h => {
              if (h.bonusExId && h.workoutId) workoutHasBonusDone[h.workoutId] = true;
            });
            iter.workouts.forEach(w => {
              const key = `${iter.id}:${w.id}`;
              if (workoutHasBonusDone[w.id] && !awardedWorkoutBonus[key]) {
                bonusStars += 1; // +1 for completing this challenge's bonus exercise
                awardedWorkoutBonus[key] = true;
              }
            });

            // Gains: for each exercise+weight combo performed in this iteration,
            // check whether its reps beat the all-time record for that specific
            // exercise-at-that-weight (progress at one weight never counts toward
            // or is blocked by progress at a different weight for the same exercise).
            const highestRepsThisIterByExWeight = {}; // "exId:weight" -> reps
            iterHistory.forEach(h => {
              (h.exercises || []).forEach(e => {
                if (!e.exId) return;
                const weight = e.weight || 0;
                const reps = e.reps || 0;
                const key = `${e.exId}:${weight}`;
                if (!highestRepsThisIterByExWeight[key] || reps > highestRepsThisIterByExWeight[key]) {
                  highestRepsThisIterByExWeight[key] = reps;
                }
              });
            });
            Object.entries(highestRepsThisIterByExWeight).forEach(([exWeightKey, repsUsed]) => {
              const [exId, weightStr] = exWeightKey.split(":");
              const weight = Number(weightStr);
              const priorRecord = (exerciseRepRecords[exId] || {})[weight] || 0;
              const gainKey = `${iter.id}:${exId}:${weight}`;
              if (repsUsed > priorRecord && !awardedRepGainBonus[gainKey]) {
                bonusStars += 1; // +1 for a new rep milestone at this exercise's weight
                awardedRepGainBonus[gainKey] = true;
                exerciseRepRecords[exId] = {
                  ...(exerciseRepRecords[exId] || {}),
                  [weight]: repsUsed
                };
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
          awardedRepGainBonus,
          exerciseRepRecords,
          activeIterationId
        };
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "view-pad"
    }, /*#__PURE__*/React.createElement("div", {
      className: "active-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "eyebrow"
    }, active.planName, " · ", active.workoutName, " · ", active.sessionName), /*#__PURE__*/React.createElement("h2", null, "In Progress"), /*#__PURE__*/React.createElement("div", {
      className: "timer-display"
    }, /*#__PURE__*/React.createElement(Clock, {
      size: 14
    }), " ", fmtDuration(elapsedSec)))), /*#__PURE__*/React.createElement("div", {
      className: "exercise-log-list"
    }, active.exIds.map(inst => {
      const ex = exMap[inst.exId];
      if (!ex) return null;
      const variant = ex.variants.find(v => v.id === inst.variantId) || ex.variants[0];
      return /*#__PURE__*/React.createElement(Card, {
        key: inst.instId,
        className: "exercise-row readonly static-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-row-main"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-row-name"
      }, ex.name, " ", inst.isBonus && /*#__PURE__*/React.createElement("span", {
        className: "bonus-tag"
      }, "Bonus")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-row-req"
      }, fmtWeightNames(variant?.weightEntries, gearMap))), /*#__PURE__*/React.createElement("div", {
        className: "exercise-target"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-target-num"
      }, variant?.reps, " reps"), /*#__PURE__*/React.createElement("div", {
        className: "exercise-target-num accent"
      }, fmtWeightEntries(variant?.weightEntries))));
    })), /*#__PURE__*/React.createElement("div", {
      className: "sticky-actions-spacer"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sticky-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: () => setConfirmingCancel(true)
    }, /*#__PURE__*/React.createElement(X, {
      size: 16
    }), " Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: finishWorkout
    }, /*#__PURE__*/React.createElement(Check, {
      size: 16
    }), " Finish Workout")), (state.tracks || []).some(t => t.enabled) && /*#__PURE__*/React.createElement("div", {
      className: "track-transport"
    }, /*#__PURE__*/React.createElement("input", {
      ref: fileInputRef,
      type: "file",
      accept: "audio/*",
      multiple: true,
      style: {
        display: "none"
      },
      onChange: handleFilesPicked
    }), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: handlePlayPause,
      "aria-label": audioStatus.isPlaying ? "Pause" : "Play"
    }, audioStatus.isPlaying ? /*#__PURE__*/React.createElement(PauseIcon, {
      size: 16
    }) : /*#__PURE__*/React.createElement(Play, {
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "track-transport-name"
    }, audioStatus.currentName || (audioStatus.hasFiles ? "Ready" : "Tap play to load your tracks")), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => audioPlayer.next(),
      "aria-label": "Skip track",
      disabled: !audioStatus.hasFiles
    }, /*#__PURE__*/React.createElement(SkipForwardIcon, {
      size: 16
    })), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => audioPlayer.toggleMute(),
      "aria-label": audioStatus.muted ? "Unmute" : "Mute"
    }, audioStatus.muted ? /*#__PURE__*/React.createElement(VolumeX, {
      size: 16
    }) : /*#__PURE__*/React.createElement(Volume2, {
      size: 16
    }))), confirmingCancel && /*#__PURE__*/React.createElement("div", {
      className: "modal-backdrop",
      onClick: () => setConfirmingCancel(false)
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("h3", null, "Cancel this workout?"), /*#__PURE__*/React.createElement("p", {
      className: "modal-sub"
    }, "Nothing will be saved."), /*#__PURE__*/React.createElement("div", {
      className: "confirm-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-block",
      onClick: () => setConfirmingCancel(false)
    }, "Keep Going"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block danger-solid",
      onClick: cancelSession
    }, /*#__PURE__*/React.createElement(X, {
      size: 14
    }), " Cancel Workout")))));
  }

  /* ============================================================
     PLAN MANAGER VIEW
     ============================================================ */

  function PlanView({
    state,
    setState
  }) {
    const [tab, setTab] = useState("schedule");
    const gearMap = useMemo(() => Object.fromEntries((state.gear || []).map(g => [g.id, g])), [state.gear]);
    const [editingEx, setEditingEx] = useState(null);
    const [editingGear, setEditingGear] = useState(null);
    const [newGearWeightInputs, setNewGearWeightInputs] = useState({}); // gearId -> pending input string
    const tracksFileInputRef = React.useRef(null);
    const audioStatus = useAudioPlayerStatus();
    const [addingToSession, setAddingToSession] = useState(null);
    const [expandedPlans, setExpandedPlans] = useState(() => new Set(state.plans[0] ? [state.plans[0].id] : []));
    const [expandedWorkouts, setExpandedWorkouts] = useState(() => new Set());
    const toggleExpandedPlan = id => setExpandedPlans(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    const toggleExpandedWorkout = id => setExpandedWorkouts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    const [renaming, setRenaming] = useState(null); // { kind, id, parentIds }
    const [renameValue, setRenameValue] = useState("");
    const [pendingConfirm, setPendingConfirm] = useState(null); // { message, onConfirm }
    const [creatingPlan, setCreatingPlan] = useState(false);
    const [newPlanSets, setNewPlanSets] = useState(DEFAULT_SETS_PER_EXERCISE);
    const askConfirm = (message, onConfirm) => setPendingConfirm({
      message,
      onConfirm
    });
    const exMap = useMemo(() => Object.fromEntries(state.exercises.map(e => [e.id, e])), [state.exercises]);
    const addPlan = () => {
      const sets = Math.max(1, Number(newPlanSets) || DEFAULT_SETS_PER_EXERCISE);
      setState(s => ({
        ...s,
        plans: [...s.plans, {
          id: nextPlanId(),
          name: `Plan ${s.plans.length + 1}`,
          setsPerExercise: sets,
          workouts: []
        }]
      }));
      setCreatingPlan(false);
      setNewPlanSets(DEFAULT_SETS_PER_EXERCISE);
    };
    const updatePlanSets = (planId, sets) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          setsPerExercise: Math.max(1, Number(sets) || 1)
        } : p)
      }));
    };
    const restoreDefaultPlan = () => {
      askConfirm("Add back the default Weekly Rotation plan (Arms, Legs, Core, Arms II, Legs II, Core II)? Your history and notes are kept.", () => {
        setState(s => ({
          ...s,
          plans: [...s.plans, {
            id: nextPlanId(),
            name: "Weekly Rotation",
            setsPerExercise: DEFAULT_SETS_PER_EXERCISE,
            workouts: buildWorkouts()
          }]
        }));
      });
    };
    const removePlan = planId => {
      askConfirm("Delete this plan and all its challenges?", () => {
        setState(s => ({
          ...s,
          plans: s.plans.filter(p => p.id !== planId)
        }));
      });
    };
    const duplicatePlan = planId => {
      setState(s => {
        const original = s.plans.find(p => p.id === planId);
        if (!original) return s;
        const copy = {
          id: nextPlanId(),
          name: `${original.name} (Copy)`,
          setsPerExercise: original.setsPerExercise,
          workouts: buildWorkoutsFrom(original.workouts)
        };
        const idx = s.plans.findIndex(p => p.id === planId);
        const plans = [...s.plans];
        plans.splice(idx + 1, 0, copy);
        return {
          ...s,
          plans
        };
      });
    };
    const renamePlan = (planId, name) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          name
        } : p)
      }));
    };
    const addWorkout = planId => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          workouts: [...p.workouts, {
            id: nextWorkoutId(),
            name: `Challenge ${p.workouts.length + 1}`,
            bonusExId: null,
            sessions: []
          }]
        } : p)
      }));
    };
    const removeWorkout = (planId, workoutId) => {
      askConfirm("Delete this challenge and its workouts?", () => {
        setState(s => ({
          ...s,
          plans: s.plans.map(p => p.id === planId ? {
            ...p,
            workouts: p.workouts.filter(w => w.id !== workoutId)
          } : p)
        }));
      });
    };
    const duplicateWorkout = (planId, workoutId) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => {
          if (p.id !== planId) return p;
          const original = p.workouts.find(w => w.id === workoutId);
          if (!original) return p;
          const [copy] = buildWorkoutsFrom([{
            ...original,
            name: `${original.name} (Copy)`
          }]);
          const idx = p.workouts.findIndex(w => w.id === workoutId);
          const workouts = [...p.workouts];
          workouts.splice(idx + 1, 0, copy);
          return {
            ...p,
            workouts
          };
        })
      }));
    };
    const renameWorkout = (planId, workoutId, name) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          workouts: p.workouts.map(w => w.id === workoutId ? {
            ...w,
            name
          } : w)
        } : p)
      }));
    };
    const setWorkoutBonus = (planId, workoutId, exId) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          workouts: p.workouts.map(w => w.id === workoutId ? {
            ...w,
            bonusExId: exId
          } : w)
        } : p)
      }));
    };
    const addSession = (planId, workoutId) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          workouts: p.workouts.map(w => w.id === workoutId ? {
            ...w,
            sessions: [...w.sessions, {
              id: nextSessId(),
              name: `Workout ${w.sessions.length + 1}`,
              exercises: []
            }]
          } : w)
        } : p)
      }));
    };
    const removeSession = (planId, workoutId, sessionId) => {
      askConfirm("Remove this workout and its exercise list?", () => {
        setState(s => ({
          ...s,
          plans: s.plans.map(p => p.id === planId ? {
            ...p,
            workouts: p.workouts.map(w => w.id === workoutId ? {
              ...w,
              sessions: w.sessions.filter(sess => sess.id !== sessionId)
            } : w)
          } : p)
        }));
      });
    };
    const duplicateSession = (planId, workoutId, sessionId) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => {
          if (p.id !== planId) return p;
          return {
            ...p,
            workouts: p.workouts.map(w => {
              if (w.id !== workoutId) return w;
              const original = w.sessions.find(sess => sess.id === sessionId);
              if (!original) return w;
              const copy = {
                id: nextSessId(),
                name: `${original.name} (Copy)`,
                exercises: original.exercises.map(x => ({
                  instId: nextInstId(),
                  exId: x.exId
                }))
              };
              const idx = w.sessions.findIndex(sess => sess.id === sessionId);
              const sessions = [...w.sessions];
              sessions.splice(idx + 1, 0, copy);
              return {
                ...w,
                sessions
              };
            })
          };
        })
      }));
    };
    const renameSession = (planId, workoutId, sessionId, name) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          workouts: p.workouts.map(w => w.id === workoutId ? {
            ...w,
            sessions: w.sessions.map(sess => sess.id === sessionId ? {
              ...sess,
              name
            } : sess)
          } : w)
        } : p)
      }));
    };
    const removeFromSession = (planId, workoutId, sessionId, instId) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          workouts: p.workouts.map(w => w.id === workoutId ? {
            ...w,
            sessions: w.sessions.map(sess => sess.id === sessionId ? {
              ...sess,
              exercises: sess.exercises.filter(x => x.instId !== instId)
            } : sess)
          } : w)
        } : p)
      }));
    };
    const addToSession = (planId, workoutId, sessionId, exId) => {
      setState(s => ({
        ...s,
        plans: s.plans.map(p => p.id === planId ? {
          ...p,
          workouts: p.workouts.map(w => w.id === workoutId ? {
            ...w,
            sessions: w.sessions.map(sess => sess.id === sessionId ? {
              ...sess,
              exercises: [...sess.exercises, {
                instId: nextInstId(),
                exId
              }]
            } : sess)
          } : w)
        } : p)
      }));
    };
    const updateExercise = (id, patch) => {
      setState(s => ({
        ...s,
        exercises: s.exercises.map(e => e.id === id ? {
          ...e,
          ...patch
        } : e)
      }));
    };
    const updateVariant = (exId, variantId, patch) => {
      setState(s => ({
        ...s,
        exercises: s.exercises.map(e => e.id === exId ? {
          ...e,
          variants: e.variants.map(v => v.id === variantId ? {
            ...v,
            ...patch
          } : v)
        } : e)
      }));
    };
    const addWeightEntry = (exId, variantId) => {
      setState(s => ({
        ...s,
        exercises: s.exercises.map(e => e.id === exId ? {
          ...e,
          variants: e.variants.map(v => v.id === variantId ? {
            ...v,
            weightEntries: [...(v.weightEntries || []), mkWeightEntry(null, 0, 1)]
          } : v)
        } : e)
      }));
    };
    const updateWeightEntry = (exId, variantId, entryId, patch) => {
      setState(s => ({
        ...s,
        exercises: s.exercises.map(e => e.id === exId ? {
          ...e,
          variants: e.variants.map(v => v.id === variantId ? {
            ...v,
            weightEntries: (v.weightEntries || []).map(w => w.id === entryId ? {
              ...w,
              ...patch
            } : w)
          } : v)
        } : e)
      }));
    };
    const removeWeightEntry = (exId, variantId, entryId) => {
      setState(s => ({
        ...s,
        exercises: s.exercises.map(e => e.id === exId ? {
          ...e,
          variants: e.variants.map(v => v.id === variantId ? {
            ...v,
            weightEntries: (v.weightEntries || []).filter(w => w.id !== entryId)
          } : v)
        } : e)
      }));
    };

    // ---- Gear CRUD ----
    const addGear = () => {
      const newGear = {
        id: uid("gear"),
        name: "New Gear",
        weights: [0]
      };
      setState(s => ({
        ...s,
        gear: [...(s.gear || []), newGear]
      }));
      setEditingGear(newGear.id);
    };
    const updateGear = (gearId, patch) => {
      setState(s => ({
        ...s,
        gear: (s.gear || []).map(g => g.id === gearId ? {
          ...g,
          ...patch
        } : g)
      }));
    };
    const deleteGear = gearId => {
      askConfirm("Delete this gear item? Any exercise weight entries using it will need a new gear selection.", () => {
        setState(s => ({
          ...s,
          gear: (s.gear || []).filter(g => g.id !== gearId),
          exercises: s.exercises.map(e => ({
            ...e,
            variants: e.variants.map(v => ({
              ...v,
              weightEntries: (v.weightEntries || []).map(we => we.gearId === gearId ? {
                ...we,
                gearId: null
              } : we)
            }))
          }))
        }));
      });
    };
    const addGearWeight = (gearId, weight) => {
      setState(s => ({
        ...s,
        gear: (s.gear || []).map(g => g.id === gearId && !g.weights.includes(weight) ? {
          ...g,
          weights: [...g.weights, weight].sort((a, b) => a - b)
        } : g)
      }));
    };
    const removeGearWeight = (gearId, weight) => {
      setState(s => ({
        ...s,
        gear: (s.gear || []).map(g => g.id === gearId ? {
          ...g,
          weights: g.weights.filter(w => w !== weight)
        } : g)
      }));
    };

    // ---- Tracks CRUD ----
    const handleTracksFilesPicked = e => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const importedNames = audioPlayer.importFiles(files);
        setState(s => {
          const existingNames = new Set((s.tracks || []).map(t => t.name));
          const newTracks = importedNames.filter(name => !existingNames.has(name)).map(name => ({
            id: uid("track"),
            name,
            enabled: true
          }));
          return {
            ...s,
            tracks: [...(s.tracks || []), ...newTracks]
          };
        });
      }
      e.target.value = "";
    };
    const toggleTrack = trackId => {
      setState(s => ({
        ...s,
        tracks: (s.tracks || []).map(t => t.id === trackId ? {
          ...t,
          enabled: !t.enabled
        } : t)
      }));
    };
    const removeTrack = trackId => {
      setState(s => {
        const track = (s.tracks || []).find(t => t.id === trackId);
        if (track) audioPlayer.removeFile(track.name); // scrub the file from memory/queue too
        return {
          ...s,
          tracks: (s.tracks || []).filter(t => t.id !== trackId)
        };
      });
    };
    const setDefaultVariant = (exId, variantId) => {
      setState(s => ({
        ...s,
        exercises: s.exercises.map(e => e.id === exId ? {
          ...e,
          variants: e.variants.map(v => ({
            ...v,
            default: v.id === variantId
          }))
        } : e)
      }));
    };
    const addExercise = () => {
      const newEx = {
        id: uid("exc"),
        name: "New Exercise",
        isBonus: false,
        variants: mkVariants(10, 10, 13, 15)
      };
      setState(s => ({
        ...s,
        exercises: [...s.exercises, newEx]
      }));
      setEditingEx(newEx.id);
    };
    const toggleBonus = id => {
      setState(s => ({
        ...s,
        exercises: s.exercises.map(e => e.id === id ? {
          ...e,
          isBonus: !e.isBonus
        } : e)
      }));
    };
    const deleteExercise = id => {
      askConfirm("Delete this exercise? It will be removed from all workouts.", () => {
        setState(s => ({
          ...s,
          exercises: s.exercises.filter(e => e.id !== id),
          plans: s.plans.map(p => ({
            ...p,
            workouts: p.workouts.map(w => ({
              ...w,
              bonusExId: w.bonusExId === id ? null : w.bonusExId,
              sessions: w.sessions.map(sess => ({
                ...sess,
                exercises: sess.exercises.filter(x => x.exId !== id)
              }))
            }))
          }))
        }));
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "view-pad"
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      sub: "Plans contain challenges; challenges contain workouts"
    }, "Manage"), /*#__PURE__*/React.createElement("div", {
      className: "tab-row"
    }, /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "schedule" ? "active" : ""}`,
      onClick: () => setTab("schedule")
    }, "Plans"), /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "exercises" ? "active" : ""}`,
      onClick: () => setTab("exercises")
    }, "Exercises"), /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "gear" ? "active" : ""}`,
      onClick: () => setTab("gear")
    }, "Gear"), /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "tracks" ? "active" : ""}`,
      onClick: () => setTab("tracks")
    }, "Tracks")), tab === "schedule" && /*#__PURE__*/React.createElement("div", {
      className: "schedule-grid"
    }, state.plans.map(plan => {
      const isPlanExpanded = expandedPlans.has(plan.id);
      return /*#__PURE__*/React.createElement(Card, {
        key: plan.id,
        className: "day-plan-card"
      }, /*#__PURE__*/React.createElement("div", {
        className: "day-plan-header",
        onClick: () => toggleExpandedPlan(plan.id)
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "eyebrow"
      }, "Plan"), renaming?.kind === "plan" && renaming.id === plan.id ? /*#__PURE__*/React.createElement("div", {
        className: "rename-row",
        onClick: e => e.stopPropagation()
      }, /*#__PURE__*/React.createElement("input", {
        className: "text-input",
        value: renameValue,
        onChange: e => setRenameValue(e.target.value),
        autoFocus: true
      }), /*#__PURE__*/React.createElement("button", {
        className: "icon-btn",
        onClick: () => {
          renamePlan(plan.id, renameValue.trim() || plan.name);
          setRenaming(null);
        }
      }, /*#__PURE__*/React.createElement(CheckIcon, {
        size: 14
      }))) : /*#__PURE__*/React.createElement("div", {
        className: "rename-row"
      }, /*#__PURE__*/React.createElement("h3", null, plan.name), /*#__PURE__*/React.createElement("button", {
        className: "icon-btn",
        onClick: e => {
          e.stopPropagation();
          setRenaming({
            kind: "plan",
            id: plan.id
          });
          setRenameValue(plan.name);
        }
      }, /*#__PURE__*/React.createElement(Pencil, {
        size: 13
      })), /*#__PURE__*/React.createElement("button", {
        className: "icon-btn",
        onClick: e => {
          e.stopPropagation();
          duplicatePlan(plan.id);
        },
        title: "Duplicate plan"
      }, /*#__PURE__*/React.createElement(Copy, {
        size: 13
      })), /*#__PURE__*/React.createElement("button", {
        className: "icon-btn",
        onClick: e => {
          e.stopPropagation();
          removePlan(plan.id);
        }
      }, /*#__PURE__*/React.createElement(Trash2, {
        size: 13
      })))), isPlanExpanded ? /*#__PURE__*/React.createElement(ChevronUp, {
        size: 16
      }) : /*#__PURE__*/React.createElement(ChevronDown, {
        size: 16
      })), isPlanExpanded && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "day-bonus-picker"
      }, /*#__PURE__*/React.createElement("div", {
        className: "variant-manager-label"
      }, "Sets per exercise for this plan"), /*#__PURE__*/React.createElement(NumberField, {
        min: 1,
        value: plan.setsPerExercise ?? DEFAULT_SETS_PER_EXERCISE,
        onChange: val => updatePlanSets(plan.id, val)
      })), plan.workouts.map(workout => {
        const isWorkoutExpanded = expandedWorkouts.has(workout.id);
        return /*#__PURE__*/React.createElement("div", {
          key: workout.id,
          className: "workout-block"
        }, /*#__PURE__*/React.createElement("div", {
          className: "workout-block-header",
          onClick: () => toggleExpandedWorkout(workout.id)
        }, renaming?.kind === "workout" && renaming.id === workout.id ? /*#__PURE__*/React.createElement("div", {
          className: "rename-row",
          onClick: e => e.stopPropagation()
        }, /*#__PURE__*/React.createElement("input", {
          className: "text-input",
          value: renameValue,
          onChange: e => setRenameValue(e.target.value),
          autoFocus: true
        }), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: () => {
            renameWorkout(plan.id, workout.id, renameValue.trim() || workout.name);
            setRenaming(null);
          }
        }, /*#__PURE__*/React.createElement(CheckIcon, {
          size: 14
        }))) : /*#__PURE__*/React.createElement("div", {
          className: "rename-row"
        }, /*#__PURE__*/React.createElement("div", {
          className: "session-block-title"
        }, workout.name), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: e => {
            e.stopPropagation();
            setRenaming({
              kind: "workout",
              id: workout.id
            });
            setRenameValue(workout.name);
          }
        }, /*#__PURE__*/React.createElement(Pencil, {
          size: 12
        })), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: e => {
            e.stopPropagation();
            duplicateWorkout(plan.id, workout.id);
          },
          title: "Duplicate challenge"
        }, /*#__PURE__*/React.createElement(Copy, {
          size: 12
        })), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: e => {
            e.stopPropagation();
            removeWorkout(plan.id, workout.id);
          }
        }, /*#__PURE__*/React.createElement(Trash2, {
          size: 12
        }))), isWorkoutExpanded ? /*#__PURE__*/React.createElement(ChevronUp, {
          size: 14
        }) : /*#__PURE__*/React.createElement(ChevronDown, {
          size: 14
        })), isWorkoutExpanded && /*#__PURE__*/React.createElement("div", {
          className: "workout-block-body"
        }, /*#__PURE__*/React.createElement("div", {
          className: "day-bonus-picker"
        }, /*#__PURE__*/React.createElement("div", {
          className: "variant-manager-label"
        }, "Challenge Bonus Exercise"), /*#__PURE__*/React.createElement("select", {
          className: "text-input",
          value: workout.bonusExId || "",
          onChange: e => setWorkoutBonus(plan.id, workout.id, e.target.value || null)
        }, /*#__PURE__*/React.createElement("option", {
          value: ""
        }, "None"), state.exercises.filter(e => e.isBonus).map(e => /*#__PURE__*/React.createElement("option", {
          key: e.id,
          value: e.id
        }, e.name)))), workout.sessions.map(sess => /*#__PURE__*/React.createElement("div", {
          key: sess.id,
          className: "session-block"
        }, /*#__PURE__*/React.createElement("div", {
          className: "session-block-header"
        }, renaming?.kind === "session" && renaming.id === sess.id ? /*#__PURE__*/React.createElement("div", {
          className: "rename-row"
        }, /*#__PURE__*/React.createElement("input", {
          className: "text-input",
          value: renameValue,
          onChange: e => setRenameValue(e.target.value),
          autoFocus: true
        }), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: () => {
            renameSession(plan.id, workout.id, sess.id, renameValue.trim() || sess.name);
            setRenaming(null);
          }
        }, /*#__PURE__*/React.createElement(CheckIcon, {
          size: 14
        }))) : /*#__PURE__*/React.createElement("div", {
          className: "rename-row"
        }, /*#__PURE__*/React.createElement("div", {
          className: "session-block-title small"
        }, sess.name), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: () => {
            setRenaming({
              kind: "session",
              id: sess.id
            });
            setRenameValue(sess.name);
          }
        }, /*#__PURE__*/React.createElement(Pencil, {
          size: 12
        })), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: () => duplicateSession(plan.id, workout.id, sess.id),
          title: "Duplicate workout"
        }, /*#__PURE__*/React.createElement(Copy, {
          size: 12
        }))), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: () => removeSession(plan.id, workout.id, sess.id)
        }, /*#__PURE__*/React.createElement(Trash2, {
          size: 13
        }))), /*#__PURE__*/React.createElement("ul", {
          className: "reorder-list"
        }, sess.exercises.map(inst => /*#__PURE__*/React.createElement("li", {
          key: inst.instId
        }, /*#__PURE__*/React.createElement("span", {
          className: "reorder-name"
        }, exMap[inst.exId]?.name || "?"), /*#__PURE__*/React.createElement("button", {
          className: "icon-btn",
          onClick: () => removeFromSession(plan.id, workout.id, sess.id, inst.instId)
        }, /*#__PURE__*/React.createElement(Trash2, {
          size: 12
        })))), sess.exercises.length === 0 && /*#__PURE__*/React.createElement("li", {
          className: "empty-row"
        }, "No exercises yet")), /*#__PURE__*/React.createElement("button", {
          className: "btn btn-ghost btn-block btn-sm",
          onClick: () => setAddingToSession(addingToSession === sess.id ? null : sess.id)
        }, /*#__PURE__*/React.createElement(Plus, {
          size: 12
        }), " Add Exercise"), addingToSession === sess.id && /*#__PURE__*/React.createElement("div", {
          className: "add-exercise-list"
        }, state.exercises.map(e => /*#__PURE__*/React.createElement("button", {
          key: e.id,
          className: "add-exercise-item",
          onClick: () => addToSession(plan.id, workout.id, sess.id, e.id)
        }, /*#__PURE__*/React.createElement(Plus, {
          size: 12
        }), " ", e.name, " ", e.isBonus && /*#__PURE__*/React.createElement("span", {
          className: "bonus-tag"
        }, "Bonus")))))), /*#__PURE__*/React.createElement("button", {
          className: "btn btn-primary btn-block btn-sm",
          onClick: () => addSession(plan.id, workout.id)
        }, /*#__PURE__*/React.createElement(Plus, {
          size: 13
        }), " Add Workout")));
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary btn-block btn-sm",
        style: {
          marginTop: 12
        },
        onClick: () => addWorkout(plan.id)
      }, /*#__PURE__*/React.createElement(Plus, {
        size: 13
      }), " Add Challenge")));
    }), creatingPlan ? /*#__PURE__*/React.createElement(Card, {
      className: "new-plan-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "variant-manager-label"
    }, "Sets per exercise for this plan"), /*#__PURE__*/React.createElement(NumberField, {
      min: 1,
      value: newPlanSets,
      onChange: val => setNewPlanSets(val)
    }), /*#__PURE__*/React.createElement("div", {
      className: "confirm-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-block",
      onClick: () => setCreatingPlan(false)
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block",
      onClick: addPlan
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 14
    }), " Create Plan"))) : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-block",
      onClick: () => setCreatingPlan(true)
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 14
    }), " Add New Plan"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-block",
      onClick: restoreDefaultPlan
    }, /*#__PURE__*/React.createElement(RotateCcw, {
      size: 14
    }), " Restore Default Plan")), tab === "exercises" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block",
      style: {
        marginBottom: 12
      },
      onClick: addExercise
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 14
    }), " Add New Exercise"), /*#__PURE__*/React.createElement("div", {
      className: "exercise-manage-list"
    }, state.exercises.map(ex => /*#__PURE__*/React.createElement(Card, {
      key: ex.id,
      className: "exercise-manage-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-manage-top",
      onClick: () => setEditingEx(editingEx === ex.id ? null : ex.id)
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-name"
    }, ex.name, " ", ex.isBonus && /*#__PURE__*/React.createElement("span", {
      className: "bonus-tag"
    }, "Bonus")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-req"
    }, fmtWeightNames((ex.variants.find(v => v.default) || ex.variants[0])?.weightEntries, gearMap))), editingEx === ex.id ? /*#__PURE__*/React.createElement(ChevronUp, {
      size: 16
    }) : /*#__PURE__*/React.createElement(ChevronDown, {
      size: 16
    })), editingEx === ex.id && /*#__PURE__*/React.createElement("div", {
      className: "exercise-edit-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-edit-grid"
    }, /*#__PURE__*/React.createElement("label", null, "Name", /*#__PURE__*/React.createElement("input", {
      className: "text-input",
      value: ex.name,
      onChange: e => updateExercise(ex.id, {
        name: e.target.value
      })
    }))), /*#__PURE__*/React.createElement("div", {
      className: "bonus-designation-row"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "variant-manager-label",
      style: {
        marginBottom: 2
      }
    }, "Bonus Exercise"), /*#__PURE__*/React.createElement("div", {
      className: "bonus-designation-sub"
    }, "Bonus exercises can be assigned to a challenge and added to workouts before starting.")), /*#__PURE__*/React.createElement("button", {
      className: `btn ${ex.isBonus ? "btn-primary" : "btn-ghost"} btn-sm`,
      onClick: () => toggleBonus(ex.id)
    }, ex.isBonus ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
      size: 13
    }), " Bonus") : "Mark as Bonus")), /*#__PURE__*/React.createElement("div", {
      className: "variant-manager"
    }, /*#__PURE__*/React.createElement("div", {
      className: "variant-manager-label"
    }, "Weight / Rep Variants"), ex.variants.map(v => /*#__PURE__*/React.createElement("div", {
      key: v.id,
      className: "variant-block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "variant-block-header"
    }, /*#__PURE__*/React.createElement("span", {
      className: "variant-fixed-label"
    }, v.label), /*#__PURE__*/React.createElement("div", {
      className: "variant-reps-field"
    }, /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => updateVariant(ex.id, v.id, {
        reps: Math.max(5, (v.reps || 5) - 5)
      }),
      "aria-label": "Decrease reps by 5"
    }, /*#__PURE__*/React.createElement(Minus, {
      size: 12
    })), /*#__PURE__*/React.createElement("span", {
      className: "reps-stepper-value"
    }, v.reps), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => updateVariant(ex.id, v.id, {
        reps: (v.reps || 0) + 5
      }),
      "aria-label": "Increase reps by 5"
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 12
    })), /*#__PURE__*/React.createElement("span", {
      className: "variant-unit"
    }, "reps")), /*#__PURE__*/React.createElement("button", {
      className: `default-star ${v.default ? "active" : ""}`,
      onClick: () => setDefaultVariant(ex.id, v.id),
      title: "Set as default"
    }, /*#__PURE__*/React.createElement(Star, {
      size: 13,
      fill: v.default ? "var(--gold)" : "none"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "weight-entry-list"
    }, (v.weightEntries || []).map(we => {
      const selectedGear = gearMap[we.gearId];
      return /*#__PURE__*/React.createElement("div", {
        key: we.id,
        className: "weight-entry-block"
      }, /*#__PURE__*/React.createElement("div", {
        className: "weight-entry-row"
      }, /*#__PURE__*/React.createElement("select", {
        className: "text-input weight-entry-gear-select",
        value: we.gearId || "",
        onChange: e => {
          const newGear = gearMap[e.target.value];
          const firstWeight = newGear?.weights[0] ?? 0;
          updateWeightEntry(ex.id, v.id, we.id, {
            gearId: e.target.value || null,
            weight: firstWeight
          });
        }
      }, /*#__PURE__*/React.createElement("option", {
        value: ""
      }, "Select gear…"), state.gear.map(g => /*#__PURE__*/React.createElement("option", {
        key: g.id,
        value: g.id
      }, g.name))), /*#__PURE__*/React.createElement("button", {
        className: `x2-toggle ${we.count === 2 ? "active" : ""}`,
        onClick: () => updateWeightEntry(ex.id, v.id, we.id, {
          count: we.count === 2 ? 1 : 2
        }),
        title: "Toggle between 1 and 2 of this weight"
      }, "2×"), /*#__PURE__*/React.createElement("button", {
        className: "icon-btn",
        onClick: () => removeWeightEntry(ex.id, v.id, we.id),
        disabled: (v.weightEntries || []).length <= 1
      }, /*#__PURE__*/React.createElement(Trash2, {
        size: 12
      }))), selectedGear ? selectedGear.weights.length > 0 ? /*#__PURE__*/React.createElement("div", {
        className: "weight-chip-row"
      }, selectedGear.weights.map(w => /*#__PURE__*/React.createElement("button", {
        key: w,
        className: `weight-chip ${we.weight === w ? "active" : ""}`,
        onClick: () => updateWeightEntry(ex.id, v.id, we.id, {
          weight: w
        })
      }, w, " lb"))) : /*#__PURE__*/React.createElement("div", {
        className: "empty-inline"
      }, "This gear has no weights configured yet — add some in Gear.") : /*#__PURE__*/React.createElement("div", {
        className: "empty-inline"
      }, "Choose a gear item to pick a weight."));
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => addWeightEntry(ex.id, v.id)
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 12
    }), " Add Weight Type")), /*#__PURE__*/React.createElement("div", {
      className: "variant-total-weight"
    }, "Total: ", fmtWeightEntries(v.weightEntries))))), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm btn-block danger",
      onClick: () => deleteExercise(ex.id)
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 13
    }), " Delete Exercise")))))), tab === "gear" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block",
      style: {
        marginBottom: 12
      },
      onClick: addGear
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 14
    }), " Add New Gear"), /*#__PURE__*/React.createElement("div", {
      className: "exercise-manage-list"
    }, (state.gear || []).map(g => /*#__PURE__*/React.createElement(Card, {
      key: g.id,
      className: "exercise-manage-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-manage-top",
      onClick: () => setEditingGear(editingGear === g.id ? null : g.id)
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-name"
    }, g.name), /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-req"
    }, g.weights.length, " weight", g.weights.length !== 1 ? "s" : "", " configured")), editingGear === g.id ? /*#__PURE__*/React.createElement(ChevronUp, {
      size: 16
    }) : /*#__PURE__*/React.createElement(ChevronDown, {
      size: 16
    })), editingGear === g.id && /*#__PURE__*/React.createElement("div", {
      className: "exercise-edit-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-edit-grid"
    }, /*#__PURE__*/React.createElement("label", null, "Name", /*#__PURE__*/React.createElement("input", {
      className: "text-input",
      value: g.name,
      onChange: e => updateGear(g.id, {
        name: e.target.value
      })
    }))), /*#__PURE__*/React.createElement("div", {
      className: "variant-manager"
    }, /*#__PURE__*/React.createElement("div", {
      className: "variant-manager-label"
    }, "Available Weights (lb)"), /*#__PURE__*/React.createElement("div", {
      className: "weight-chip-row"
    }, g.weights.map(w => /*#__PURE__*/React.createElement("div", {
      key: w,
      className: "gear-weight-chip"
    }, /*#__PURE__*/React.createElement("span", null, w), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => removeGearWeight(g.id, w)
    }, /*#__PURE__*/React.createElement(X, {
      size: 10
    })))), g.weights.length === 0 && /*#__PURE__*/React.createElement("div", {
      className: "empty-inline"
    }, "No weights yet — add one below.")), /*#__PURE__*/React.createElement("div", {
      className: "gear-add-weight-row"
    }, /*#__PURE__*/React.createElement(NumberField, {
      className: "variant-num-input",
      value: newGearWeightInputs[g.id] ?? 0,
      onChange: val => setNewGearWeightInputs(prev => ({
        ...prev,
        [g.id]: val
      })),
      min: 0
    }), /*#__PURE__*/React.createElement("span", {
      className: "variant-unit"
    }, "lb"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => {
        const val = newGearWeightInputs[g.id] ?? 0;
        addGearWeight(g.id, val);
        setNewGearWeightInputs(prev => ({
          ...prev,
          [g.id]: 0
        }));
      }
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 12
    }), " Add Weight"))), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm btn-block danger",
      onClick: () => deleteGear(g.id)
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 13
    }), " Delete Gear")))), (state.gear || []).length === 0 && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      className: "empty-state"
    }, /*#__PURE__*/React.createElement(Settings, {
      size: 28,
      strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("p", null, "No gear configured yet."))))), tab === "tracks" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      ref: tracksFileInputRef,
      type: "file",
      accept: "audio/*",
      multiple: true,
      style: {
        display: "none"
      },
      onChange: handleTracksFilesPicked
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block",
      style: {
        marginBottom: 12
      },
      onClick: () => tracksFileInputRef.current?.click()
    }, /*#__PURE__*/React.createElement(NotebookPen, {
      size: 14
    }), " Import Music"), !audioStatus.hasFiles && (state.tracks || []).length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "empty-inline",
      style: {
        marginBottom: 12
      }
    }, "These tracks were picked in an earlier session — tap Import Music and re-select the same files to make them playable again this session."), /*#__PURE__*/React.createElement("div", {
      className: "exercise-manage-list"
    }, (state.tracks || []).map(t => /*#__PURE__*/React.createElement(Card, {
      key: t.id,
      className: "track-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "track-row-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-name"
    }, t.name), /*#__PURE__*/React.createElement("div", {
      className: "exercise-row-req"
    }, audioPlayer.hasFile(t.name) ? "Loaded" : "Not loaded this session")), /*#__PURE__*/React.createElement("button", {
      className: `btn btn-sm ${t.enabled ? "btn-primary" : "btn-ghost"}`,
      onClick: () => toggleTrack(t.id)
    }, t.enabled ? "On" : "Off"), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => removeTrack(t.id)
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 13
    })))), (state.tracks || []).length === 0 && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      className: "empty-state"
    }, /*#__PURE__*/React.createElement(NotebookPen, {
      size: 28,
      strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("p", null, "No tracks yet — import some audio files to get started."))))), pendingConfirm && /*#__PURE__*/React.createElement("div", {
      className: "modal-backdrop",
      onClick: () => setPendingConfirm(null)
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("h3", null, "Are you sure?"), /*#__PURE__*/React.createElement("p", {
      className: "modal-sub"
    }, pendingConfirm.message), /*#__PURE__*/React.createElement("div", {
      className: "confirm-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-block",
      onClick: () => setPendingConfirm(null)
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block danger-solid",
      onClick: () => {
        pendingConfirm.onConfirm();
        setPendingConfirm(null);
      }
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 14
    }), " Delete")))));
  }

  /* ============================================================
     HISTORY VIEW
     ============================================================ */

  function SessionsSubview({
    state
  }) {
    const [sortId, setSortId] = useState("default");
    const {
      stats,
      originalOrder
    } = useMemo(() => {
      const map = {};
      const order = [];
      state.history.forEach(h => {
        if (!h.sessionName) return;
        if (!map[h.sessionName]) {
          map[h.sessionName] = {
            name: h.sessionName,
            timesLogged: 0,
            completedCount: 0,
            skippedCount: 0,
            totalDurationSec: 0,
            totalSets: 0,
            totalReps: 0,
            totalWeight: 0
          };
          order.push(h.sessionName);
        }
        const m = map[h.sessionName];
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
      Object.values(map).forEach(m => {
        m.avgDurationSec = m.completedCount ? m.totalDurationSec / m.completedCount : 0;
      });
      return {
        stats: Object.values(map),
        originalOrder: order
      };
    }, [state.history]);
    const sortedStats = useMemo(() => sortStats(stats, sortId, originalOrder), [stats, sortId, originalOrder]);
    if (stats.length === 0) {
      return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
        className: "empty-state"
      }, /*#__PURE__*/React.createElement(HistoryIcon, {
        size: 28,
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("p", null, "No workouts logged yet.")));
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sort-row"
    }, /*#__PURE__*/React.createElement(SortSelect, {
      value: sortId,
      onChange: setSortId,
      options: SORT_OPTIONS_WITH_DURATION
    })), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-list"
    }, sortedStats.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.name,
      className: "exercise-stats-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-name"
    }, s.name), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.completedCount), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Completed")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.skippedCount), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Skipped")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.totalSets.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total sets")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.totalReps.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total reps")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num accent"
    }, s.totalWeight.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total Weight (lb)")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.totalReps ? (s.totalWeight / s.totalReps).toFixed(1) : "0.0"), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Weight/Rep (lb)")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, fmtWorkoutDuration(s.totalDurationSec)), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total Duration")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, fmtWorkoutDuration(s.avgDurationSec)), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Avg Duration")))))));
  }
  function ChallengesSubview({
    state
  }) {
    const [sortId, setSortId] = useState("default");
    const {
      stats,
      originalOrder
    } = useMemo(() => {
      // First compute one real span-duration per distinct workout occurrence
      // (workoutId), since a challenge's duration is wall-clock time from its
      // first workout-start to its last completion — not a sum of session times.
      const byWorkoutId = {};
      state.history.forEach(h => {
        if (!h.workoutId) return;
        if (!byWorkoutId[h.workoutId]) byWorkoutId[h.workoutId] = {
          workoutName: h.workoutName,
          records: []
        };
        byWorkoutId[h.workoutId].records.push(h);
      });
      const map = {};
      const order = [];
      Object.values(byWorkoutId).forEach(({
        workoutName,
        records
      }) => {
        if (!workoutName) return;
        if (!map[workoutName]) {
          map[workoutName] = {
            name: workoutName,
            timesLogged: 0,
            completedCount: 0,
            skippedCount: 0,
            totalDurationSec: 0,
            occurrenceCount: 0,
            totalSets: 0,
            totalReps: 0,
            totalWeight: 0
          };
          order.push(workoutName);
        }
        const m = map[workoutName];
        const completedRecords = records.filter(r => r.status === "completed");
        m.timesLogged += records.length;
        m.completedCount += completedRecords.length;
        m.skippedCount += records.filter(r => r.status === "skipped").length;
        m.totalWeight += completedRecords.reduce((sum, r) => sum + sessionTotalWeight(r), 0);
        m.totalReps += completedRecords.reduce((sum, r) => sum + sessionTotalReps(r), 0);
        m.totalSets += completedRecords.reduce((sum, r) => sum + (r.exercises || []).reduce((s2, e) => s2 + (e.sets || DEFAULT_SETS_PER_EXERCISE), 0), 0);
        if (completedRecords.length > 0) {
          m.totalDurationSec += spanDurationSec(completedRecords);
          m.occurrenceCount += 1;
        }
      });
      Object.values(map).forEach(m => {
        m.avgDurationSec = m.occurrenceCount ? m.totalDurationSec / m.occurrenceCount : 0;
      });
      return {
        stats: Object.values(map),
        originalOrder: order
      };
    }, [state.history]);
    const sortedStats = useMemo(() => sortStats(stats, sortId, originalOrder), [stats, sortId, originalOrder]);
    if (stats.length === 0) {
      return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
        className: "empty-state"
      }, /*#__PURE__*/React.createElement(Settings, {
        size: 28,
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("p", null, "No challenge activity yet.")));
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sort-row"
    }, /*#__PURE__*/React.createElement(SortSelect, {
      value: sortId,
      onChange: setSortId,
      options: SORT_OPTIONS_WITH_DURATION
    })), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-list"
    }, sortedStats.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.name,
      className: "exercise-stats-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-name"
    }, s.name), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.completedCount), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Workouts done")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.skippedCount), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Skipped")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.totalSets.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total sets")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.totalReps.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total reps")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, fmtChallengeDuration(s.totalDurationSec)), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total Duration")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, fmtChallengeDuration(s.avgDurationSec)), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Avg Duration")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num accent"
    }, s.totalWeight.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Total Weight (lb)")), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-num"
    }, s.totalReps ? (s.totalWeight / s.totalReps).toFixed(1) : "0.0"), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-label"
    }, "Weight/Rep (lb)")))))));
  }
  function ExercisesSubview({
    state
  }) {
    const exMap = useMemo(() => Object.fromEntries(state.exercises.map(e => [e.id, e])), [state.exercises]);
    const [expandedEx, setExpandedEx] = useState(null);
    const [sortId, setSortId] = useState("default");
    const {
      stats,
      originalOrder
    } = useMemo(() => {
      const map = {};
      const order = [];
      state.history.forEach(h => {
        if (h.status !== "completed") return;
        (h.exercises || []).forEach(e => {
          if (!map[e.exId]) {
            map[e.exId] = {
              exId: e.exId,
              name: e.name,
              timesPerformed: 0,
              totalSets: 0,
              totalReps: 0,
              totalWeight: 0,
              weightPerSetSum: 0,
              byWeight: {}
            };
            order.push(e.name);
          }
          const sets = e.sets || DEFAULT_SETS_PER_EXERCISE;
          const weight = e.weight || 0;
          map[e.exId].timesPerformed += 1;
          map[e.exId].totalSets += sets;
          map[e.exId].totalReps += exResultReps(e);
          map[e.exId].totalWeight += exResultWeight(e);
          map[e.exId].weightPerSetSum += weight;
          // Track every completed rep count seen at this weight, in chronological
          // order, so the expanded view can show the progression over time.
          if (!map[e.exId].byWeight[weight]) map[e.exId].byWeight[weight] = [];
          map[e.exId].byWeight[weight].push({
            date: h.date,
            reps: e.reps || 0
          });
        });
      });
      const repGainsCountByEx = {};
      Object.keys(state.awardedRepGainBonus || {}).forEach(key => {
        const exId = key.split(":")[1];
        repGainsCountByEx[exId] = (repGainsCountByEx[exId] || 0) + 1;
      });
      Object.values(map).forEach(m => {
        m.repGainsCount = repGainsCountByEx[m.exId] || 0;
        // Sort each weight's history chronologically (oldest first) for display.
        Object.values(m.byWeight).forEach(list => list.sort((a, b) => new Date(a.date) - new Date(b.date)));
      });
      return {
        stats: Object.values(map),
        originalOrder: order
      };
    }, [state.history, state.awardedRepGainBonus]);
    const sortedStats = useMemo(() => sortStats(stats, sortId, originalOrder), [stats, sortId, originalOrder]);
    if (stats.length === 0) {
      return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
        className: "empty-state"
      }, /*#__PURE__*/React.createElement(Dumbbell, {
        size: 28,
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("p", null, "No completed exercises yet.")));
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sort-row"
    }, /*#__PURE__*/React.createElement(SortSelect, {
      value: sortId,
      onChange: setSortId,
      options: SORT_OPTIONS_NO_DURATION
    })), /*#__PURE__*/React.createElement("div", {
      className: "exercise-stats-list"
    }, sortedStats.map(s => {
      const isOpen = expandedEx === s.exId;
      const weightsDesc = Object.keys(s.byWeight).map(Number).sort((a, b) => b - a);
      return /*#__PURE__*/React.createElement(Card, {
        key: s.exId,
        className: "exercise-stats-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-header",
        onClick: () => setExpandedEx(isOpen ? null : s.exId)
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-name"
      }, s.name, " ", exMap[s.exId]?.isBonus && /*#__PURE__*/React.createElement("span", {
        className: "bonus-tag"
      }, "Bonus")), isOpen ? /*#__PURE__*/React.createElement(ChevronUp, {
        size: 16
      }) : /*#__PURE__*/React.createElement(ChevronDown, {
        size: 16
      })), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-grid"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-cell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-num"
      }, s.timesPerformed), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-label"
      }, "Times performed")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-cell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-num"
      }, s.totalSets.toLocaleString()), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-label"
      }, "Total sets")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-cell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-num"
      }, s.totalReps.toLocaleString()), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-label"
      }, "Total reps")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-cell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-num"
      }, Math.round(s.weightPerSetSum / s.timesPerformed).toLocaleString()), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-label"
      }, "Avg lb/set")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-cell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-num accent"
      }, s.totalWeight.toLocaleString()), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-label"
      }, "Total Weight (lb)")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-cell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-num"
      }, s.totalReps ? (s.totalWeight / s.totalReps).toFixed(1) : "0.0"), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-label"
      }, "Weight/Rep (lb)")), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-cell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-num",
        style: {
          color: "var(--gold)"
        }
      }, s.repGainsCount), /*#__PURE__*/React.createElement("div", {
        className: "exercise-stats-label"
      }, "Rep Gains"))), isOpen && /*#__PURE__*/React.createElement("div", {
        className: "exercise-weight-progress"
      }, weightsDesc.map(weight => /*#__PURE__*/React.createElement("div", {
        key: weight,
        className: "exercise-weight-progress-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "exercise-weight-progress-label"
      }, weight.toLocaleString(), " lb"), /*#__PURE__*/React.createElement("div", {
        className: "exercise-weight-progress-reps"
      }, s.byWeight[weight].map((entry, i) => /*#__PURE__*/React.createElement("span", {
        key: i,
        className: "mono"
      }, entry.reps, i < s.byWeight[weight].length - 1 ? " → " : "")))))));
    })));
  }
  function PlansSubview({
    state,
    preselectPlan,
    onConsumePreselect
  }) {
    const groups = useMemo(() => derivePlanGroups(state), [state.history, state.plans]);
    const [sortId, setSortId] = useState("recency");
    const sortedGroups = useMemo(() => {
      // Reuse the shared sorter by presenting each group with a "name" field and
      // a recency timestamp (most recent run's start date) for the default sort.
      const withName = groups.map(g => ({
        ...g,
        name: g.planName,
        _recency: g.runs[0]?.startDate ? new Date(g.runs[0].startDate).getTime() : 0
      }));
      if (sortId === "recency") return [...withName].sort((a, b) => b._recency - a._recency);
      return sortStats(withName, sortId, null);
    }, [groups, sortId]);
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [expandedRun, setExpandedRun] = useState(null);
    const [expandedWorkout, setExpandedWorkout] = useState(null);
    const [expandedSession, setExpandedSession] = useState(null);
    useEffect(() => {
      if (preselectPlan) {
        setExpandedPlan(preselectPlan);
        // Auto-expand its most recent run too, so the completion the user just
        // finished is immediately visible rather than requiring another tap.
        const group = groups.find(g => g.planName === preselectPlan);
        if (group && group.runs[0]) setExpandedRun(group.runs[0].id);
        onConsumePreselect && onConsumePreselect();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preselectPlan]);
    if (groups.length === 0) {
      return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
        className: "empty-state"
      }, /*#__PURE__*/React.createElement(Target, {
        size: 28,
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("p", null, "No plan activity yet.")));
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sort-row"
    }, /*#__PURE__*/React.createElement(SortSelect, {
      value: sortId,
      onChange: setSortId,
      options: SORT_OPTIONS_PLANS
    })), /*#__PURE__*/React.createElement("div", {
      className: "plan-groups-list"
    }, sortedGroups.map(g => {
      const isOpen = expandedPlan === g.planName;
      return /*#__PURE__*/React.createElement(Card, {
        key: g.planName,
        className: "plan-group-card"
      }, /*#__PURE__*/React.createElement("div", {
        className: "plan-group-header",
        onClick: () => setExpandedPlan(isOpen ? null : g.planName)
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "plan-group-title"
      }, g.planName), /*#__PURE__*/React.createElement("div", {
        className: "plan-group-sub"
      }, g.timesCompleted, " completed · avg ", fmtPlanDuration(Math.round(g.avgDurationSec)), " · ", g.totalWeight.toLocaleString(), " lb · ", g.totalReps.toLocaleString(), " reps")), isOpen ? /*#__PURE__*/React.createElement(ChevronUp, {
        size: 16
      }) : /*#__PURE__*/React.createElement(ChevronDown, {
        size: 16
      })), isOpen && /*#__PURE__*/React.createElement("div", {
        className: "plan-run-list"
      }, g.runs.map(run => {
        const isRunOpen = expandedRun === run.id;
        return /*#__PURE__*/React.createElement("div", {
          key: run.id,
          className: "plan-run-block"
        }, /*#__PURE__*/React.createElement("div", {
          className: "plan-run-header",
          onClick: () => setExpandedRun(isRunOpen ? null : run.id)
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          className: "plan-run-title"
        }, run.isPartial ? "In progress" : "Completed", " · ", fmtDateTime(run.startDate)), /*#__PURE__*/React.createElement("div", {
          className: "plan-run-sub"
        }, fmtPlanDuration(run.totalDurationSec), " · ", run.totalWeight.toLocaleString(), " lb · ", run.totalReps.toLocaleString(), " reps · ", run.completedCount, " done", run.skippedCount > 0 ? `, ${run.skippedCount} skipped` : "")), isRunOpen ? /*#__PURE__*/React.createElement(ChevronUp, {
          size: 14
        }) : /*#__PURE__*/React.createElement(ChevronDown, {
          size: 14
        })), isRunOpen && /*#__PURE__*/React.createElement("div", {
          className: "plan-run-body"
        }, run.workouts.map(w => {
          const wKey = run.id + "_" + w.workoutId;
          const isWOpen = expandedWorkout === wKey;
          const wCompleted = w.sessions.filter(s => s.status === "completed").length;
          const wSkipped = w.sessions.filter(s => s.status === "skipped").length;
          const wWeight = w.sessions.reduce((sum, s) => sum + (s.status === "completed" ? sessionTotalWeight(s) : 0), 0);
          const wReps = w.sessions.reduce((sum, s) => sum + (s.status === "completed" ? sessionTotalReps(s) : 0), 0);
          return /*#__PURE__*/React.createElement("div", {
            key: wKey,
            className: "plan-run-workout"
          }, /*#__PURE__*/React.createElement("div", {
            className: "plan-run-workout-header",
            onClick: () => setExpandedWorkout(isWOpen ? null : wKey)
          }, /*#__PURE__*/React.createElement("div", {
            className: "session-block-title small"
          }, w.workoutName), /*#__PURE__*/React.createElement("div", {
            className: "plan-run-workout-sub"
          }, fmtChallengeDuration(w.durationSec), " · ", wCompleted, " done", wSkipped > 0 ? `, ${wSkipped} skipped` : "", " · ", wWeight.toLocaleString(), " lb · ", wReps.toLocaleString(), " reps")), isWOpen && /*#__PURE__*/React.createElement("div", {
            className: "plan-run-sessions"
          }, w.sessions.map(s => {
            const sKey = wKey + "_" + s.id;
            const isSOpen = expandedSession === sKey;
            const canExpand = s.status === "completed" && (s.exercises || []).length > 0;
            return /*#__PURE__*/React.createElement("div", {
              key: s.id,
              className: "plan-run-session-block"
            }, /*#__PURE__*/React.createElement("div", {
              className: `plan-run-session-row ${canExpand ? "clickable" : ""}`,
              onClick: () => canExpand && setExpandedSession(isSOpen ? null : sKey)
            }, /*#__PURE__*/React.createElement("div", {
              className: `history-status-dot ${s.status}`
            }), /*#__PURE__*/React.createElement("div", {
              className: "plan-run-session-main"
            }, /*#__PURE__*/React.createElement("div", {
              className: "plan-run-session-title"
            }, s.sessionName), /*#__PURE__*/React.createElement("div", {
              className: "plan-run-session-sub"
            }, s.status === "pending" && "Not yet done", s.status !== "pending" && fmtDateTime(s.date), s.status === "completed" && /*#__PURE__*/React.createElement(React.Fragment, null, " · ", fmtWorkoutDuration(s.durationSec), " · ", sessionTotalWeight(s).toLocaleString(), " lb · ", sessionTotalReps(s).toLocaleString(), " reps · ", (s.exercises || []).reduce((sum, e) => sum + (e.sets || DEFAULT_SETS_PER_EXERCISE), 0), " sets"), s.status === "skipped" && /*#__PURE__*/React.createElement(React.Fragment, null, " · Skipped (", s.skipReason, s.skipNote ? `: ${s.skipNote}` : "", ")"), s.bonusExId && /*#__PURE__*/React.createElement(React.Fragment, null, " · ", /*#__PURE__*/React.createElement(Star, {
              size: 10,
              style: {
                display: "inline",
                verticalAlign: -1
              },
              fill: "var(--gold)",
              stroke: "var(--gold)"
            }), " Bonus used"))), canExpand && (isSOpen ? /*#__PURE__*/React.createElement(ChevronUp, {
              size: 12
            }) : /*#__PURE__*/React.createElement(ChevronDown, {
              size: 12
            }))), isSOpen && /*#__PURE__*/React.createElement("div", {
              className: "plan-run-exercise-list"
            }, (s.exercises || []).map(e => /*#__PURE__*/React.createElement("div", {
              key: e.instId,
              className: "plan-run-exercise-row"
            }, /*#__PURE__*/React.createElement("span", null, e.name, " ", e.isBonus && /*#__PURE__*/React.createElement("span", {
              className: "bonus-tag"
            }, "Bonus")), /*#__PURE__*/React.createElement("span", {
              className: "mono"
            }, e.variantLabel, ": ", e.sets || DEFAULT_SETS_PER_EXERCISE, " sets × ", e.reps, "r/set × ", fmtWeightEntries(e.weightEntries), " → ", exResultWeight(e).toLocaleString(), " lb · ", exResultReps(e), " reps")))));
          })));
        })));
      })));
    })));
  }
  function HistoryView({
    state,
    preselectPlan,
    onConsumePreselect
  }) {
    const [tab, setTab] = useState(preselectPlan ? "plans" : "plans");
    useEffect(() => {
      if (preselectPlan) {
        setTab("plans");
      }
    }, [preselectPlan]);
    return /*#__PURE__*/React.createElement("div", {
      className: "view-pad"
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      sub: "Completed and skipped activity — completed workouts are locked"
    }, "History"), /*#__PURE__*/React.createElement("div", {
      className: "tab-row"
    }, /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "plans" ? "active" : ""}`,
      onClick: () => setTab("plans")
    }, "Plans"), /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "challenges" ? "active" : ""}`,
      onClick: () => setTab("challenges")
    }, "Challenges"), /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "sessions" ? "active" : ""}`,
      onClick: () => setTab("sessions")
    }, "Workouts"), /*#__PURE__*/React.createElement("button", {
      className: `tab-btn ${tab === "exercises" ? "active" : ""}`,
      onClick: () => setTab("exercises")
    }, "Exercises")), tab === "plans" && /*#__PURE__*/React.createElement(PlansSubview, {
      state: state,
      preselectPlan: preselectPlan,
      onConsumePreselect: onConsumePreselect
    }), tab === "challenges" && /*#__PURE__*/React.createElement(ChallengesSubview, {
      state: state
    }), tab === "sessions" && /*#__PURE__*/React.createElement(SessionsSubview, {
      state: state
    }), tab === "exercises" && /*#__PURE__*/React.createElement(ExercisesSubview, {
      state: state
    }));
  }

  /* ============================================================
     PROGRESS VIEW
     ============================================================ */

  function ProgressView({
    state,
    setState
  }) {
    const completed = state.history.filter(h => h.status === "completed");
    const skipped = state.history.filter(h => h.status === "skipped");
    const totalWeightLifted = completed.reduce((sum, h) => sum + sessionTotalWeight(h), 0);
    const totalRepsCompleted = completed.reduce((sum, h) => sum + sessionTotalReps(h), 0);
    const totalTimeSec = completed.reduce((sum, h) => sum + (h.durationSec || 0), 0);
    const workoutIds = new Set(completed.map(h => h.workoutId));
    const exerciseIds = new Set();
    completed.forEach(h => (h.exercises || []).forEach(e => exerciseIds.add(e.exId)));
    const planGroups = useMemo(() => derivePlanGroups(state), [state.history, state.plans]);
    const totalPlanRunsCompleted = planGroups.reduce((sum, g) => sum + g.timesCompleted, 0);
    const totalLifetimeGains = Object.keys(state.awardedRepGainBonus || {}).length;
    const [range, setRange] = useState("day");
    const [metric, setMetric] = useState("weight");
    // For time ranges, this counts how many whole calendar units (days/months/years)
    // are included, extending backward from the current one. For structural ranges,
    // this is the point count directly (doubles/halves via the +/- control).
    const [dayUnits, setDayUnits] = useState(1);
    const [monthUnits, setMonthUnits] = useState(1);
    const [yearUnits, setYearUnits] = useState(1);
    const [structuralCount, setStructuralCount] = useState(10);
    const RANGE_OPTIONS = [{
      id: "day",
      label: "Day",
      singular: "Hour"
    }, {
      id: "month",
      label: "Month",
      singular: "Day"
    }, {
      id: "year",
      label: "Year",
      singular: "Month"
    }, {
      id: "plans",
      label: "Plans",
      singular: "Plan"
    }, {
      id: "challenges",
      label: "Challenges",
      singular: "Challenge"
    }, {
      id: "workouts",
      label: "Workouts",
      singular: "Workout"
    }, {
      id: "exercises",
      label: "Exercises",
      singular: "Exercise"
    }];
    const METRIC_OPTIONS = [{
      id: "weight",
      label: "Weight",
      unit: "lb"
    }, {
      id: "reps",
      label: "Reps",
      unit: ""
    }, {
      id: "weightPerRep",
      label: "Weight/Rep",
      unit: "lb"
    }, {
      id: "time",
      label: "Time",
      unit: "s"
    }];
    const isTimeRange = ["day", "month", "year"].includes(range);
    const incrementRange = () => {
      if (range === "day") setDayUnits(n => n + 1);else if (range === "month") setMonthUnits(n => n + 1);else if (range === "year") setYearUnits(n => n + 1);else setStructuralCount(n => n * 2);
    };
    const decrementRange = () => {
      if (range === "day") setDayUnits(n => Math.max(1, n - 1));else if (range === "month") setMonthUnits(n => Math.max(1, n - 1));else if (range === "year") setYearUnits(n => Math.max(1, n - 1));else setStructuralCount(n => Math.max(1, Math.floor(n / 2)));
    };
    const currentIncrementCount = range === "day" ? dayUnits : range === "month" ? monthUnits : range === "year" ? yearUnits : structuralCount;

    // Build one data point per bucket for the selected range, each carrying all four
    // metrics so switching the metric selector doesn't require re-bucketing. Every
    // point keeps a hidden "detail" (real name or date/time) that only surfaces in
    // the tooltip — the X-axis itself only ever shows a plain increment number.
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
      if (range === "day") {
        // Today's 24 hourly buckets, extended backward by whole additional days
        // as dayUnits increases (each earlier day contributes its own 24 hours).
        const now = new Date();
        const buckets = [];
        for (let dayOffset = dayUnits - 1; dayOffset >= 0; dayOffset--) {
          const dayStart = new Date(now);
          dayStart.setHours(0, 0, 0, 0);
          dayStart.setDate(dayStart.getDate() - dayOffset);
          const hoursInThisDay = dayOffset === 0 ? now.getHours() + 1 : 24;
          for (let h = 0; h < hoursInThisDay; h++) {
            const d = new Date(dayStart);
            d.setHours(h);
            const end = new Date(d);
            end.setHours(end.getHours() + 1);
            buckets.push({
              start: d,
              end,
              detail: d.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric"
              })
            });
          }
        }
        return buckets.map(b => pointFor(completed.filter(h => {
          const d = new Date(h.date);
          return d >= b.start && d < b.end;
        }), b.detail));
      }
      if (range === "month") {
        // Days 1..today of the current month, extended backward by whole additional
        // months as monthUnits increases.
        const now = new Date();
        const buckets = [];
        for (let monthOffset = monthUnits - 1; monthOffset >= 0; monthOffset--) {
          const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
          const isCurrentMonth = monthOffset === 0;
          const daysInThisMonth = isCurrentMonth ? now.getDate() : new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
          for (let day = 1; day <= daysInThisMonth; day++) {
            const d = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            const end = new Date(d);
            end.setDate(end.getDate() + 1);
            buckets.push({
              start: d,
              end,
              detail: d.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            });
          }
        }
        return buckets.map(b => pointFor(completed.filter(h => {
          const d = new Date(h.date);
          return d >= b.start && d < b.end;
        }), b.detail));
      }
      if (range === "year") {
        // Jan..current month of the current year, extended backward by whole
        // additional years as yearUnits increases.
        const now = new Date();
        const buckets = [];
        for (let yearOffset = yearUnits - 1; yearOffset >= 0; yearOffset--) {
          const y = now.getFullYear() - yearOffset;
          const isCurrentYear = yearOffset === 0;
          const monthsInThisYear = isCurrentYear ? now.getMonth() + 1 : 12;
          for (let m = 0; m < monthsInThisYear; m++) {
            const d = new Date(y, m, 1);
            const end = new Date(y, m + 1, 1);
            buckets.push({
              start: d,
              end,
              detail: d.toLocaleDateString(undefined, {
                month: "short",
                year: "numeric"
              })
            });
          }
        }
        return buckets.map(b => pointFor(completed.filter(h => {
          const d = new Date(h.date);
          return d >= b.start && d < b.end;
        }), b.detail));
      }
      if (range === "plans") {
        const allRuns = planGroups.flatMap(g => g.runs.filter(r => !r.isPartial).map(r => ({
          ...r,
          planName: g.planName
        })));
        allRuns.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        return allRuns.map(r => pointFor(state.history.filter(h => h.iterationId === r.id && h.status === "completed"), r.planName));
      }
      if (range === "challenges") {
        // One point per actual challenge occurrence (workoutId), not one per
        // unique challenge name — otherwise repeats of the same challenge would
        // collapse into a single point and hide most of the history.
        const byWorkoutId = {};
        completed.forEach(h => {
          if (!h.workoutId) return;
          if (!byWorkoutId[h.workoutId]) byWorkoutId[h.workoutId] = {
            workoutName: h.workoutName,
            records: []
          };
          byWorkoutId[h.workoutId].records.push(h);
        });
        const occurrences = Object.values(byWorkoutId);
        occurrences.sort((a, b) => new Date(a.records[0].date) - new Date(b.records[0].date));
        return occurrences.map(o => pointFor(o.records, o.workoutName));
      }
      if (range === "workouts") {
        // One point per completed workout event — chronological, not deduped by name.
        const sorted = [...completed].sort((a, b) => new Date(a.date) - new Date(b.date));
        return sorted.map(h => pointFor([h], h.sessionName));
      }
      if (range === "exercises") {
        const byExercise = {};
        completed.forEach(h => {
          (h.exercises || []).forEach(e => {
            if (!byExercise[e.name]) byExercise[e.name] = [];
            byExercise[e.name].push(e);
          });
        });
        return Object.entries(byExercise).map(([name, exs]) => {
          const totalW = exs.reduce((sum, e) => sum + exResultWeight(e), 0);
          const totalR = exs.reduce((sum, e) => sum + exResultReps(e), 0);
          return {
            detail: name,
            weight: totalW,
            reps: totalR,
            weightPerRep: totalR > 0 ? totalW / totalR : 0,
            time: 0,
            count: exs.length
          };
        });
      }
      return [];
    }, [range, completed, planGroups, state.history]);

    // Show only the most recent MAX_POINTS increments, most recent at the far right.
    const recentPoints = isTimeRange ? points : points.slice(-structuralCount);
    const nonEmptyPoints = isTimeRange ? recentPoints : recentPoints.filter(p => p.count > 0);

    // Trend: compare the average of the first half of points to the second half.
    const trendFor = key => {
      if (nonEmptyPoints.length < 2) return null;
      const mid = Math.ceil(nonEmptyPoints.length / 2);
      const firstHalf = nonEmptyPoints.slice(0, mid);
      const secondHalf = nonEmptyPoints.slice(mid);
      if (secondHalf.length === 0) return null;
      const avg = arr => arr.reduce((sum, p) => sum + p[key], 0) / arr.length;
      const a = avg(firstHalf);
      const b = avg(secondHalf);
      if (a === 0) return null;
      const pct = (b - a) / a * 100;
      return {
        pct,
        up: pct >= 0
      };
    };
    const avgWeight = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.weight, 0) / nonEmptyPoints.length : 0;
    const avgReps = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.reps, 0) / nonEmptyPoints.length : 0;
    const avgWeightPerRep = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.weightPerRep, 0) / nonEmptyPoints.length : 0;
    const avgTime = nonEmptyPoints.length ? nonEmptyPoints.reduce((s, p) => s + p.time, 0) / nonEmptyPoints.length : 0;
    const AVG_STATS = [{
      key: "weight",
      label: "Avg Weight",
      value: `${Math.round(avgWeight).toLocaleString()} lb`,
      trend: trendFor("weight")
    }, {
      key: "reps",
      label: "Avg Reps",
      value: Math.round(avgReps).toLocaleString(),
      trend: trendFor("reps")
    }, {
      key: "weightPerRep",
      label: "Avg Weight/Rep",
      value: `${avgWeightPerRep.toFixed(1)} lb`,
      trend: trendFor("weightPerRep")
    }, {
      key: "time",
      label: "Avg Time",
      value: fmtAdaptiveDuration(avgTime),
      trend: trendFor("time")
    }];
    const activeMetric = METRIC_OPTIONS.find(m => m.id === metric);
    const chartData = nonEmptyPoints.map((p, i) => ({
      x: i + 1,
      detail: p.detail,
      value: metric === "weightPerRep" ? Number(p.weightPerRep.toFixed(1)) : p[metric]
    }));
    const totalWeightTonnes = totalWeightLifted / 2000; // 1 t = 2000 lb (US short ton)

    return /*#__PURE__*/React.createElement("div", {
      className: "view-pad"
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      sub: "Averages, trends, and bonus stars"
    }, "Progress"), /*#__PURE__*/React.createElement(SectionTitle, null, "Trends per ", RANGE_OPTIONS.find(r => r.id === range).singular), /*#__PURE__*/React.createElement("div", {
      className: "avg-stats-grid"
    }, AVG_STATS.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.key,
      className: "avg-stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "avg-stat-label"
    }, s.label), /*#__PURE__*/React.createElement("div", {
      className: "avg-stat-value"
    }, s.value), s.trend && /*#__PURE__*/React.createElement("div", {
      className: `avg-stat-trend ${s.trend.up ? "up" : "down"}`
    }, s.trend.up ? "↑" : "↓", " ", Math.abs(s.trend.pct).toFixed(0), "%")))), /*#__PURE__*/React.createElement("div", {
      className: "chart-header-row"
    }, /*#__PURE__*/React.createElement(SectionTitle, null, activeMetric.label, " by ", RANGE_OPTIONS.find(r => r.id === range).singular), /*#__PURE__*/React.createElement("div", {
      className: "chart-select-group"
    }, /*#__PURE__*/React.createElement("select", {
      className: "text-input metric-select",
      value: range,
      onChange: e => setRange(e.target.value)
    }, RANGE_OPTIONS.map(r => /*#__PURE__*/React.createElement("option", {
      key: r.id,
      value: r.id
    }, r.label))), /*#__PURE__*/React.createElement("select", {
      className: "text-input metric-select",
      value: metric,
      onChange: e => setMetric(e.target.value)
    }, METRIC_OPTIONS.map(m => /*#__PURE__*/React.createElement("option", {
      key: m.id,
      value: m.id
    }, m.label))))), /*#__PURE__*/React.createElement("div", {
      className: "increment-stepper"
    }, /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: decrementRange,
      disabled: currentIncrementCount <= 1,
      "aria-label": "Show fewer"
    }, /*#__PURE__*/React.createElement(ChevronLeft, {
      size: 14
    })), /*#__PURE__*/React.createElement("span", {
      className: "increment-stepper-label"
    }, isTimeRange ? `${currentIncrementCount} ${RANGE_OPTIONS.find(r => r.id === range).label.toLowerCase()}${currentIncrementCount === 1 ? "" : "s"} shown` : `${nonEmptyPoints.length} of last ${structuralCount} shown`), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: incrementRange,
      "aria-label": "Show more"
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      size: 14
    }))), chartData.length === 0 ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      className: "empty-state"
    }, /*#__PURE__*/React.createElement("p", null, "Complete a workout to see your trend here."))) : /*#__PURE__*/React.createElement(Card, {
      className: "chart-card"
    }, /*#__PURE__*/React.createElement(SimpleLineChart, {
      data: chartData,
      height: 200,
      valueFormatter: value => metric === "time" ? fmtAdaptiveDuration(value) : `${value.toLocaleString()} ${activeMetric.unit}`.trim(),
      labelFormatter: point => point.detail
    })), /*#__PURE__*/React.createElement(Card, {
      className: "bonus-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bonus-card-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bonus-card-icon"
    }, /*#__PURE__*/React.createElement(Star, {
      size: 22,
      fill: "var(--gold)",
      stroke: "var(--gold)"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "bonus-card-num"
    }, state.bonusStars), /*#__PURE__*/React.createElement("div", {
      className: "bonus-card-label"
    }, "Bonus stars available"))), /*#__PURE__*/React.createElement("div", {
      className: "bonus-card-rules"
    }, /*#__PURE__*/React.createElement("div", null, "+1 for completing a plan"), /*#__PURE__*/React.createElement("div", null, "+1 for each bonus exercise completed"), /*#__PURE__*/React.createElement("div", null, "+1 for each new weight or rep gain"), /*#__PURE__*/React.createElement("div", null, "−1 for each workout skipped"))), /*#__PURE__*/React.createElement(Card, {
      className: "level-card"
    }, /*#__PURE__*/React.createElement(LevelDumbbell, {
      level: state.level,
      size: 104
    }), /*#__PURE__*/React.createElement("div", {
      className: "level-card-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "level-card-num"
    }, "Level ", state.level), /*#__PURE__*/React.createElement("div", {
      className: "level-card-sub"
    }, state.bonusStars < 0 ? `${Math.abs(state.bonusStars)} stars in debt` : `Next level costs ${levelUpCost(state.level)} star${levelUpCost(state.level) === 1 ? "" : "s"}`)), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      disabled: state.bonusStars < levelUpCost(state.level),
      onClick: () => setState(s => ({
        ...s,
        level: s.level + 1,
        bonusStars: s.bonusStars - levelUpCost(s.level)
      }))
    }, "Level Up")), /*#__PURE__*/React.createElement(SectionTitle, null, "Summary"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      className: "summary-stats"
    }, /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Flame, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Total weight lifted"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, totalWeightTonnes.toFixed(2), /*#__PURE__*/React.createElement("span", {
      className: "summary-unit"
    }, " t"))), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Flame, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Total reps"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, totalRepsCompleted.toLocaleString())), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Clock, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Total time spent working out"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, fmtLongDuration(totalTimeSec))), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Target, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Plans completed"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, totalPlanRunsCompleted)), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Settings, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Challenges completed"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, workoutIds.size)), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(TrendingUp, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Workouts completed"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, completed.length)), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Dumbbell, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Exercises completed"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, exerciseIds.size)), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(X, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Workouts skipped"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, skipped.length)), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Star, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Lifetime gains"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, totalLifetimeGains)), /*#__PURE__*/React.createElement("div", {
      className: "summary-row"
    }, /*#__PURE__*/React.createElement(Trophy, {
      size: 16
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-desc"
    }, "Bonus stars earned"), " ", /*#__PURE__*/React.createElement("span", {
      className: "summary-value"
    }, state.bonusStars)))));
  }

  /* ============================================================
     LOG VIEW
     ============================================================ */

  function LogView({
    state,
    setState
  }) {
    const [text, setText] = useState("");
    const addLog = () => {
      if (!text.trim()) return;
      setState(s => ({
        ...s,
        logs: [{
          id: uid("log"),
          date: new Date().toISOString(),
          text: text.trim()
        }, ...s.logs]
      }));
      setText("");
    };
    const deleteLog = id => setState(s => ({
      ...s,
      logs: s.logs.filter(l => l.id !== id)
    }));
    const reminders = state.logs.slice(0, 3).map(l => l.text.split(/[.,;]/)[0]);
    return /*#__PURE__*/React.createElement("div", {
      className: "view-pad"
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      sub: "Notes, reminders, and workout observations"
    }, "Exercise Log"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("textarea", {
      className: "text-input log-textarea",
      placeholder: "e.g. Need to lock wrists for chicken lifts...",
      value: text,
      onChange: e => setText(e.target.value)
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block",
      onClick: addLog
    }, /*#__PURE__*/React.createElement(NotebookPen, {
      size: 14
    }), " Save Note")), reminders.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Reminders"), /*#__PURE__*/React.createElement(Card, {
      className: "reminders-card"
    }, reminders.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "reminder-item"
    }, /*#__PURE__*/React.createElement(Flame, {
      size: 13
    }), /*#__PURE__*/React.createElement("span", null, r.trim()))))), /*#__PURE__*/React.createElement(SectionTitle, null, "All Notes"), state.logs.length === 0 ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      className: "empty-state"
    }, /*#__PURE__*/React.createElement(NotebookPen, {
      size: 28,
      strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("p", null, "No notes yet."))) : /*#__PURE__*/React.createElement("div", {
      className: "log-list"
    }, state.logs.map(l => /*#__PURE__*/React.createElement(Card, {
      key: l.id,
      className: "log-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "log-row-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "log-row-date"
    }, new Date(l.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })), /*#__PURE__*/React.createElement("div", {
      className: "log-row-text"
    }, l.text)), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => deleteLog(l.id)
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 14
    }))))));
  }

  /* ============================================================
     ROOT APP
     ============================================================ */

  const TABS = [{
    id: "workouts",
    label: "Plans",
    icon: Play
  }, {
    id: "plan",
    label: "Manage",
    icon: Settings
  }, {
    id: "history",
    label: "History",
    icon: HistoryIcon
  }, {
    id: "progress",
    label: "Progress",
    icon: Target
  }, {
    id: "log",
    label: "Log",
    icon: NotebookPen
  }];

  // Temporary on-device diagnostics strip — lets us see, without a computer,
  // whether storage writes/reads actually work on this device/browser, what's
  // currently saved, and which service-worker cache version is actually
  // controlling the page. Safe to remove once persistence issues are resolved.
  function DiagnosticsBar() {
    const [info, setInfo] = useState({
      loading: true
    });
    const [open, setOpen] = useState(false);
    useEffect(() => {
      (async () => {
        const out = {};
        out.origin = window.location.origin + window.location.pathname;
        try {
          window.localStorage.setItem("__diag_probe__", "1");
          out.storageWrite = window.localStorage.getItem("__diag_probe__") === "1";
          window.localStorage.removeItem("__diag_probe__");
        } catch (e) {
          out.storageWrite = false;
          out.storageError = e.message;
        }
        try {
          const raw = window.localStorage.getItem(STORE_KEY);
          out.savedLength = raw ? raw.length : 0;
        } catch (e) {
          out.savedLength = "error: " + e.message;
        }
        try {
          out.cacheNames = "caches" in window ? await window.caches.keys() : ["caches API unavailable"];
        } catch (e) {
          out.cacheNames = ["error: " + e.message];
        }
        out.swController = navigator.serviceWorker && navigator.serviceWorker.controller ? navigator.serviceWorker.controller.scriptURL : "none (page not controlled by a service worker)";
        out.loading = false;
        setInfo(out);
      })();
    }, []);
    if (info.loading) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontFamily: "monospace",
        color: "#8f8a80",
        padding: "4px 12px",
        borderBottom: "1px solid #2a2a2d",
        background: "#161617"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => setOpen(!open),
      style: {
        cursor: "pointer"
      }
    }, "\u{1F527}", " diag: storage=", info.storageWrite ? "ok" : "FAIL", " saved=", info.savedLength, "b cache=[", (info.cacheNames || []).join(",") || "none", "] ", open ? "\u25B2" : "\u25BC"), open && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        whiteSpace: "pre-wrap"
      }
    }, "origin: ", info.origin, "\n", "storage write/read: ", String(info.storageWrite), info.storageError ? " (" + info.storageError + ")" : "", "\n", "saved state bytes: ", String(info.savedLength), "\n", "cache buckets: ", (info.cacheNames || []).join(", ") || "none", "\n", "sw controller: ", info.swController));
  }
  function App() {
    const [state, setState] = useState(null);
    const [tab, setTab] = useState("workouts");
    const [loading, setLoading] = useState(true);
    const [confirmingReset, setConfirmingReset] = useState(false);
    const [historyPreselectPlan, setHistoryPreselectPlan] = useState(null);
    useEffect(() => {
      // Ask the browser not to evict this origin's storage under pressure —
      // the documented cause of installed PWAs on Android losing data even
      // though the save code itself is correct.
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(() => {});
      }
      (async () => {
        try {
          const loaded = await loadState();
          setState(loaded || defaultState());
        } catch (e) {
          // loadState threw because saved data existed but couldn't be
          // read/migrated. The raw data was already preserved under a backup
          // key by loadState itself — show a default here so the app is
          // usable, but do NOT treat this the same as a first-ever launch.
          setState(defaultState());
        }
        setLoading(false);
      })();
    }, []);
    useEffect(() => {
      if (state && !loading) saveState(state);
    }, [state, loading]);
    if (loading || !state) {
      return /*#__PURE__*/React.createElement("div", {
        className: "app-shell loading-shell"
      }, /*#__PURE__*/React.createElement("style", null, CSS), /*#__PURE__*/React.createElement(Loader2, {
        className: "spin",
        size: 28
      }), /*#__PURE__*/React.createElement("p", null, "Loading your workout data…"));
    }
    const resetData = () => {
      audioPlayer.clearAll(); // scrub cached track files/queue so nothing lingers past a reset
      setState(defaultState());
    };
    const viewPlanInHistory = planName => {
      setHistoryPreselectPlan(planName);
      setTab("history");
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "app-shell"
    }, /*#__PURE__*/React.createElement("style", null, CSS), /*#__PURE__*/React.createElement("header", {
      className: "app-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "app-header-brand"
    }, /*#__PURE__*/React.createElement(Dumbbell, {
      size: 20
    }), /*#__PURE__*/React.createElement("span", null, "IRONLOG")), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => setConfirmingReset(true),
      "aria-label": "Reset data"
    }, /*#__PURE__*/React.createElement(RotateCcw, {
      size: 16
    }))), /*#__PURE__*/React.createElement(DiagnosticsBar, null), /*#__PURE__*/React.createElement("main", {
      className: "app-main"
    }, tab === "workouts" && /*#__PURE__*/React.createElement(WorkoutsView, {
      state: state,
      setState: setState,
      onViewPlanHistory: viewPlanInHistory
    }), tab === "plan" && /*#__PURE__*/React.createElement(PlanView, {
      state: state,
      setState: setState
    }), tab === "history" && /*#__PURE__*/React.createElement(HistoryView, {
      state: state,
      preselectPlan: historyPreselectPlan,
      onConsumePreselect: () => setHistoryPreselectPlan(null)
    }), tab === "progress" && /*#__PURE__*/React.createElement(ProgressView, {
      state: state,
      setState: setState
    }), tab === "log" && /*#__PURE__*/React.createElement(LogView, {
      state: state,
      setState: setState
    })), /*#__PURE__*/React.createElement("nav", {
      className: "tab-bar"
    }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: `tab-bar-btn ${tab === t.id ? "active" : ""}`,
      onClick: () => setTab(t.id)
    }, /*#__PURE__*/React.createElement(t.icon, {
      size: 18,
      strokeWidth: tab === t.id ? 2.4 : 1.8
    }), /*#__PURE__*/React.createElement("span", null, t.label)))), confirmingReset && /*#__PURE__*/React.createElement("div", {
      className: "modal-backdrop",
      onClick: () => setConfirmingReset(false)
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("h3", null, "Reset all data?"), /*#__PURE__*/React.createElement("p", {
      className: "modal-sub"
    }, "This clears all progress, plans, and notes. This cannot be undone."), /*#__PURE__*/React.createElement("div", {
      className: "confirm-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-block",
      onClick: () => setConfirmingReset(false)
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-block danger-solid",
      onClick: () => {
        resetData();
        setConfirmingReset(false);
      }
    }, /*#__PURE__*/React.createElement(RotateCcw, {
      size: 14
    }), " Reset")))));
  }

  /* ============================================================
     STYLES
     ============================================================ */

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
.setup-exercise-list { display: flex; flex-direction: column; gap: 10px; padding-top: 40vh; margin-top: -40vh; }
.setup-exercise-row { display: block; }
.variant-chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.variant-chip { background: var(--surface-2); border: 1px solid var(--border); color: var(--text-dim); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 6px 10px; border-radius: 20px; cursor: pointer; }
.variant-chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.bonus-toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.bonus-toggle-target { font-size: 11px; color: var(--accent); font-family: 'JetBrains Mono', monospace; margin-top: 4px; }
.bonus-tag { font-size: 9px; background: rgba(212,169,78,0.15); color: var(--gold); padding: 2px 6px; border-radius: 10px; margin-left: 6px; text-transform: uppercase; letter-spacing: 0.04em; }


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
.exercise-log-list { display: flex; flex-direction: column; gap: 8px; padding-top: 40vh; margin-top: -40vh; }

.sticky-actions { position: fixed; bottom: 76px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; display: flex; gap: 8px; padding: 12px 20px; background: linear-gradient(to top, var(--bg) 70%, transparent); }
.sticky-actions .btn-primary { flex: 1; }
.sticky-actions-spacer { height: 140px; }
.track-transport { position: fixed; bottom: 8px; left: 50%; transform: translateX(-50%); width: calc(100% - 40px); max-width: 440px; display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 30px; padding: 8px 14px; z-index: 21; }
.track-transport-name { flex: 1; font-size: 11px; color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

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
.track-row { display: flex; align-items: center; gap: 10px; padding: 12px 16px; }
.track-row-info { flex: 1; min-width: 0; }
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
.variant-block { background: var(--surface-2); border-radius: 8px; padding: 10px; margin-bottom: 8px; }
.variant-block-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.variant-reps-field { display: flex; align-items: center; gap: 2px; margin-left: auto; }
.reps-stepper-value { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; min-width: 24px; text-align: center; }
.weight-entry-list { display: flex; flex-direction: column; gap: 4px; }
.weight-entry-block { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px dashed var(--border); }
.weight-entry-gear-select { flex: 1; margin-bottom: 0; font-size: 12px; padding: 6px 8px; }
.weight-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
.weight-chip { background: var(--surface-2); border: 1px solid var(--border); color: var(--text-dim); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 5px 9px; border-radius: 20px; cursor: pointer; }
.weight-chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.gear-weight-chip { display: flex; align-items: center; gap: 4px; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 5px 6px 5px 10px; border-radius: 20px; }
.gear-add-weight-row { display: flex; align-items: center; gap: 6px; margin-top: 8px; }
.weight-entry-row { display: flex; align-items: center; gap: 4px; }
.x2-toggle { background: var(--surface); border: 1px solid var(--border); color: var(--text-dim); border-radius: 6px; padding: 6px 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; cursor: pointer; min-width: 32px; }
.x2-toggle.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.variant-total-weight { font-size: 10px; color: var(--text-dim); margin-top: 6px; font-family: 'JetBrains Mono', monospace; }
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
.increment-stepper { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
.increment-stepper-label { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }
.metric-select { width: auto; margin-bottom: 16px; padding: 8px 10px; font-size: 12px; }
.sort-row { margin-bottom: 12px; }
.sort-select { width: 100%; margin-bottom: 0; padding: 8px 10px; font-size: 12px; }
.chart-card { padding: 12px 8px 4px; margin-bottom: 20px; }

.exercise-stats-list { display: flex; flex-direction: column; gap: 8px; }
.exercise-stats-row { padding: 14px 16px; }
.exercise-stats-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 10px; color: var(--text-dim); }
.exercise-stats-header .exercise-stats-name { margin-bottom: 0; }
.exercise-stats-name { font-weight: 600; font-size: 14px; margin-bottom: 10px; color: var(--text); }
.exercise-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.exercise-stats-cell { text-align: center; background: var(--surface-2); border-radius: 8px; padding: 8px 4px; }
.exercise-stats-num { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; }
.exercise-stats-num.accent { color: var(--accent); }
.exercise-stats-label { font-size: 9px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.03em; margin-top: 2px; }
.exercise-weight-progress { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
.exercise-weight-progress-row { display: flex; flex-direction: column; gap: 4px; }
.exercise-weight-progress-label { font-size: 11px; font-weight: 600; color: var(--gold); }
.exercise-weight-progress-reps { font-size: 11px; color: var(--text-dim); line-height: 1.6; word-break: break-word; }

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
.plan-run-session-block { border-top: 1px dashed var(--border); }
.plan-run-session-block:first-child { border-top: none; }
.plan-run-session-row { display: flex; align-items: flex-start; gap: 8px; padding-top: 6px; }
.plan-run-session-row.clickable { cursor: pointer; }
.plan-run-exercise-list { display: flex; flex-direction: column; gap: 6px; padding: 6px 0 8px 16px; }
.plan-run-exercise-row { display: flex; flex-direction: column; gap: 2px; font-size: 11px; }
.plan-run-exercise-row .mono { font-size: 10px; }
.plan-run-session-main { flex: 1; min-width: 0; }
.plan-run-session-title { font-size: 12px; font-weight: 600; }
.plan-run-session-sub { font-size: 10px; color: var(--text-dim); margin-top: 2px; line-height: 1.4; }
.bonus-card { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.bonus-card-top { display: flex; align-items: center; gap: 14px; }
.bonus-card-icon { width: 44px; height: 44px; background: rgba(212,169,78,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bonus-card-rules { display: flex; flex-direction: column; gap: 4px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text-dim); }
.level-card { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.level-dumbbell { position: relative; flex-shrink: 0; }
.level-dumbbell-label { position: absolute; bottom: -4px; left: 0; right: 0; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-dim); }
.level-card-info { flex: 1; }
.level-card-num { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 600; color: var(--accent); }
.level-card-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
.bonus-card-num { font-family: 'Oswald', sans-serif; font-size: 24px; color: var(--gold); }
.bonus-card-label { font-size: 12px; color: var(--text-dim); }

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