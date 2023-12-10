import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const EditModal = ({
  showModal,
  setShowModal,
  handleSave,
  header = "Edit",
  closeText = "Close",
  saveText = "Save Changes",
  children,
}) => {
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
          {closeText}
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {saveText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
