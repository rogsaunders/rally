import React, { useState } from "react";
import "./App.css";

function App() {
  const [marshal, setMarshal] = useState("");
  const [day, setDay] = useState("");
  const [stage, setStage] = useState("");
  const [checkpoint, setCheckpoint] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roadblockTime, setRoadblockTime] = useState("");
  const [points, setPoints] = useState("");
  const [entries, setEntries] = useState([]);
  const [stageActive, setStageActive] = useState(false);

  const exportCSV = () => {
    if (entries.length === 0) {
      alert("No data to export.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Marshal,Day,Stage,Checkpoint,Car Number,Start Time,End Time,Roadblock Time,Points"]
        .concat(
          entries.map(
            (e) =>
              `${e.marshal},${e.day},${e.stage},${e.checkpoint},${e.carNumber},${e.startTime || ""},${e.endTime || ""},${e.roadblockTime || ""},${e.points || ""}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rally_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleEndStage = () => {
    exportCSV();
    setStageActive(false);
    setMarshal("");
    setDay("");
    setStage("");
    setCheckpoint("");
  };

  const handleStartStage = () => {
    setStageActive(true);
  };

  const handleSubmit = () => {
    if (!carNumber && !roadblockTime && !points) {
      alert("Car Number, Roadblock Time, or Points is required.");
      return;
    }

    const existingEntryIndex = entries.findIndex(
      (entry) =>
        entry.day === day && entry.stage === stage && entry.carNumber === carNumber
    );

    if (existingEntryIndex !== -1) {
      const updatedEntries = [...entries];
      if (checkpoint === "Start") {
        updatedEntries[existingEntryIndex].startTime = startTime;
      } else if (checkpoint === "End") {
        updatedEntries[existingEntryIndex].endTime = endTime;
      }
      setEntries(updatedEntries);
    } else {
      setEntries([
        ...entries,
        { marshal, day, stage, checkpoint, carNumber, startTime: checkpoint === "Start" ? startTime : "", endTime: checkpoint === "End" ? endTime : "", roadblockTime, points },
      ]);
    }

    setCarNumber("");
    setStartTime("");
    setEndTime("");
    setRoadblockTime("");
    setPoints("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <img src="/logo.png" alt="Oz Outback Odyssey" style={{ width: "200px", marginBottom: "10px" }} />
      <h1>Marshal Data Entry</h1>

      {!stageActive ? (
        <>
          <div>
            <label>Marshal: </label>
            <select value={marshal} onChange={(e) => setMarshal(e.target.value)}>
              <option value="">Select Marshal</option>
              <option value="OV4">OV4</option>
              <option value="OV5">OV5</option>
              <option value="OV6">OV6</option>
              <option value="OV7">OV7</option>
              <option value="Marshall 5">Marshall 5</option>
              <option value="Marshall 6">Marshall 6</option>
            </select>
          </div>
          <div>
            <label>Day: </label>
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">Select Day</option>
              <option value="Day 1">Day 1</option>
              <option value="Day 2">Day 2</option>
              <option value="Day 3">Day 3</option>
              <option value="Day 4">Day 4</option>
            </select>
          </div>
          <div>
            <label>Stage: </label>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="">Select Stage</option>
              <option value="Control 1">Control 1</option>
              <option value="Control 2">Control 2</option>
              <option value="Roadblock 1">Roadblock 1</option>
              <option value="Roadblock 2">Roadblock 2</option>
            </select>
          </div>
          {stage.includes("Control") && (
            <div>
              <label>Checkpoint: </label>
              <select value={checkpoint} onChange={(e) => setCheckpoint(e.target.value)}>
                <option value="">Select Checkpoint</option>
                <option value="Start">Start</option>
                <option value="End">End</option>
              </select>
            </div>
          )}
          <button onClick={handleStartStage}>Start Stage</button>
        </>
      ) : (
        <>
          {stage.includes("Control") && (
            <>
              <div>
                <label>Car Number: </label>
                <input type="text" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} placeholder="Enter Car Number" />
              </div>
              {checkpoint === "Start" && (
                <div>
                  <label>Start Time (hh:mm:ss): </label>
                  <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="hh:mm:ss" />
                </div>
              )}
              {checkpoint === "End" && (
                <div>
                  <label>End Time (hh:mm:ss): </label>
                  <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="hh:mm:ss" />
                </div>
              )}
            </>
          )}
          {stage.includes("Roadblock") && (
            <>
              <div>
                <label>Time (mm:ss): </label>
                <input type="text" value={roadblockTime} onChange={(e) => setRoadblockTime(e.target.value)} placeholder="mm:ss" />
              </div>
              <div>
                <label>Points (##.#): </label>
                <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="##.#" />
              </div>
            </>
          )}
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleEndStage}>End Stage</button>
        </>
      )}
    </div>
  );
}

export default App;

