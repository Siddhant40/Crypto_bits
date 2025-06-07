import { useState } from "react";
import "./App.css";
import Settings from "./components/Settings";
import Logs from "./components/Logs";
import AOS from "aos";
import "aos/dist/aos.css";
import PastData from "./components/PastData";
import Predictions from "./components/Predictions";
import { IoClose } from "react-icons/io5";
import { SiGoogledocs } from "react-icons/si";
import Analysis from "./components/Analysis";
AOS.init();

function App() {
  const [activeSection, setActiveSection] = useState("analysis");
  const [viewDoc, setViewDoc] = useState(false);

  return (
    <div className="w-full h-[1000px] bg-gray-800 absolute top-0 left-0 flex flex-col justify-start items-center overflow-hidden pt-16">
      <p className="text-white text-[30px] font-semibold">
        ML Model Dashboard{" "}
      </p>
      <div className="w-[45%] h-[50px] rounded-lg bg-gray-700/50 border-[1px] border-gray-600 mt-6 p-0.5 flex flex-row">
        <button
          className={`text-white text-[15px] flex flex-row justify-center items-center w-[50%] h-full ${
            activeSection === "settings" ? "bg-blue-500" : null
          } ${
            activeSection === "settings" ? "border-[1px]" : null
          } border-gray-600 rounded-lg`}
          onClick={() => {
            setActiveSection("settings");
          }}
        >
          Settings
        </button>
        <button
          className={`text-white text-[15px] flex flex-row justify-center items-center w-[50%] h-full ${
            activeSection === "logs" ? "bg-blue-500" : null
          } ${
            activeSection === "logs" ? "border-[1px]" : null
          } border-gray-600 rounded-lg`}
          onClick={() => {
            setActiveSection("logs");
          }}
        >
          Logs
        </button>
        <button
          className={`text-white text-[15px] flex flex-row justify-center items-center w-[50%] h-full ${
            activeSection === "pastdata" ? "bg-blue-500" : null
          } ${
            activeSection === "pastdata" ? "border-[1px]" : null
          } border-gray-600 rounded-lg`}
          onClick={() => {
            setActiveSection("pastdata");
          }}
        >
          Past Data
        </button>
        <button
          className={`text-white text-[15px] flex flex-row justify-center items-center w-[50%] h-full ${
            activeSection === "predictions" ? "bg-blue-500" : null
          } ${
            activeSection === "predictions" ? "border-[1px]" : null
          } border-gray-600 rounded-lg`}
          onClick={() => {
            setActiveSection("predictions");
          }}
        >
          Predictions
        </button>
        <button
          className={`text-white text-[15px] leading-4 flex flex-row justify-center items-center w-[50%] h-full ${
            activeSection === "analysis" ? "bg-blue-500" : null
          } ${
            activeSection === "analysis" ? "border-[1px]" : null
          } border-gray-600 rounded-lg`}
          onClick={() => {
            setActiveSection("analysis");
          }}
        >
          Technical Analysis
        </button>
      </div>
      <div className="mt-[3%] w-[60%] border-0">
        {activeSection === "settings" ? (
          <Settings />
        ) : activeSection === "logs" ? (
          <Logs />
        ) : activeSection === "pastdata" ? (
          <PastData />
        ) : activeSection === "predictions" ? (
          <Predictions />
        ) : (
          <Analysis />
        )}
      </div>
      <div
        className={`absolute h-full top-0 right-[-5%] overflow-scroll flex flex-row pl-36 ${
          viewDoc ? "expand-doc" : "collapse-doc"
        }`}
      >
        {viewDoc ? (
          <button
            className="absolute left-20 top-0 h-[40px] w-[50px] rounded-lg flex flex-row justify-end items-center mr-4"
            onClick={() => {
              setViewDoc(false);
            }}
          >
            <IoClose color={"white"} size={25} className="text-white" />
          </button>
        ) : (
          <button
            className="absolute left-0 top-0 h-[40px] w-[120px] border-[1px] border-gray-500 text-white text-[12px] rounded-full flex flex-row justify-center items-center gap-2 mr-4 my-4"
            onClick={() => {
              setViewDoc(true);
            }}
          >
            <SiGoogledocs color={"white"} size={15} className="text-white" /> View Docs
          </button>
        )}
        <div className="w-[95%] h-full bg-black/50 backdrop-blur-sm">
          <iframe
            width={"100%"}
            height={"100%"}
            src="https://docs.google.com/document/d/e/2PACX-1vTUTwatvW0mBqkXuUO1e9QEikwJJA5duBZ8YiP3BibvUGt7TBr2JLz7gayfLyGQbS15tX3Gj5GGb3Ce/pub?embedded=true"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default App;
