import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import "./FradragCalc.css";
import { Trash } from "react-bootstrap-icons";

function FradragCalc() {
  const [apiError, setApiError] = React.useState(false);
  const [fradrag, setFradrag] = React.useState(null);
  const [utgifter, setUtgifter] = React.useState(null);
  const [arbeidsreiser, setArbeidsreiser] = React.useState([]);
  const [besoeksreiser, setBesoeksreiser] = React.useState([]);

  function handleArbeidsreise(e) {
    e.preventDefault();
    let km = null;
    let antall = null;
    km = parseInt(e.target.elements["arbeidsreise-km"].value);
    antall = parseInt(e.target.elements["arbeidsreise-antall"].value);
    setArbeidsreiser((arr) => [...arr, { km: km, antall: antall }]);
    handleReset();
  }
  function handleBesoeksreise(e) {
    e.preventDefault();
    let km = null;
    let antall = null;
    km = parseInt(e.target.elements["besoeksreise-km"].value);
    antall = parseInt(e.target.elements["besoeksreise-antall"].value);
    setBesoeksreiser((arr) => [...arr, { km: km, antall: antall }]);
    handleReset();
  }

  function handleNullstill(e) {
    e.preventDefault();
    handleReset();
    setFradrag(null);
    setUtgifter(null);
    setBesoeksreiser([]);
    setArbeidsreiser([]);
  }
  function handleReset() {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
  }

  function deleteElement(e) {
    e.preventDefault();
    console.log(e);
    console.log(e.target.name);
    if (e.target.name === "delete-arbeidsreiser") {
      var array = [...arbeidsreiser];
    } else if (e.target.name === "delete-besoeksreiser") {
      array = [...besoeksreiser];
    }
    var index = e.target.value;
    console.log(index);
    console.log(array);
    if (index !== -1) {
      array.splice(index, 1);
    }
    if (e.target.name === "delete-arbeidsreiser") {
      setArbeidsreiser(array);
    } else if (e.target.name === "delete-besoeksreiser") {
      setBesoeksreiser(array);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const url =
      "https://9f22opit6e.execute-api.us-east-2.amazonaws.com/default/reisefradrag";
    const data = JSON.stringify({
      arbeidsreiser: arbeidsreiser,
      besoeksreiser: besoeksreiser,
      utgifterBomFergeEtc: utgifter,
    });
    console.log(data);
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          setApiError(true);
          throw new Error(response);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setFradrag(data["reisefradrag"]);
        console.log(fradrag);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  var showFradrag = null;
  if (fradrag != null) {
    showFradrag = (
      <div>
        <Row>
          <div>
            Ditt kalkulerte reisefradrag er: <b>{fradrag}</b> kr.
          </div>
        </Row>
        <Row>
          <div>
            <Button onClick={handleNullstill} variant="secondary">
              Nullstill
            </Button>
          </div>
        </Row>
      </div>
    );
  }
  var showArbeidsreiser = null;
  if (arbeidsreiser.length > 0) {
    showArbeidsreiser = arbeidsreiser.map((item, index) => {
      const { km, antall } = item;
      return (
        <Row>
          <Col>
            Arbeidsreise {index}: {km} km, {antall} stk{" "}
            <Button
              variant="secondary"
              name="delete-arbeidsreiser"
              value={index}
              onClick={deleteElement}
              style={{
                width: "30px",
                height: "30px",
                marginLeft: "5px",
                justifyContent: "center",
              }}
            >
              <Trash size={15} />
            </Button>
          </Col>
        </Row>
      );
    });
  }

  var showBesoksreiser = null;
  if (besoeksreiser.length > 0) {
    showBesoksreiser = besoeksreiser.map((item, index) => {
      const { km, antall } = item;

      return (
        <Row>
          <Col>
            Besøksreise {index}: {km} km, {antall} stk{" "}
            <Button
              variant="secondary"
              name="delete-besoeksreiser"
              value={index}
              onClick={deleteElement}
              style={{
                width: "30px",
                height: "30px",
                marginLeft: "5px",
                justifyContent: "center",
              }}
            >
              <Trash size={15} />
            </Button>
          </Col>
        </Row>
      );
    });
  }

  return (
    <>
      <div className="reisefradragForm">
        <h2>Fyll ut skjema med følgende verdier:</h2>
        <Form className="arbeidsreise-form" onSubmit={handleArbeidsreise}>
          <Row>
            <Form.Label>Legg til arbeidsreiser:</Form.Label>
            <Col>
              <Form.Control
                type="number"
                placeholder="Km"
                name="arbeidsreise-km"
                min="0"
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Antall"
                name="arbeidsreise-antall"
                min="0"
              />
            </Col>
            <Col>
              <Button variant="secondary" type="submit">
                Legg til
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>{showArbeidsreiser}</Row>
        <Form className="besoksreise-form" onSubmit={handleBesoeksreise}>
          <Row>
            <Form.Label>Legg til besøksreiser:</Form.Label>
            <Col>
              <Form.Control
                type="number"
                placeholder="Km"
                name="besoeksreise-km"
                min="0"
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Antall"
                name="besoeksreise-antall"
                min="0"
              />
            </Col>
            <Col>
              <Button variant="secondary" type="submit">
                Legg til
              </Button>
            </Col>
          </Row>
        </Form>

        <Row>{showBesoksreiser}</Row>
        <Row>
          <Col md={4}>
            <Form.Label>
              Legg til andre utgifter som bom, ferge etc.:
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Utgifter"
              name="andre-utgifter"
              min="0"
              onChange={(event) => setUtgifter(parseInt(event.target.value))}
            />
          </Col>
        </Row>
        <Row>
          <div className="submit-button-div">
            <Button
              className="submit-button"
              variant="primary"
              onClick={handleSubmit}
            >
              Generer fradrag
            </Button>
          </div>
          <div className={apiError ? "inline-errormsg" : "hidden"}>
            Beklager, det kunne ikke genereres et fradrag basert på inputen din.
            Endre tallene dine og prøv igjen.
          </div>
        </Row>
      </div>

      {showFradrag}
    </>
  );
}

export default FradragCalc;
