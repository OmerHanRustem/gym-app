import React, { useState } from "react";
import { openDB } from "idb";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

export const ImportExport = () => {
  const { t, i18n } = useTranslation();
  const [importSection, setImportSection] = useState(false);

  const exportToCSV = async () => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readonly");
    const store = transaction.objectStore("trainings");

    const trainings = await store.getAll();

    // Convert data to CSV format
    const csvContent = trainings
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
  return (
    <>
      <Row className="justify-content-center align-items-center">
        <Col className="btn-group">
          <Button
            className="btn-sm"
            variant="success"
            onClick={() => setImportSection((prev) => !prev)}
          >
            {t("importToApp")}
          </Button>
          {importSection && (
            <Col sm="6" className="ms-1 me-1">
              <Form.Control
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </Col>
          )}
          <Button
            variant="success"
            className="btn-sm"
            onClick={exportToCSV}
            // disabled={trainings.length === 0}
          >
            {t("exportToCSV")}
          </Button>
        </Col>
      </Row>
    </>
  );
};
