import { useState } from "react";
import Home from "./components/Home";
import RegModules from "./components/RegModules";
import MCQ from "./components/MCQ";
import Summary from "./components/Summary";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [sessionData, setSessionData] = useState(null);

  if (screen === "home") return <Home setScreen={setScreen} />;
  if (screen === "reg") return <RegModules setScreen={setScreen} />;
  if (screen === "mcq")
    return <MCQ setScreen={setScreen} setSessionData={setSessionData} />;
  if (screen === "summary")
    return <Summary sessionData={sessionData} setScreen={setScreen} />;

  return null;
}
