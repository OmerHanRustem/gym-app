import React, { useState } from "react";
import { openDB } from "idb";
import { TrainingForm } from "../components/TrainingForm";
import { Col, Container, Row } from "react-bootstrap";

function NewTraining() {
  // .toISOString().split("T")[0]
  const todayDate = new Date();
  const [modDate, setModDate] = useState(todayDate);
  // Add form state
  const [category, setCategory] = useState("");
  const [machine, setMachine] = useState("");
  const [groups, setGroups] = useState(1);
  const [times, setTimes] = useState(1);
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
      // Add a new training object under the same date
      const newTraining = {
        category,
        trainings: [{ machine, weight, unit, groups, times, modDate }],
      };
      await store.put(newTraining);
    }

    // loadTrainings();
    setCategory("");
    setMachine("");
    setGroups(1);
    setWeight(1);
    setUnit("kg");
  };
  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center">
        <Col>
          <TrainingForm
            addTraining={addTraining}
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
        </Col>
      </Row>
    </Container>
  );
}

export default NewTraining;
