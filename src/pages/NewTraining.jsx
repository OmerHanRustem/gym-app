import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import { TrainingForm } from "../components/TrainingForm";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

function NewTraining() {
  const { id } = useParams();
  // .toISOString().split("T")[0]
  const todayDate = new Date().toISOString();
  const [modDate, setModDate] = useState(todayDate);
  // Add form state
  const [split, setSplit] = useState("");
  const [category, setCategory] = useState("");
  const [machine, setMachine] = useState("");
  const [groups, setGroups] = useState(1);
  const [times, setTimes] = useState([]);
  const [weight, setWeight] = useState(1);
  const [unit, setUnit] = useState("kg");

  const addTraining = async () => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    const existingTraining = await store.get(category);

    if (existingTraining) {
      // Update existing training
      existingTraining.trainings.push({
        machine,
        weight,
        unit,
        groups,
        times,
        modDate,
      });
      await store.put(existingTraining);
    } else {
      // Add a new training object under the same category
      const newTraining = {
        split,
        category,
        trainings: [{ machine, weight, unit, groups, times, modDate }],
      };
      await store.put(newTraining);
    }

    // loadTrainings();
    setSplit("");
    setCategory("");
    setMachine("");
    setGroups(1);
    setWeight(1);
    setUnit("kg");
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center m-5">
        <h1>{id}</h1>
        <TrainingForm
          addTraining={addTraining}
          split={split}
          setSplit={setSplit}
          category={category}
          setCategory={setCategory}
          machine={machine}
          setMachine={setMachine}
          groups={groups}
          setGroups={setGroups}
          times={times}
          setTimes={setTimes}
          weight={weight}
          setWeight={setWeight}
          unit={unit}
          setUnit={setUnit}
        />
      </Row>
    </Container>
  );
}

export default NewTraining;
