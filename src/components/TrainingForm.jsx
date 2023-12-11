import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { useTranslation } from "react-i18next";

export const TrainingForm = ({
  date,
  setDate,
  addForm = true,
  addTraining,
  machine,
  setMachine,
  groups,
  setGroups,
  times,
  setTimes,
  weight,
  setWeight,
  unit,
  setUnit,
  singleLabel = "1",
  singleControl = "4",
  multiControl = "2",
}) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Form>
        {addForm && (
          <Form.Group as={Row} className="mb-3">
            <Form.Label htmlFor="date" column sm={singleLabel}>
              {t("date")}
            </Form.Label>
            <Col sm={singleControl}>
              <Form.Control
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Col>
          </Form.Group>
        )}

        <Form.Group as={Row} className="mb-3">
          <Form.Label htmlFor="machine" column sm={singleLabel}>
            {t("machine")}
          </Form.Label>
          <Col sm={singleControl}>
            <Form.Control
              id="machine"
              type="text"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label htmlFor="weight" column sm={singleLabel}>
            {t("weight")}
          </Form.Label>
          <Col sm={multiControl}>
            <Form.Control
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </Col>
          <Col sm={multiControl}>
            <Form.Select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="kg">{t("kg")}</option>
              <option value="lb">{t("lb")}</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label htmlFor="groups" column sm={singleLabel}>
            {t("groups")}
          </Form.Label>
          <Col sm={singleControl}>
            <Form.Control
              id="groups"
              type="number"
              value={groups}
              onChange={(e) => setGroups(Number(e.target.value))}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label htmlFor="groups" column sm={singleLabel}>
            {t("times")}
          </Form.Label>
          <Col sm={singleControl}>
            <Form.Control
              id="groups"
              type="number"
              value={times}
              onChange={(e) => setTimes(Number(e.target.value))}
            />
          </Col>
        </Form.Group>
      </Form>

      {addForm && (
        <Button
          className="mt-2 w-50"
          variant={
            !date || !machine || !groups || !weight ? "secondary" : "primary"
          }
          onClick={addTraining}
          disabled={!date || !machine || !groups || !weight}
        >
          {t("addTraining")}
        </Button>
      )}
    </>
  );
};
