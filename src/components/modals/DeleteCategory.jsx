import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export const DeleteCategory = ({
  deleteCategoryModal,
  setDeleteCategoryModal,
  deletedCategory,
  deleteTraining,
}) => {
  const { t, i18n } = useTranslation();
  return (
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
  );
};
