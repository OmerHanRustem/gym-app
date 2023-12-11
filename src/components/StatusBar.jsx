import React from "react";
import { useTranslation } from "react-i18next";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ImportExport } from "./ImportExport";

function StatusBar() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <Navbar fixed="bottom" bg="dark" variant="dark" expand="sm">
      <Container>
        <Navbar.Brand href="" className="ps-3">
          <NavLink to="/gym-app/" className="nav-link">
            <img
              src="./icon-72x72.png"
              alt="..."
              style={{ height: 30, width: 30 }}
              className="me-2"
            />
            {t("bunyan")}
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="d-flex align-items-center">
            <Nav.Item>
              <NavLink to="/gym-app/new" className="nav-link">
                {t("newTraining")}
              </NavLink>
            </Nav.Item>
            <NavDropdown
              title={t("changeLang")}
              id="language-dropdown"
              drop="up"
            >
              <NavDropdown.Item onClick={() => changeLanguage("ar")}>
                العربية
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("en")}>
                English
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Item>
              <ImportExport />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default StatusBar;
