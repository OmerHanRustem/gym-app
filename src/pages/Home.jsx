import React, { useState, useEffect } from "react";
import { openDB } from "idb";
import { loadTrainings } from "../rtk/slices/ui-slice";
import { useSelector, useDispatch } from "react-redux";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { EditModal } from "../components/Modal";
import { TrainingForm } from "../components/TrainingForm";
import { TrainingsTable } from "../components/TrainingsTable";
import { TrainingsCards } from "../components/TrainingsCards";

import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const viewMode = useSelector((state) => state.UI.viewMode);

  useEffect(() => {
    dispatch(loadTrainings());
  }, []);

  return (
    <Container>
      <Row className="justify-content-center align-items-center m-3">
        <h2 className="text-center mb-3">
          <img
            src="./icon-72x72.png"
            alt="Logo"
            style={{ height: 30, width: 30 }}
            className="me-2"
          />
          {t("bunyan")} - {t("gymTrainings")}
        </h2>

        <TrainingsCards />
      </Row>
    </Container>
  );
};

export default Home;
