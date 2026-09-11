import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./home.css";
import "./home-v4.css";
import "./hub-light.css";
import "./expression.css";
import "./studio.css";
import "./evening-v13.css";
import {LocaleProvider} from './Locale';
import AmbientEffects from './AmbientEffects';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocaleProvider><App /><AmbientEffects /></LocaleProvider>
  </React.StrictMode>,
);
