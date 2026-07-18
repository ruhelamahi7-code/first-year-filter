import { useState } from "react";
import RoadmapView from "./components/RoadmapView";

export default function App() {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    const year = document.getElementById("year").value;
    const branch = document.getElementById("branch").value;
    const goal = document.getElementById("goal").value;
    const skills = document.getElementById("skills").value;

    if (!year || !branch || !goal || !skills) {
      setError("Please fill in all fields before generating.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, branch, goal, skills }),
      });
      const data = await res.json();
      localStorage.removeItem("roadmap_data");
      localStorage.removeItem("roadmap_progress");
      setRoadmapData(data);
    } catch (err) {
      setError("Could not connect to backend. Make sure it is running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"}}>
        <div className="text-center px-6">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-4 border-purple-400 border-b-transparent animate-spin" style={{animationDirection:"reverse", animationDuration:"0.8s"}}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Building your roadmap</h2>
          <p className="text-indigo-300 text-sm">Our AI is crafting a plan tailored just for you...</p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="min-h-screen flex" style={{background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"}}>
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-center px-16 w-1/2">
          <div className="mb-6">
            <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">AI-Powered Career Planning</span>
          </div>
          <h1 className="text-6xl font-black text-white leading-tight mb-4">
            Career<br/><span className="text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(90deg, #818cf8, #c084fc)"}}>Compass</span>
          </h1>
          <p className="text-lg text-indigo-200 mb-10 leading-relaxed max-w-md">
            Stop googling. Stop asking seniors for vague advice. Get a personalized 12-week roadmap built exactly for where you are right now.
          </p>
          <div className="flex flex-col gap-4">
            {["Personalized to your branch, year & goal", "Week-by-week actionable tasks", "Free resources only — zero cost", "Track your progress as you grow"].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"linear-gradient(135deg, #818cf8, #c084fc)"}}>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-indigo-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-4xl font-black text-white">Career<span className="text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(90deg, #818cf8, #c084fc)"}}>Compass</span></h1>
              <p className="text-indigo-300 text-sm mt-2">Your personalized 12-week career roadmap</p>
            </div>

            <div className="rounded-3xl p-8" style={{background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.1)"}}>
              <h2 className="text-xl font-bold text-white mb-1">Tell us about yourself</h2>
              <p className="text-indigo-300 text-sm mb-6">We'll build a roadmap around your exact situation.</p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5 block">Current Year</label>
                  <select id="year" className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500" style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)"}}>
                    <option value="" style={{background:"#1e1b4b"}}>Select your year</option>
                    <option style={{background:"#1e1b4b"}}>1st Year</option>
                    <option style={{background:"#1e1b4b"}}>2nd Year</option>
                    <option style={{background:"#1e1b4b"}}>3rd Year</option>
                    <option style={{background:"#1e1b4b"}}>4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5 block">Branch</label>
                  <select id="branch" className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500" style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)"}}>
                    <option value="" style={{background:"#1e1b4b"}}>Select your branch</option>
                    <option style={{background:"#1e1b4b"}}>CSE</option>
                    <option style={{background:"#1e1b4b"}}>ECE</option>
                    <option style={{background:"#1e1b4b"}}>ME</option>
                    <option style={{background:"#1e1b4b"}}>CE</option>
                    <option style={{background:"#1e1b4b"}}>EE</option>
                    <option style={{background:"#1e1b4b"}}>IT</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5 block">Career Goal</label>
                  <select id="goal" className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500" style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)"}}>
                    <option value="" style={{background:"#1e1b4b"}}>Select your goal</option>
                    <option style={{background:"#1e1b4b"}}>Placement</option>
                    <option style={{background:"#1e1b4b"}}>Startup</option>
                    <option style={{background:"#1e1b4b"}}>Research</option>
                    <option style={{background:"#1e1b4b"}}>Study Abroad</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5 block">Current Skills</label>
                  <textarea id="skills" rows={3} placeholder="e.g. I know basic Python, nothing about DSA yet..." className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none focus:ring-2 focus:ring-indigo-500 placeholder-indigo-400" style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)"}}></textarea>
                </div>

                {error && <p className="text-red-400 text-sm bg-red-900 bg-opacity-30 px-4 py-2 rounded-lg">{error}</p>}

                <button
                  onClick={handleGenerate}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                  style={{background:"linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow:"0 0 30px rgba(99,102,241,0.3)"}}
                >
                  Generate My Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <RoadmapView roadmapData={roadmapData} onBack={() => { setRoadmapData(null); }} />;
}