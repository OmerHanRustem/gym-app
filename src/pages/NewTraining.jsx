import React, { useState } from "react";
import { openDB } from "idb";
import { TrainingForm } from "../components/TrainingForm";
import { Col, Container, Row } from "react-bootstrap";

function NewTraining() {
  const todayDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayDate);
  // Add form state
  const [machine, setMachine] = useState("");
  const [groups, setGroups] = useState(1);
  const [times, setTimes] = useState(1);
  const [weight, setWeight] = useState(1);
  const [unit, setUnit] = useState("kg");

  const addTraining = async () => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    const existingTraining = await store.get(date);

    if (existingTraining) {
      // Update existing training
      existingTraining.trainings.push({ machine, weight, unit, groups, times });
      await store.put(existingTraining);
    } else {
      // Add a new training object under the same date
      const newTraining = {
        date,
        trainings: [{ machine, weight, unit, groups, times }],
      };
      await store.put(newTraining);
    }

    // loadTrainings();
    setDate(todayDate);
    setMachine("");
    setGroups(0);
    setWeight(0);
    setUnit("kg");
  };
  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center">
        <Col>
          <TrainingForm
            addTraining={addTraining}
            date={date}
            setDate={setDate}
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
