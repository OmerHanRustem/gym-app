import React, { useState } from "react";
import { openDB } from "idb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

import { useTranslation } from "react-i18next";

export const TrainingsCards = ({
  trainings,
  editTrainingEntry,
  loadTrainings,
}) => {
  const [expandedDates, setExpandedDates] = useState([]);

  const toggleDateCard = (date) => {
    if (expandedDates.includes(date)) {
      setExpandedDates(expandedDates.filter((d) => d !== date));
    } else {
      setExpandedDates([...expandedDates, date]);
    }
  };

  const deleteTrainingEntry = async (date, index) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    const existingTraining = await store.get(date);

    if (existingTraining) {
      existingTraining.trainings.splice(index, 1);
      await store.put(existingTraining);
      loadTrainings();
    }
  };

  const deleteTraining = async (date) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    await store.delete(date);

    loadTrainings();
  };

  const { t, i18n } = useTranslation();
  return (
    <Row className="justify-content-center align-items-start mb-5">
      {trainings.map((training, rowIndex) => (
        <Card key={training.date} className="mb-2">
          <Card.Header>
            <Card.Title
              className="d-flex justify-content-center align-items-center gap-1"
              style={{ cursor: "pointer" }}
              onClick={() => toggleDateCard(training.date)}
            >
              <span>{training.date}</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteTraining(training.date)}
              >
                {t("delete")}
              </Button>
            </Card.Title>
          </Card.Header>
          {expandedDates.includes(training.date) && (
            <Card.Body>
              {training.trainings.map((ex, index) => (
                <Card key={`${training.date}-${index}`} className="mb-2">
                  <Card.Header className="fw-bold">{ex.machine}</Card.Header>
                  <Card.Body>
                    {/* <Card.Text> */}
                    {t("weight")}: {ex.weight} {t(ex.unit)}
                    <br />
                    {t("groups")}: {ex.groups}
                    <br />
                    {t("times")}: {ex.times}
                    {/* </Card.Text> */}
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-1"
                      onClick={() => editTrainingEntry(training.date, index)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteTrainingEntry(training.date, index)}
                    >
                      {t("delete")}
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </Card.Body>
          )}
        </Card>
      ))}
    </Row>
  );
};
