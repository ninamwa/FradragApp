import React from 'react';
import {Form, Button, Row, Col } from "react-bootstrap";
import './FradragCalc.css';


function FradragCalc() {
  const [apiError, setApiError] = React.useState(false);
  const [fradrag, setFradrag] = React.useState(null)
  const [utgifter, setUtgifter] = React.useState(null)
  const [arbeidsreiser, setArbeidsreiser] = React.useState([]);
  const [besoeksreiser, setBesoeksreiser] = React.useState([]);

  function handleArbeidsreise(e) {
      e.preventDefault();
      let km = null;
      let antall =null;
      km = parseInt(e.target.elements["arbeidsreise-km"].value);
      antall = parseInt(e.target.elements["arbeidsreise-antall"].value);
      setArbeidsreiser(arr => [...arr, {"km":km,"antall":antall}]);
      handleReset();
  }
  function handleBesoeksreise(e) {
      e.preventDefault();
      let km = null;
      let antall =null;
      km = parseInt(e.target.elements["besoeksreise-km"].value);
      antall = parseInt(e.target.elements["besoeksreise-antall"].value);
      setBesoeksreiser(arr => [...arr, {"km":km,"antall":antall}]);
      handleReset();
  }

  function handleNullstill(e){
      e.preventDefault()
      handleReset();
      setFradrag(null);
      setUtgifter(null);
      setBesoeksreiser([]);
      setArbeidsreiser([]);
  }
  function handleReset(){
    Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
    );
    };

  function handleSubmit(e){
      e.preventDefault()
      const url = "https://9f22opit6e.execute-api.us-east-2.amazonaws.com/default/reisefradrag"
      const data = JSON.stringify({
                "arbeidsreiser": arbeidsreiser,
                "besoeksreiser": besoeksreiser,
                "utgifterBomFergeEtc": utgifter
            });
        console.log(data)
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
        setFradrag(data["reisefradrag"])
        console.log(fradrag)
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

    var showFradrag = null;
    if (fradrag != null){
        showFradrag = (<div><Row><div>Ditt kalkulerte reisefradrag er: <b>{fradrag}</b> kr.</div></Row>
        <Row><div><Button onClick={handleNullstill} variant="secondary">Nullstill</Button></div></Row></div>
        )
    }
    var showArbeidsreiser = null;
    if (arbeidsreiser.length > 0){
        showArbeidsreiser= arbeidsreiser.map((item, index) => {
            const { km, antall } = item;
            return(<div>Arbeidsreise {index}: {km} km, {antall} stk </div>);
        })
    };

    var showBesoksreiser = null;
    if (besoeksreiser.length > 0){
        showBesoksreiser= besoeksreiser.map((item, index) => {
            const { km, antall } = item;
        
            return(<div>Besøksreise {index}: {km} km, {antall} stk </div>);
        })
    };


  return (
    <>
      <div className="reisefradragForm">
        <h2>Fyll ut skjema med følgende verdier:</h2>
        <Row>
            <Form onSubmit={handleArbeidsreise}>
                <Form.Label>Legg til arbeidsreise:</Form.Label>
                <Col>
                <Form.Control
                  type="number"
                  placeholder="Km"
                  name="arbeidsreise-km"
                  min="0"
                /></Col>
                <Col>
                <Form.Control
                  type="number"
                  placeholder="Antall"
                  name="arbeidsreise-antall"
                  min="0"
                /></Col>
                <Col>
                <Button variant="secondary" type="submit">Legg til</Button>
                </Col>
            </Form>
        </Row>
        <Row>
            {showArbeidsreiser}
        </Row>
        <Row>
            <Form onSubmit={handleBesoeksreise}>
                <Form.Label>Legg til besøksreise:</Form.Label>
                <Col>
                <Form.Control
                  type="number"
                  placeholder="Km"
                  name="besoeksreise-km"
                  min="0"
                /></Col>
                <Col>
                <Form.Control
                  type="number"
                  placeholder="Antall"
                  name="besoeksreise-antall"
                  min="0"
                /></Col>
                <Col>
                <Button variant="secondary" type="submit">Legg til</Button>
                </Col>
            </Form>
        </Row>
        <Row>
            {showBesoksreiser}
        </Row>
        <Row>
            <Col md={4}>
                <Form.Control
                  type="number"
                  placeholder="Utgifter"
                  name="andre-utgifter"
                  min="0"
                  onChange={(event)=> setUtgifter(parseInt(event.target.value))}
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
          <div
            className={
              apiError ? "inline-errormsg" : "hidden"
            }
          >
            Beklager, det kunne ikke genereres et fradrag basert på inputen din. Endre tallene dine og prøv igjen. 
          </div>
        </Row>
        
      </div>

    {showFradrag}
    </>
  );
}

export default FradragCalc;