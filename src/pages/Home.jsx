import React, { useState, useEffect } from "react";
import { openDB } from "idb";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { EditModal } from "../components/Modal";
import { TrainingForm } from "../components/TrainingForm";
import { TrainingsTable } from "../components/TrainingsTable";
import { TrainingsCards } from "../components/TrainingsCards";
import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation();

  const [trainings, setTrainings] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayDate);

  // Modal form state
  const [modalMachine, setModalMachine] = useState("");
  const [modalGroups, setModalGroups] = useState(1);
  const [modalTimes, setModalTimes] = useState(1);
  const [modalWeight, setModalWeight] = useState(0);
  const [modalUnit, setModalUnit] = useState("kg");

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const viewMode = useSelector((state) => state.UI.viewMode);

  const loadTrainings = async () => {
    const db = await openDB("gym-trainings", 1, {
      upgrade(db) {
        const store = db.createObjectStore("trainings", {
          keyPath: "category",
        });
        store.createIndex("categoryIndex", "category");
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

  const editTrainingEntry = (date, index) => {
    // Set the main form state with the values of the selected training
    setDate(date);
    setEditIndex(index);

    // Set the modal form state with the values of the selected training
    const selectedTraining = trainings.find((t) => t.category === date)
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
      <Row className="justify-content-center align-items-center m-3">
        <h2 className="text-center mb-3">
          <img
            src="./icon-72x72.png"
            alt="Logo"
            style={{ height: 30, width: 30 }}
            className="me-2"
          />
          {t("bunyan")} - {t("gymTrainings")}
        </h2>

        {/* {viewMode === "table" ? (
          <TrainingsTable
            trainings={trainings}
            loadTraining={loadTrainings}
            editTrainingEntry={editTrainingEntry}
          />
        ) : ( */}
        <TrainingsCards
          trainings={trainings}
          loadTraining={loadTrainings}
          editTrainingEntry={editTrainingEntry}
        />
        {/* )} */}
      </Row>
      <EditModal
        showModal={showModal}
        setShowModal={setShowModal}
        setEditIndex={setEditIndex}
        handleSave={handleSaveEdit}
        header={t("editTraining")}
      >
        <TrainingForm
          trainings={trainings}
          setTrainings={setTrainings}
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
