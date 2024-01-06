import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import { openDB } from "idb";

export const TrainingForm = ({
  split,
  setSplit,
  category,
  setCategory,
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
  singleLabel = "2",
  singleControl = "4",
  multiControl = "2",
}) => {
  const { t, i18n } = useTranslation();
  const [trainings, setTrainings] = useState([]);

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

  const [customSplit, setCustomSplit] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  // Function to get unique split values from the trainings array
  const getSplitOptions = () => {
    const uniqueSplits = Array.from(
      new Set(trainings.map((training) => training.split))
    );
    return uniqueSplits;
  };

  const getCategoryOptions = () => {
    const uniqueCategories = Array.from(
      new Set(trainings.map((training) => training.category))
    );
    return uniqueCategories;
  };

  const validWeight = (val, index) => {
    if (Array.isArray(val)) {
      return val[index - 1];
    } else {
      return val;
    }
  };

  return (
    <>
      <Container>
        <Form>
          {addForm && (
            <>
              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="split" column sm={singleLabel} xs={3}>
                  {t("split")}
                </Form.Label>
                {!customSplit && (
                  <Col sm={singleControl} xs={9}>
                    <Form.Select
                      id="split"
                      value={split}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setCustomSplit(true);
                        } else {
                          setSplit(e.target.value);
                        }
                      }}
                    >
                      <option value="" disabled>
                        {t("Select a split")}
                      </option>
                      {getSplitOptions().map((splitOption, index) => (
                        <option key={index} value={splitOption}>
                          {t(splitOption)}
                        </option>
                      ))}
                      <option value="custom">{t("custom")}</option>
                    </Form.Select>
                  </Col>
                )}

                {customSplit && (
                  <>
                    <Col sm={3} xs={8}>
                      <Form.Control
                        id="customSplit"
                        type="text"
                        placeholder={t("Enter custom split")}
                        value={split}
                        onChange={(e) => setSplit(e.target.value)}
                      />
                    </Col>
                    <Col sm={1} xs={2}>
                      <FontAwesomeIcon
                        icon={faRotateLeft}
                        onClick={() => setCustomSplit(false)}
                      />
                    </Col>
                  </>
                )}
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="category" column sm={singleLabel} xs={3}>
                  {t("category")}
                </Form.Label>
                {!customCategory && (
                  <Col sm={singleControl} xs={9}>
                    <Form.Select
                      id="category"
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setCustomCategory(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                    >
                      <option value="" disabled>
                        {t("Select a category")}
                      </option>
                      {getCategoryOptions().map((CategoryOption, index) => (
                        <option key={index} value={CategoryOption}>
                          {t(CategoryOption)}
                        </option>
                      ))}
                      <option value="custom">{t("custom")}</option>
                    </Form.Select>
                  </Col>
                )}

                {customCategory && (
                  <>
                    <Col sm={3} xs={7}>
                      <Form.Control
                        id="customCategory"
                        type="text"
                        placeholder={t("Enter custom category")}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </Col>
                    <Col sm={1} xs={2}>
                      <FontAwesomeIcon
                        icon={faRotateLeft}
                        onClick={() => setCustomCategory(false)}
                      />
                    </Col>
                  </>
                )}
              </Form.Group>
            </>
          )}

          <Form.Group as={Row} className="mb-3">
            <Form.Label htmlFor="machine" column sm={singleLabel} xs={3}>
              {t("machine")}
            </Form.Label>
            <Col sm={singleControl} xs={9}>
              <Form.Control
                id="machine"
                type="text"
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label htmlFor="weight" column sm={singleLabel} xs={3}>
              {t("weight")}
            </Form.Label>
            <Col sm={singleControl} xs={9}>
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
            <Form.Label htmlFor="groups" column sm={singleLabel} xs={3}>
              {t("groups")}
            </Form.Label>
            <Col sm={singleControl} xs={9}>
              <Form.Control
                id="groups"
                type="number"
                pattern="[0-9]*"
                value={groups || null}
                onChange={(e) => setGroups(Number(e.target.value))}
              />
            </Col>
          </Form.Group>

          {Array.from({ length: groups }, (_, index) => index + 1).map(
            (set) => (
              <Form.Group as={Row} className="mb-3" key={set}>
                <Form.Label htmlFor={`groups-${set}`} column sm={singleLabel} xs={3}>
                  {i18n.language === "ar"
                    ? `${t("times")} ${t("set")} ${set}`
                    : `${t("times")} ${set}`}
                </Form.Label>
                <Col sm={3} xs={4}>
                  <Form.Control
                    id={`groups-${set}`}
                    type="number"
                    pattern="[0-9]*"
                    value={times[set - 1] || null}
                    onChange={(e) => {
                      const newTimes = [...times];
                      newTimes[set - 1] = Number(e.target.value);
                      setTimes(newTimes.slice(0, groups)); // Adjust array size
                    }}
                  />
                </Col>
                <Col sm={3} xs={4}>
                  <Form.Control
                    id={`weight-${set}`}
                    type="number"
                    pattern="[0-9]*"
                    value={validWeight(weight, set) || null}
                    onChange={(e) => {
                      const newWeights = [...weight];
                      newWeights[set - 1] = Number(e.target.value);
                      setWeight(newWeights.slice(0, groups)); // Adjust array size
                    }}
                  />
                </Col>
                <Form.Label column sm={3} xs={1}>
                  {t(unit)}
                </Form.Label>
              </Form.Group>
            )
          )}
        </Form>

        {addForm && (
          <Button
            className="mt-2"
            variant={
              !category || !machine || !groups || !weight
                ? "secondary"
                : "primary"
            }
            onClick={addTraining}
            disabled={!category || !machine || !groups || !weight}
          >
            {t("addTraining")}
          </Button>
        )}
      </Container>
    </>
  );
};
