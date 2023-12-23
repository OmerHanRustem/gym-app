import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export const DeleteExercise = ({
  deleteExerciseModal,
  setDeleteExerciseModal,
  deletedExercise,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <Modal
      show={deleteExerciseModal}
      onHide={() => setDeleteExerciseModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Exercise</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure that you want to DELETE this exercise?
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
  );
};
