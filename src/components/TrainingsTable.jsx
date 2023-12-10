import React from "react";
import { openDB } from "idb";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export const TrainingsTable = ({
  trainings,
  editTrainingEntry,
  loadTrainings,
}) => {
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
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Machine</th>
          <th>Weight</th>
          <th>Groups</th>
          <th>Times</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {trainings.map((training, rowIndex) => (
          <React.Fragment key={training.date}>
            {training.trainings.map((t, index) => (
              <tr key={`${training.date}-${index}`}>
                {index === 0 && (
                  <td
                    rowSpan={training.trainings.length}
                    className="text-center align-middle"
                  >
                    {training.date}{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteTraining(training.date)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
                <td>{t.machine}</td>
                <td>
                  {t.weight} {t.unit}
                </td>
                <td>{t.groups}</td>
                <td>{t.times}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-1"
                    onClick={() => editTrainingEntry(training.date, index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTrainingEntry(training.date, index)}
                  >
                    Delete
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
