import React from "react";
import { openDB } from "idb";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import { useTranslation } from "react-i18next";

export const TrainingsTable = ({
  trainings,
  editTrainingEntry,
  loadTrainings,
}) => {
  const { t, i18n } = useTranslation();

  const deleteTrainingEntry = async (date, index) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    const existingTraining = await store.get(date);

    if (existingTraining) {
      existingTraining.trainings.splice(index, 1); // Remove the entry at the specified index
      await store.put(existingTraining);
      loadTrainings(); // Refresh the displayed data after deletion
    }
  };

  const deleteTraining = async (date) => {
    const db = await openDB("gym-trainings", 1);
    const transaction = db.transaction("trainings", "readwrite");
    const store = transaction.objectStore("trainings");

    await store.delete(date);

    loadTrainings(); // Refresh the displayed data after deletion
  };

  return (
    <Table striped bordered hover style={{ tableLayout: "fixed" }} className="mb-5">
      <thead>
        <tr>
          <th>{t("category")}</th>
          <th>{t("machine")}</th>
          <th>{t("weight")}</th>
          <th>{t("groups")}</th>
          <th>{t("times")}</th>
          <th>{t("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {trainings.map((training, rowIndex) => (
          <React.Fragment key={training.category}>
            {training.trainings.map((ex, index) => (
              <tr key={`${training.category}-${index}`}>
                {index === 0 && (
                  <td
                    rowSpan={training.trainings.length}
                    className="text-center align-middle"
                  >
                    {training.category}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteTraining(training.category)}
                    >
                      {t("delete")}
                    </Button>
                  </td>
                )}
                <td>{ex.machine}</td>
                <td>
                  {ex.weight} {t(ex.unit)}
                </td>
                <td>{ex.groups}</td>
                <td>{ex.times}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-1"
                    onClick={() => editTrainingEntry(training.category, index)}
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
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
};
