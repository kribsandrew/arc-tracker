import {useState, useEffect } from "react"

// ===== Main App Component =====
function App() {

  // ===== Raid Data (stored history of all raids) =====
  const [raids, setRaids] = useState([])

  // ===== Current Input Values (Form State) =====
  const [raiderFightsInitiated, setRaiderFightsInitiated] = useState(0)
  const [raiderFights, setRaiderFights] = useState(0)
  const [arcFightsInitiated, setArcFightsInitiated] = useState(0)
  const [arcFights, setArcFights] = useState(0)
  const [raiderKills, setRaiderKills] = useState(0)
  const [arcKills, setArcKills] = useState(0)
  const [result, setResult] = useState("Extracted")
  const [outcomeType, setOutcomeType] = useState("Standard")
  const [raidTime, setRaidTime] = useState(0)
  
  // ===== Save Raids to localStorage =====
  useEffect(() => {
  localStorage.setItem("raids", JSON.stringify(raids))
  })

  // ===== Load Raids from localStorage =====
  useEffect(() => {
    const saved = localStorage.getItem("raids")
    if (saved) {
      setRaids(JSON.parse(saved))
    }
  }, [])

  // ===== Add New Raid =====
  const addRaid = () => {
    
    // build raid object from current inputs
    const newRaid = {
      id: Date.now(),
      raiderFights: Number(raiderFights),
      raiderFightsInitiated: Number(raiderFightsInitiated),
      arcFights: Number(arcFights),
      arcFightsInitiated: Number(arcFightsInitiated),
      raiderKills: Number(raiderKills),
      arcKills: Number(arcKills),
      result: result,
      outcomeType: outcomeType,
      raidTime: Number(raidTime)
    }

    // Add new raid to stored list
    setRaids([...raids, newRaid])

    // reset form after submission
    setArcFights(0)
    setArcFightsInitiated(0)
    setRaiderFights(0)
    setRaiderFightsInitiated(0)
    setArcKills(0)
    setRaiderKills(0)
    setResult("Extracted")
    setOutcomeType("Standard")
    setRaidTime(0)
  }
  
  // ===== DELETE RAID =====
  const deleteRaid = (id) =>{
    setRaids(raids.filter((r) => r.id !== id))
}
  // ===== PLAYER STATS =====

  // Totals
  const totalRaids = raids.length

  const totalRaiderFights = raids.reduce((sum, r) => sum + r.raiderFights, 0)
  const totalArcFights = raids.reduce((sum, r) => sum + r.arcFights, 0)

  const totalFights = totalRaiderFights + totalArcFights

  //PvP vs PvE
  const pvpRatio = totalFights > 0 ? totalRaiderFights / totalFights : 0

  //Aggression
  const totalInitiations = raids.reduce(
    (sum, r) => sum + r.raiderFightsInitiated + r.arcFightsInitiated, 0
  )

  const aggressionRate = totalFights > 0 ? totalInitiations / totalFights : 0

  //Survival
  const successfulRaids = raids.filter(r => r.result === "Extracted").length

  const survivalRate = totalRaids > 0 ? successfulRaids / totalRaids : 0


  // ====== PLAYER PROFILE ======

  let playstyle = ""
  if (pvpRatio > 0.65) playstyle = "PvP Focused"
  else if (pvpRatio < 0.35) playstyle = "PvE Focused"
  else playstyle = "Balanced"

  let aggressionType = ""
  if (aggressionRate > 0.6) aggressionType = "Aggressive"
  else if (aggressionRate < 0.3) aggressionType = "Passive"
  else aggressionType = "Reactive"

  let survivalType = ""
  if (survivalRate > 0.7) survivalType = "High Extract Rate"
  else if (survivalRate < 0.4) survivalType = "Low Extract Rate"
  else survivalType = "Moderate Extract Rate"

  // final profile
  const playerProfile = `${aggressionType} ${playstyle} Player`

  // ===== INSIGHTS =====

let insights = []

if (survivalRate < 0.4 && aggressionRate > 0.6) {
  insights.push("You take too many fights — survival is low.")
}

if (pvpRatio > 0.7 && survivalRate < 0.5) {
  insights.push("Heavy PvP focus is hurting survival.")
}

if (pvpRatio < 0.3 && survivalRate > 0.7) {
  insights.push("You play safe and survive consistently.")
}

if (totalRaids > 0) {
  const avgTime = raids.reduce((sum, r) => sum + r.raidTime, 0) / totalRaids

  if (avgTime > 15 && survivalRate < 0.5) {
    insights.push("You may be staying in raids too long.")
  }
}
  
  // ===== USER INTERFACE =====
  return (
    <div className="container">
      <h1>ARC Tracker</h1>

      <div className="panel">

        {/* ===== Raid Input Form ====*/}
        <h2>Log a Raid</h2>

        <div className="section">

          {/* ===== Raider Inputs ====*/}
          <h3>Raider</h3>

          <label> Raider Fights</label>
          <input
            type="number"
            placeholder="Raider Fights"
            value={raiderFights}
            onChange={(e) => setRaiderFights(e.target.value)}
        />
      
          <label> Raider Fights Initiated</label>
          <input
            type="number"
            placeholder="Raider Fights Initiated"
            value={raiderFightsInitiated}
            onChange={(e) => setRaiderFightsInitiated(e.target.value)}
        />
      
          <label> Raider Kills</label>
          <input
            type="number"
            placeholder="Raider Kills"
            value={raiderKills}
            onChange={(e) => setRaiderKills(e.target.value)}
        />
      </div>

        <div className="section"></div>

          {/* ===== Arc Inputs ====*/}
          <h3>Arc</h3>

          <label> Arc Fights</label>
          <input
            type="number"
            placeholder="Arc Fights"
            value={arcFights}
            onChange={(e) => setArcFights(e.target.value)}
        />
      
          <label> Arc Fights Initiated</label>
          <input
            type="number"
            placeholder="Arc Fights Initiated"
            value={arcFightsInitiated}
            onChange={(e) => setArcFightsInitiated(e.target.value)}
        />

          <label> Arc Kills</label>
          <input
            type="number"
            placeholder="Arc Kills"
            value={arcKills}
            onChange={(e) => setArcKills(e.target.value)}
        />
      </div>

      {/* ===== Outcome Selection ====*/}
      <label>Result</label>
      <select
        value={result}
        onChange={(e) => {
          const newResult = e.target.value
          setResult(newResult)

          if (newResult === "Extracted") {
            setOutcomeType("Standard")
          } else {
            setOutcomeType("Arc")
          }
        }}
        >
          <option value="Extracted">Extracted</option>
          <option value="Death">Death</option>
        </select>

        <label>Type</label>
        <select
          value={outcomeType}
          onChange={(e) => setOutcomeType(e.target.value)}
        >
          {result === "Extracted" ? (
            <>
              <option value="Standard">Standard</option>
              <option value="Hatch Key">Hatch Key</option>
            </>
          ) : (
            <>
              <option value="Arc">Arc</option>
              <option value="Raider">Raider</option>
            </>
          )}
        </select>

      {/* ===== User Input Raid Time ====*/}
      <label>Raid Time (minutes)</label>
      <input
        type="number"
        placeholder="Raid Time"
        value={raidTime}
        onChange={(e) => setRaidTime(e.target.value)}
    />


      {/* ===== Submit Raid ====*/}
      <button onClick={addRaid}>
        Add Raid
      </button>

      {/* --- PLAYER PROFILE --- */}
      <div className="panel">
        <h2>Player Profile</h2>

        <p><strong>{playerProfile}</strong></p>

        <p>Survival Rate: {(survivalRate * 100).toFixed(1)}%</p>
        <p>PvP Ratio: {pvpRatio.toFixed(2)}</p>
        <p>Aggression: {aggressionRate.toFixed(2)}</p>

        <h3>Insights</h3>
        {insights.length > 0 ? (
         insights.map((insight, i) => <p key={i}>- {insight}</p>)
        ) : (
        <p>No strong patterns yet.</p>
        )}
      </div>

      <div className="panel">

        {/* ===== Raid History ====*/}
        <h2>Raid History</h2>
        
        <u1>

        {/* ===== Display all Saved Raids ====*/}
        {raids.map((r) => (
          <li key={r.id}>
            <strong>Raider:</strong>  Fights: {r.raiderFights} | Fights Initiated: {r.raiderFightsInitiated} | Kills: {r.raiderKills}
            <br />
            <strong>Arc:</strong>  Fights: {r.arcFights} | Fights Initiated: {r.arcFightsInitiated} | Kills: {r.arcKills}
            <br />
            <strong>Outcome:</strong> {r.result} - {r.outcomeType} | Time: {r.raidTime} min
          
            <button onClick={() => deleteRaid(r.id)}>
              Delete
            </button>
            </li>
        ))}
      </u1>
      </div>
    </div>
  )
}

export default App