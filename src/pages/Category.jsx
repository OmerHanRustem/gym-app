import React, { useState, useEffect } from "react";
import { openDB } from "idb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadTrainings } from "../rtk/slices/ui-slice";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { DeleteCategory } from "../components/modals/DeleteCategory";
import { DeleteExercise } from "../components/modals/DeleteExercise";
import { EditModal } from "../components/Modal";
import { TrainingForm } from "../components/TrainingForm";

function Category() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadTrainings());
  }, []);
  const trainings = useSelector((state) => state.UI.trainings);
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
  const deleteTraining = async (category) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    await store.delete(category);

    dispatch(loadTrainings());
  };

  const [deleteExerciseModal, setDeleteExerciseModal] = useState(false);
  const [deletedExercise, setDeletedExercise] = useState([]);

  const todayDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayDate);
  const [modalCategory, setModalCategory] = useState("");
  const [modalMachine, setModalMachine] = useState("");
  const [modalGroups, setModalGroups] = useState("");
  const [modalTimes, setModalTimes] = useState([]);
  const [modalWeight, setModalWeight] = useState([]);
  const [modalUnit, setModalUnit] = useState("kg");

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const editTrainingEntry = (category, index) => {
    // Set the main form state with the values of the selected training
    setModalCategory(category);
    setEditIndex(index);

    // Set the modal form state with the values of the selected training
    const selectedTraining = trainings.find((t) => t.category === category)
      ?.trainings[index];
    if (selectedTraining) {
      setModalMachine(selectedTraining.machine);
      setModalWeight(selectedTraining.weight);
      setModalUnit(selectedTraining.unit);
      setModalGroups(selectedTraining.groups);
      setModalTimes(selectedTraining.times);
    }

    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    // Retrieve the existing training using the date
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    const existingTraining = await store.get(modalCategory);

    if (existingTraining) {
      // Update the training at the editIndex with the new values from the modal form
      existingTraining.trainings[editIndex] = {
        machine: modalMachine,
        weight: modalWeight,
        unit: modalUnit,
        groups: modalGroups,
        times: modalTimes,
        modDate: new Date().toISOString(),
      };

      // Put the updated training back into the store
      await store.put(existingTraining);

      // Close the modal and refresh the displayed data
      setShowModal(false);
      setEditIndex(null);

      dispatch(loadTrainings());
    }
  };

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

  const validWeight = (val, index) => {
    if (Array.isArray(val)) {
      return val[index];
    } else {
      return val;
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-start m-3 pb-5">
        {Object.entries(groupedTrainings).map(([split, trainings]) =>
          trainings
            .filter((training) => training.category === id)
            .map((training) => (
              <>
                <Card key={training.category} className="p-0 mb-2">
                  <Card.Header>
                    <Card.Title className="d-flex justify-content-evenly align-items-center gap-1">
                      <Link
                        to="/gym-app/"
                        style={{ textDecoration: "none", color: "#000" }}
                      >
                        {i18n.language === "en" ? (
                          <FontAwesomeIcon icon={faArrowLeft} />
                        ) : (
                          <FontAwesomeIcon icon={faArrowRight} />
                        )}
                      </Link>
                      <span style={{ fontSize: 24 }}>
                        {t(training.category)}
                      </span>
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
                </Card>

                <Row className="justify-content-center">
                  {training.trainings.map((ex, index) => (
                    <Card
                      key={`${training.category}-${index}`}
                      className="p-0 m-1 mb-2"
                      style={{ width: "20rem" }}
                    >
                      <Card.Header className="fw-bold">
                        {ex.machine}
                      </Card.Header>
                      <Card.Body>
                        {t("groups")}: {ex.groups}
                        <br />
                        {ex.times.map((time, index) => (
                          <ul key={index} className="m-0 ps-4">
                            <li>
                              {i18n.language === "en" ? (
                                <>
                                  Reps {index + 1} ➡ {time} ×{" "}
                                  {validWeight(ex.weight, index)} {ex.unit}
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
                      <Card.Footer
                        className="text-muted text-end"
                        style={{ fontSize: "smaller" }}
                      >
                        {t("lastModificationDate")}: {formatDate(ex.modDate)}
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
                </Row>
              </>
            ))
        )}
      </Row>
      <DeleteCategory
        deleteCategoryModal={deleteCategoryModal}
        setDeleteCategoryModal={setDeleteCategoryModal}
        deletedCategory={deletedCategory}
        deleteTraining={deleteTraining}
      />
      <DeleteExercise
        deleteExerciseModal={deleteExerciseModal}
        setDeleteExerciseModal={setDeleteExerciseModal}
        deletedExercise={deletedExercise}
      />
      <EditModal
        showModal={showModal}
        setShowModal={setShowModal}
        setEditIndex={setEditIndex}
        handleSave={handleSaveEdit}
        header={t("editTraining")}
      >
        <TrainingForm
          trainings={trainings}
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
}

export default Category;
