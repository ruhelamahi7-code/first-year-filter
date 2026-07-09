import { useState, useEffect } from "react";

// Fallback data, only used if RoadmapView is ever rendered without a
// generated roadmap (e.g. during standalone component development).
const fallbackData = [
  { week: 1, theme: "Python Basics", tasks: ["Install Python and VS Code", "Complete Python variables and loops tutorial", "Write a simple calculator program"], resource: { title: "Python for Everybody - Coursera", url: "https://www.coursera.org/specializations/python" } },
  { week: 2, theme: "Functions and File Handling", tasks: ["Learn functions and scope", "Practice file read/write operations", "Build a basic notes saving app"], resource: { title: "W3Schools Python", url: "https://www.w3schools.com/python" } },
  { week: 3, theme: "Data Structures", tasks: ["Learn lists, dicts, sets", "Solve 5 easy problems on lists", "Build a contact book using dict"], resource: { title: "CS50P - Harvard", url: "https://cs50.harvard.edu/python" } },
  { week: 4, theme: "Git and GitHub", tasks: ["Install Git", "Create your first GitHub repo", "Push a project to GitHub"], resource: { title: "Git Tutorial - Atlassian", url: "https://www.atlassian.com/git/tutorials" } },
  { week: 5, theme: "HTML and CSS Basics", tasks: ["Build a simple webpage", "Learn flexbox layout", "Clone a simple landing page"], resource: { title: "The Odin Project", url: "https://www.theodinproject.com" } },
  { week: 6, theme: "JavaScript Basics", tasks: ["Learn variables, loops, functions", "DOM manipulation basics", "Build a to-do list app"], resource: { title: "JavaScript.info", url: "https://javascript.info" } },
  { week: 7, theme: "React Introduction", tasks: ["Understand components and props", "Build a counter app", "Learn useState hook"], resource: { title: "React Docs", url: "https://react.dev" } },
  { week: 8, theme: "APIs and Fetch", tasks: ["Understand what an API is", "Fetch data from a public API", "Display API data in React"], resource: { title: "Public APIs List", url: "https://github.com/public-apis/public-apis" } },
  { week: 9, theme: "Resume and LinkedIn", tasks: ["Write your first resume", "Set up LinkedIn profile", "Add your GitHub projects"], resource: { title: "Resume Worded", url: "https://resumeworded.com" } },
  { week: 10, theme: "DSA - Arrays and Strings", tasks: ["Learn Big O basics", "Solve 10 easy LeetCode problems", "Understand two-pointer technique"], resource: { title: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" } },
  { week: 11, theme: "Mini Project", tasks: ["Pick one project idea", "Build and deploy it", "Write a README for it"], resource: { title: "Vercel Deploy Guide", url: "https://vercel.com/docs" } },
  { week: 12, theme: "Mock Interviews and Next Steps", tasks: ["Do 2 mock interviews", "Apply to 3 internships", "Plan your Year 2 goals"], resource: { title: "Pramp - Free Mock Interviews", url: "https://www.pramp.com" } },
];

const statusStyles = {
  not_started: { label: "Not Started", className: "bg-gray-100 text-gray-600" },
  in_progress: { label: "In Progress", className: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
};

function loadProgress() {
  try {
    const saved = localStorage.getItem("roadmap_progress");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export default function RoadmapView({ roadmap }) {
  const weeks = Array.isArray(roadmap) && roadmap.length === 12 ? roadmap : fallbackData;

  const [expandedWeek, setExpandedWeek] = useState(null);
  const [checkInWeek, setCheckInWeek] = useState(null);
  const [progress, setProgress] = useState(loadProgress);

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
  const progressPct = Math.round((completedCount / 12) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-1">Your 12-Week Roadmap</h1>
        <p className="text-gray-500 mb-6">Click any week to see details</p>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">{completedCount} of 12 weeks completed</span>
            <span className="text-sm font-bold text-indigo-600">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>

        {/* Week Cards */}
        <div className="flex flex-col gap-4">
          {weeks.map((week) => {
            const isOpen = expandedWeek === week.week;
            const status = statusStyles[getStatus(week.week)];
            return (
              <div key={week.week} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button onClick={() => toggle(week.week)} className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">{week.week}</span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Week {week.week}</p>
                      <p className="text-base font-semibold text-gray-800">{week.theme}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.className}`}>{status.label}</span>
                    <span className="text-gray-400 text-lg">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-600 mt-4 mb-2">Tasks</p>
                    <ul className="flex flex-col gap-2 mb-4">
                      {week.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-1 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
                          {task}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Free Resource</p>
                    <a href={week.resource.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline">{week.resource.title}</a>
                    <div className="mt-4">
                      <button onClick={() => setCheckInWeek(week.week)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Week {checkInWeek} Check-in</h2>
            <p className="text-sm text-gray-500 mb-6">Did you complete this week?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleCheckIn(checkInWeek, "completed")} className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition">Yes, completed!</button>
              <button onClick={() => handleCheckIn(checkInWeek, "in_progress")} className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition">Partial</button>
              <button onClick={() => handleCheckIn(checkInWeek, "not_started")} className="w-full py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition">No</button>
            </div>
            <button onClick={() => setCheckInWeek(null)} className="mt-4 w-full text-sm font-medium text-gray-600 hover:text-gray-900 underline transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
