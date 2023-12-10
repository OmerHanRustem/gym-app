import React, { useState, useEffect } from "react";
import { openDB } from "idb";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { FormSelect } from "react-bootstrap";

const GymTraining = () => {
  const [trainings, setTrainings] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayDate);
  const [machine, setMachine] = useState("");
  const [groups, setGroups] = useState(1);
  const [weight, setWeight] = useState(0);
  const [unit, setUnit] = useState("kg");

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
      existingTraining.trainings.push({ machine, weight, unit, groups });
      await store.put(existingTraining);
    } else {
      // Add a new training object under the same date
      const newTraining = {
        date,
        trainings: [{ machine, weight, unit, groups }],
      };
      await store.put(newTraining);
    }

    loadTrainings();
    setDate("");
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
              return `${training.date},${t.machine},${t.weight},${t.unit},${t.groups}`;
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
        const [date, machine, weight, unit, groups] = row.split(",");
        const training = { machine, weight, unit, groups };

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

  const deleteTraining = async (date) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    await store.delete(date);

    loadTrainings(); // Refresh the displayed data after deletion
  };

  const [importSection, setImportSection] = useState(false);

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
        <h2>Gym Trainings</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Machine</th>
              <th>Weight</th>
              <th>Groups</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.date}>
                <td>{training.date}</td>
                <td>
                  {training.trainings.map((t, index) => (
                    <React.Fragment key={index}>
                      {t.machine}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {training.trainings.map((t, index) => (
                    <React.Fragment key={index}>
                      {t.weight} {t.unit}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {training.trainings.map((t, index) => (
                    <React.Fragment key={index}>
                      {t.groups}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTraining(training.date)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label htmlFor="date" column sm="1">
              Date
            </Form.Label>
            <Col sm="4">
              <Form.Control
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label htmlFor="machine" column sm="1">
              Machine
            </Form.Label>
            <Col sm="4">
              <Form.Control
                id="machine"
                type="text"
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label htmlFor="weight" column sm="1">
              Weight
            </Form.Label>
            <Col sm="2">
              <Form.Control
                id="weight"
                type="number"
                min={0}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </Col>
            <Col sm="2">
              <Form.Select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label htmlFor="groups" column sm="1">
              Groups
            </Form.Label>
            <Col sm="4">
              <Form.Control
                id="groups"
                type="number"
                min={1}
                value={groups}
                onChange={(e) => setGroups(Number(e.target.value))}
              />
            </Col>
          </Form.Group>
        </Form>

        <Button
          className="mt-2 w-50"
          variant={
            !date || !machine || !groups || !weight ? "secondary" : "primary"
          }
          onClick={addTraining}
          disabled={!date || !machine || !groups || !weight}
        >
          Add Training
        </Button>
      </Row>
    </Container>
  );
};

export default GymTraining;
