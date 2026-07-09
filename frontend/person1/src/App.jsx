import { useState } from "react"
import OnboardingForm from "./components/OnboardingForm"
import RoadmapView from "./components/RoadmapView"

export default function App() {
  const [submitted, setSubmitted] = useState(false)
  const [profile, setProfile] = useState(null)
  const [roadmap, setRoadmap] = useState(null)

  const handleSubmit = (profile, data) => {
    setProfile(profile)
    setRoadmap(data.roadmap)
    setSubmitted(true)
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {!submitted ? (
        <OnboardingForm onSubmit={handleSubmit} />
      ) : (
        <RoadmapView roadmap={roadmap} />
      )}
    </div>
  )
}