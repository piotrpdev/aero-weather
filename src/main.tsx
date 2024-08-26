import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// TODO: Import reset css
import "@fontsource-variable/roboto-flex/full.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
