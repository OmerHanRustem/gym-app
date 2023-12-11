import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useTranslation } from "react-i18next";

export const EditModal = ({
  showModal,
  setShowModal,
  handleSave,
  header = "Edit",
  closeText = "Close",
  saveText = "Save Changes",
  children,
}) => {
  const { t, i18n } = useTranslation();

  const handleCloseModal = () => {
    setShowModal(false);
    setEditIndex(null);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          {t("close")}
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {t("saveChanges")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
