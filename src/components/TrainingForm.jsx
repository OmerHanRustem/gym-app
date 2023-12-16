import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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

  return (
    <>
      <Container>
        <Form>
          {addForm && (
            <>
              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="split" column sm={singleLabel}>
                  {t("split")}
                </Form.Label>
                {!customSplit && (
                  <Col sm={singleControl}>
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
                        Select a split
                      </option>
                      {getSplitOptions().map((splitOption, index) => (
                        <option key={index} value={splitOption}>
                          {splitOption}
                        </option>
                      ))}
                      <option value="custom">Custom</option>
                    </Form.Select>
                  </Col>
                )}

                {customSplit && (
                  <>
                    <Col sm={3}>
                      <Form.Control
                        id="customSplit"
                        type="text"
                        placeholder="Enter custom split"
                        value={split}
                        onChange={(e) => setSplit(e.target.value)}
                      />
                    </Col>
                    <Col sm={1} onClick={() => setCustomSplit(false)}>
                      <Button variant="secondary">X</Button>
                    </Col>
                  </>
                )}
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="category" column sm={singleLabel}>
                  {t("category")}
                </Form.Label>
                {!customCategory && (
                  <Col sm={singleControl}>
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
                        Select a category
                      </option>
                      {getCategoryOptions().map((CategoryOption, index) => (
                        <option key={index} value={CategoryOption}>
                          {CategoryOption}
                        </option>
                      ))}
                      <option value="custom">Custom</option>
                    </Form.Select>
                  </Col>
                )}

                {customCategory && (
                  <>
                    <Col sm={3}>
                      <Form.Control
                        id="customCategory"
                        type="text"
                        placeholder="Enter custom category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </Col>
                    <Col sm={1} onClick={() => setCustomCategory(false)}>
                      <Button variant="secondary">X</Button>
                    </Col>
                  </>
                )}
              </Form.Group>
            </>
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
                type="text"
                pattern="[0-9]*"
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
                type="text"
                pattern="[0-9]*"
                value={groups}
                onChange={(e) => setGroups(Number(e.target.value))}
              />
            </Col>
          </Form.Group>

          {Array.from({ length: groups }, (_, index) => index + 1).map(
            (set) => (
              <Form.Group as={Row} className="mb-3" key={set}>
                <Form.Label htmlFor={`groups-${set}`} column sm={singleLabel}>
                  {i18n.language === "ar"
                    ? `${t("times")} ${t("set")} ${set}`
                    : `${t("set")} ${set} ${t("times")}`}
                </Form.Label>
                <Col sm={singleControl}>
                  <Form.Control
                    id={`groups-${set}`}
                    type="text"
                    pattern="[0-9]*"
                    value={times[set - 1] || 0}
                    onChange={(e) => {
                      const newTimes = [...times];
                      newTimes[set - 1] = Number(e.target.value);
                      setTimes(newTimes.slice(0, groups)); // Adjust array size
                    }}
                  />
                </Col>
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
