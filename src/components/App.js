
import './App.css';
import FradragCalc from "./FradragCalc";

function App() {
  return (
        <div className="component-app" style={{marginLeft: "30px"}}>
          <h1> Reisefradag-generator</h1>
          <h2 style={{ paddingBottom: "60px" }}> Her kan du regne ut hvilket reisefradrag du har krav på</h2>
          <FradragCalc />
        </div>
  );
}

export default App;
