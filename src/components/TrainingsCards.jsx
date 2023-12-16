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
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleDateCard = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((d) => d !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const deleteTrainingEntry = async (category, index) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    const existingTraining = await store.get(category);

    if (existingTraining) {
      existingTraining.trainings.splice(index, 1);
      await store.put(existingTraining);
      loadTrainings();
    }
  };

  const deleteTraining = async (category) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    await store.delete(category);

    loadTrainings();
  };

  // Group the training data by 'training.split' value
  const groupedTrainings = trainings.reduce((result, training) => {
    const key = training.split;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(training);
    return result;
  }, {});

  const { t, i18n } = useTranslation();
  return (
    <Row className="justify-content-center align-items-start mb-5">
      {Object.entries(groupedTrainings).map(([split, trainings]) => (
        <Card key={split} className="mb-2 p-0">
          <Card.Header className="h4">{split}</Card.Header>
          <Card.Body>
            {trainings.map((training, rowIndex) => (
              <Card key={training.category} className="mb-2 p-0">
                <Card.Header>
                  <Card.Title
                    className="d-flex justify-content-evenly align-items-center gap-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleDateCard(training.category)}
                  >
                    <span>{training.category}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteTraining(training.category)}
                    >
                      {t("delete")}
                    </Button>
                  </Card.Title>
                </Card.Header>
                {expandedCategories.includes(training.category) && (
                  <Card.Body>
                    {training.trainings.map((ex, index) => (
                      <Card
                        key={`${training.category}-${index}`}
                        className="mb-2"
                      >
                        <Card.Header className="fw-bold">
                          {ex.machine}
                        </Card.Header>
                        <Card.Body>
                          {t("weight")}: {ex.weight} {t(ex.unit)}
                          <br />
                          {t("groups")}: {ex.groups}
                          <br />
                          {ex.times.map((time, index) => (
                            <ul key={index} className="m-0 ps-4">
                              <li>
                                Set {index + 1} Reps: {time}
                              </li>
                            </ul>
                          ))}
                        </Card.Body>
                        <Card.Footer>
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-1"
                            onClick={() =>
                              editTrainingEntry(training.category, index)
                            }
                          >
                            {t("edit")}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              deleteTrainingEntry(training.category, index)
                            }
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
          </Card.Body>
        </Card>
      ))}
    </Row>
  );
};
