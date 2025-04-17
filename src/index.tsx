/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import { ContextProvider } from "./Context.tsx";
import IntroForm from "./pages/IntroForm.tsx";
import EngineerSelection from "./pages/EngineerSelection.tsx";
import Review from "./pages/Review.tsx";
import UserResults from "./pages/UserResults.tsx";

const root = document.getElementById("root");

render(
  () => (
    <Router root={ContextProvider}>
      <Route path="/" component={IntroForm} />
      <Route path="/engineer-select" component={EngineerSelection} />
      <Route path="/review" component={Review} />
      <Route path="/user-results" component={UserResults} />
    </Router>
  ),
  root!,
);
