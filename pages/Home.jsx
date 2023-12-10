import React, { useState, useEffect } from "react";
import { openDB } from "idb";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FormSelect } from "react-bootstrap";
import { EditModal } from "../src/components/Modal";
import { TrainingForm } from "../src/components/TrainingForm";
import { TrainingsTable } from "../src/components/TrainingsTable";

const Home = () => {
  const [trainings, setTrainings] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayDate);

  // Add form state
  const [machine, setMachine] = useState("");
  const [groups, setGroups] = useState(1);
  const [times, setTimes] = useState(1);
  const [weight, setWeight] = useState(0);
  const [unit, setUnit] = useState("kg");

  // Modal form state
  const [modalMachine, setModalMachine] = useState("");
  const [modalGroups, setModalGroups] = useState(1);
  const [modalTimes, setModalTimes] = useState(1);
  const [modalWeight, setModalWeight] = useState(0);
  const [modalUnit, setModalUnit] = useState("kg");

  const [importSection, setImportSection] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const loadTrainings = async () => {
    const db = await openDB("gym-trainings", 1, {
      upgrade(db) {
        const store = db.createObjectStore("trainings", { keyPath: "date" });
        store.createIndex("dateIndex", "date");
      },
    });

    const transaction = db.transaction("trainings", "readonly");
    const store = transaction.objectStore("trainings");

    const trainings = await store.getAll();
    setTrainings(trainings);
  };

  useEffect(() => {
    loadTrainings();
  }, []);

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

    loadTrainings();
    setDate(todayDate);
    setMachine("");
    setGroups(0);
    setWeight(0);
    setUnit("kg");
  };

  const exportToCSV = async () => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readonly");
    const store = transaction.objectStore("trainings");

    const trainings = await store.getAll();

    // Convert data to CSV format
    const csvContent =
      // "Date,Machine,Weight,Unit,Groups\n" +
      trainings
        .map((training) => {
          return training.trainings
            .map((t) => {
              return `${training.date},${t.machine},${t.weight},${t.unit},${t.groups},${t.times}`;
            })
            .join("\n");
        })
        .join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "gym_trainings.csv";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const content = await file.text();
      const rows = content.split("\n");

      const db = await openDB("gym-trainings", 1);
      const transaction = db.transaction("trainings", "readwrite");
      const store = transaction.objectStore("trainings");

      const dataMap = new Map();

      rows.forEach((row) => {
        const [date, machine, weight, unit, groups, times] = row.split(",");
        const training = { machine, weight, unit, groups, times }; // Include "times" in the training object

        if (!dataMap.has(date)) {
          dataMap.set(date, [training]);
        } else {
          dataMap.get(date).push(training);
        }
      });

      // Save data to IndexedDB
      dataMap.forEach(async (trainings, date) => {
        const existingTraining = await store.get(date);

        if (existingTraining) {
          // Update existing training
          existingTraining.trainings = [
            ...existingTraining.trainings,
            ...trainings,
          ];
          await store.put(existingTraining);
        } else {
          // Add a new training object under the same date
          const newTraining = { date, trainings };
          await store.put(newTraining);
        }
      });

      loadTrainings(); // Refresh the displayed data after import
    }
  };

  const editTrainingEntry = (date, index) => {
    // Set the main form state with the values of the selected training
    setDate(date);
    setEditIndex(index);

    // Set the modal form state with the values of the selected training
    const selectedTraining = trainings.find((t) => t.date === date)?.trainings[
      index
    ];
    if (selectedTraining) {
      setModalMachine(selectedTraining.machine);
      setModalWeight(selectedTraining.weight);
      setModalUnit(selectedTraining.unit);
      setModalGroups(selectedTraining.groups);
      setModalTimes(selectedTraining.times);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditIndex(null);
  };

  const handleSaveEdit = async () => {
    // Retrieve the existing training using the date
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    const existingTraining = await store.get(date);

    if (existingTraining) {
      // Update the training at the editIndex with the new values from the modal form
      existingTraining.trainings[editIndex] = {
        machine: modalMachine,
        weight: modalWeight,
        unit: modalUnit,
        groups: modalGroups,
        times: modalTimes,
      };

      // Put the updated training back into the store
      await store.put(existingTraining);

      // Close the modal and refresh the displayed data
      handleCloseModal();
      loadTrainings();
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center mt-3">
        <Col sm="3" className="btn-group">
          <Button
            className="w-50"
            variant="success"
            onClick={() => setImportSection((prev) => !prev)}
          >
            Import to App
          </Button>
          <Button
            className="w-50"
            variant="success"
            onClick={exportToCSV}
            disabled={trainings.length === 0}
          >
            Export to CSV
          </Button>
        </Col>
      </Row>

      {importSection && (
        <Form.Group
          as={Row}
          className="justify-content-center align-items-center mt-2"
        >
          <Col sm="4">
            <Form.Control
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </Col>
        </Form.Group>
      )}

      <Row className="justify-content-center align-items-center m-3">
        <h2>Bunyan - Gym Trainings</h2>

        <TrainingsTable
          trainings={trainings}
          loadTraining={loadTrainings}
          editTrainingEntry={editTrainingEntry}
        />

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
      </Row>

      <EditModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleSave={handleSaveEdit}
        header="Edit Training"
      >
        <TrainingForm
          date={date}
          setDate={setDate}
          addForm={false}
          machine={modalMachine}
          setMachine={setModalMachine}
          groups={modalGroups}
          setGroups={setModalGroups}
          times={modalTimes}
          setTimes={setModalTimes}
          weight={modalWeight}
          setWeight={setModalWeight}
          unit={modalUnit}
          setUnit={setModalUnit}
          singleLabel="3"
          singleControl="8"
          multiControl="4"
        />
      </EditModal>
    </Container>
  );
};

export default Home;
