import { ReactNode, useState } from "react";
import "./App.css";
import { DataPanel } from "./DataPanel";
import { DescriptionPanel } from "./DescriptionPanel";
import { Header } from "./Header";

function App() {
  const [variablesDataframeFile, setVariablesDataframeFile] =
    useState<File | null>(null);

  const [modalContent, setModalContent] = useState<string | ReactNode>("");

  const handleFileInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    fileInput.addEventListener("change", (event: any) => {
      const target = event.target;
      if (target && target.files && target.files.length > 0) {
        const file = target.files[0];
        setVariablesDataframeFile(file);
      }
    });

    // Programmatically trigger the file input click event
    fileInput.click();
  };

  return (
    <div style={{ backgroundColor: "#242424" }}>
      <Header setModal={setModalContent} />
      {!variablesDataframeFile ? (
        <div style={{ justifyItems: "center", padding: "10px" }}>
          <p>Welcome to the Bates Lab Data Explorer. To get started:</p>
          <ul>
            <li>Log into the Bates Lab server</li>
            <li>
              Click "Select Data File" below, which will open your file explorer
            </li>
            <li>Navigate to the CSV file "TDS_wide.csv"</li>
          </ul>
          <div style={{ textAlign: "center" }}>
            <button className="big_button" onClick={handleFileInput}>
              Select Data File
            </button>
          </div>
        </div>
      ) : (
        <DataPanel
          variablesDataframeFile={variablesDataframeFile}
          setModal={setModalContent}
        ></DataPanel>
      )}
      {modalContent && (
        <DescriptionPanel
          description={modalContent}
          setModal={setModalContent}
        />
      )}
    </div>
  );
}

export default App;
