import { useState, useEffect } from "react";

const statusStyles = {
  not_started: { label: "Not Started", className: "bg-gray-800 text-gray-400 border border-gray-700" },
  in_progress: { label: "In Progress", className: "bg-yellow-900 bg-opacity-50 text-yellow-400 border border-yellow-700" },
  completed: { label: "Completed", className: "bg-green-900 bg-opacity-50 text-green-400 border border-green-700" },
};

function loadProgress() {
  try {
    const saved = localStorage.getItem("roadmap_progress");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export default function RoadmapView({ roadmapData, onBack }) {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [checkInWeek, setCheckInWeek] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    if (roadmapData && roadmapData.roadmap) {
      setWeeks(roadmapData.roadmap);
    }
  }, [roadmapData]);

  useEffect(() => {
    localStorage.setItem("roadmap_progress", JSON.stringify(progress));
  }, [progress]);

  const toggle = (week) => setExpandedWeek(expandedWeek === week ? null : week);

  const handleCheckIn = (weekNum, status) => {
    setProgress((prev) => ({ ...prev, [weekNum]: status }));
    setCheckInWeek(null);
  };

  const getStatus = (weekNum) => progress[weekNum] || "not_started";

  const completedCount = Object.values(progress).filter((s) => s === "completed").length;
  const totalWeeks = weeks.length || 12;
  const progressPct = Math.round((completedCount / totalWeeks) * 100);

  if (weeks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg, #0f0c29, #302b63, #24243e)"}}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{background:"linear-gradient(135deg, #0f0c29, #302b63, #24243e)"}}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 inline-flex items-center gap-1 transition">
              ← Back to form
            </button>
          )}
          <h1 className="text-3xl font-black text-white">Your 12-Week Roadmap</h1>
          <p className="text-indigo-300 text-sm mt-1">Click any week to expand and see details</p>
        </div>

        {/* Progress Bar */}
        <div className="rounded-2xl p-5 mb-8" style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)"}}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-white">{completedCount} of {totalWeeks} weeks completed</span>
            <span className="text-sm font-black text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(90deg, #818cf8, #c084fc)"}}>{progressPct}%</span>
          </div>
          <div className="w-full rounded-full h-2.5" style={{background:"rgba(255,255,255,0.1)"}}>
            <div className="h-2.5 rounded-full transition-all duration-700" style={{width:`${progressPct}%`, background:"linear-gradient(90deg, #6366f1, #a855f7)"}}></div>
          </div>
        </div>

        {/* Week Cards */}
        <div className="flex flex-col gap-3">
          {weeks.map((week) => {
            const isOpen = expandedWeek === week.week;
            const statusKey = getStatus(week.week);
            const status = statusStyles[statusKey];
            return (
              <div key={week.week} className="rounded-2xl overflow-hidden transition-all duration-200" style={{background:"rgba(255,255,255,0.05)", border: isOpen ? "1px solid rgba(129,140,248,0.5)" : "1px solid rgba(255,255,255,0.08)"}}>
                <button onClick={() => toggle(week.week)} className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white hover:bg-opacity-5 transition">
                  <div className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded-full font-black text-sm flex items-center justify-center flex-shrink-0 text-white" style={{background:"linear-gradient(135deg, #6366f1, #8b5cf6)"}}>
                      {week.week}
                    </span>
                    <div>
                      <p className="text-xs text-indigo-400 font-medium">Week {week.week}</p>
                      <p className="text-base font-bold text-white">{week.theme}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.className}`}>{status.label}</span>
                    <span className="text-indigo-400 text-sm">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t" style={{borderColor:"rgba(255,255,255,0.08)"}}>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mt-4 mb-3">Tasks</p>
                    <ul className="flex flex-col gap-2 mb-5">
                      {week.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-indigo-100">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:"linear-gradient(135deg, #818cf8, #c084fc)"}}></span>
                          {task}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Free Resource</p>
                    <a href={week.resource.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 underline transition">
                      {week.resource.title}
                    </a>
                    <div className="mt-4">
                      <button onClick={() => setCheckInWeek(week.week)} className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition hover:scale-105" style={{background:"linear-gradient(135deg, #6366f1, #8b5cf6)"}}>
                        Check In
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-in Modal */}
      {checkInWeek && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)"}}>
          <div className="w-full max-w-sm rounded-3xl p-8" style={{background:"linear-gradient(135deg, #1e1b4b, #2e1065)", border:"1px solid rgba(255,255,255,0.1)"}}>
            <h2 className="text-xl font-black text-white mb-1">Week {checkInWeek} Check-in</h2>
            <p className="text-indigo-300 text-sm mb-6">How did this week go?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleCheckIn(checkInWeek, "completed")} className="w-full py-3.5 rounded-xl font-bold text-white transition hover:scale-[1.02]" style={{background:"linear-gradient(135deg, #059669, #10b981)"}}>
                Yes, completed!
              </button>
              <button onClick={() => handleCheckIn(checkInWeek, "in_progress")} className="w-full py-3.5 rounded-xl font-bold text-white transition hover:scale-[1.02]" style={{background:"linear-gradient(135deg, #d97706, #f59e0b)"}}>
                Partial progress
              </button>
              <button onClick={() => handleCheckIn(checkInWeek, "not_started")} className="w-full py-3.5 rounded-xl font-bold transition hover:scale-[1.02]" style={{background:"rgba(255,255,255,0.08)", color:"#a5b4fc", border:"1px solid rgba(255,255,255,0.1)"}}>
                Not yet
              </button>
            </div>
            <button onClick={() => setCheckInWeek(null)} className="mt-5 w-full text-sm text-indigo-400 hover:text-indigo-300 underline transition">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}