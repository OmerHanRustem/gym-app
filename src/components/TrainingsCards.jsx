import React, { useState } from "react";
import { openDB } from "idb";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import { loadTrainings } from "../rtk/slices/ui-slice";

export const TrainingsCards = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const trainings = useSelector((state) => state.UI.trainings);

  // const [expandedCategories, setExpandedCategories] = useState([]);

  // const toggleDateCard = (category) => {
  //   if (expandedCategories.includes(category)) {
  //     setExpandedCategories(expandedCategories.filter((d) => d !== category));
  //   } else {
  //     setExpandedCategories([...expandedCategories, category]);
  //   }
  // };

  // Group the training data by 'training.split' value
  const groupedTrainings = trainings.reduce((result, training) => {
    const key = training.split;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(training);
    return result;
  }, {});

  function cleanLink(inputString) {
    // Replace special characters with dashes
    const cleanedString = inputString.replace(/[^\w\s-]/g, "-");

    // Remove consecutive dashes
    const finalString = cleanedString.replace(/-{2,}/g, "-");

    return finalString;
  }

  return (
    <>
      <Row className="justify-content-center align-items-start mb-5">
        {Object.entries(groupedTrainings).map(([split, trainings]) => (
          <Card key={split} className="m-1 p-0" style={{ width: "18rem" }}>
            <Card.Header className="h4">{t(split)}</Card.Header>
            <Card.Body>
              {trainings.map((training, rowIndex) => (
                <NavLink
                  to={`/gym-app/${training.category}`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <Card key={training.category} className="mb-2 p-0">
                    <Card.Header>
                      <Card.Title
                        className="d-flex justify-content-evenly align-items-center gap-1"
                        style={{ cursor: "pointer" }}
                      >
                        <span>{t(training.category)}</span>
                      </Card.Title>
                    </Card.Header>
                  </Card>
                </NavLink>
              ))}
            </Card.Body>
          </Card>
        ))}
      </Row>
    </>
  );
};
