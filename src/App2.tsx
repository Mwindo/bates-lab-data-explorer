import "./App.css";
import { VariablesPanel } from "./VariablesPanel";
import * as dfd from "danfojs/dist/danfojs-browser/src";

function App() {
  return (
    <VariablesPanel
      variables={Array.from(Array(100).keys())}
      variableDataframe={new dfd.DataFrame()}
    />
  );
}

export default App;
