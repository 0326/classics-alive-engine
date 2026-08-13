import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { activeContent } from "./active-content";
import { App } from "./App";
import "./styles.css";

document.title = `古籍活化 · ${activeContent.story.title}`;
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
