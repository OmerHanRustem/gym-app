import React, { useState } from "react";
import { openDB } from "idb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";

import { useTranslation } from "react-i18next";

import { useDispatch } from "react-redux";
import { loadTrainings } from "../rtk/slices/ui-slice";

export const TrainingsCards = ({ trainings, editTrainingEntry }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

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
      dispatch(loadTrainings());
    }
  };

  const deleteTraining = async (category) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    await store.delete(category);

    dispatch(loadTrainings());
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

  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
  const [deletedCategory, setDeletedCategory] = useState("");
  const [deleteExerciseModal, setDeleteExerciseModal] = useState(false);
  const [deletedExercise, setDeletedExercise] = useState([]);

  function formatDate(date) {
    const ISODate = new Date(date);

    const year = ISODate.getFullYear();
    const month = (ISODate.getMonth() + 1).toString().padStart(2, "0");
    const day = ISODate.getDate().toString().padStart(2, "0");
    const hours = ISODate.getHours() % 12 || 12; // Use 12 for midnight
    const paddedHours = hours.toString().padStart(2, "0");
    const minutes = ISODate.getMinutes().toString().padStart(2, "0");
    const ampm = ISODate.getHours() >= 12 ? t("PM") : t("AM");

    return `${year}-${month}-${day} ${t(
      "timeAt"
    )} ${paddedHours}:${minutes} ${ampm}`;
  }

  return (
    <>
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
                        onClick={() => {
                          setDeletedCategory(training.category);
                          setDeleteCategoryModal(true);
                        }}
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
                                  {i18n.language === "en" ? (
                                    <>
                                      {t("set")} {index + 1} Reps: {time}
                                    </>
                                  ) : (
                                    <>
                                      {t("times")} {t("set")} [ {index + 1} ] :{" "}
                                      {time}
                                    </>
                                  )}
                                </li>
                              </ul>
                            ))}
                          </Card.Body>
                          <Card.Footer className="text-muted text-end">
                            {t("lastModificationDate")}:{" "}
                            {formatDate(ex.modDate)}
                          </Card.Footer>
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
                              onClick={() => {
                                setDeletedExercise([training.category, index]);
                                setDeleteExerciseModal(true);
                              }}
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

      <Modal
        show={deleteCategoryModal}
        onHide={() => setDeleteCategoryModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to DELETE {deletedCategory}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteCategoryModal(false)}
          >
            {t("close")}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setDeleteCategoryModal(false);
              deleteTraining(deletedCategory);
            }}
          >
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={deleteExerciseModal}
        onHide={() => setDeleteExerciseModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to DELETE this Exercise?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteExerciseModal(false)}
          >
            {t("close")}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteTrainingEntry(deletedExercise[0], deletedExercise[1]);
              setDeleteExerciseModal(false);
            }}
          >
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
