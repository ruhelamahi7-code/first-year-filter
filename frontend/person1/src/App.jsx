import { useState } from "react"
import OnboardingForm from "./components/OnboardingForm"

export default function App() {
  const [submitted, setSubmitted] = useState(false)
  const [profile, setProfile] = useState(null)
  const [roadmap, setRoadmap] = useState(null)

  const handleSubmit = (profile, roadmap) => {
    setProfile(profile)
    setRoadmap(roadmap)
    setSubmitted(true)
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {!submitted ? (
        <OnboardingForm onSubmit={handleSubmit} />
      ) : (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-green-600">Roadmap Generated!</h1>
          <p className="text-gray-500 mt-2">Person 2 will build this screen.</p>
        </div>
      )}
    </div>
  )
}