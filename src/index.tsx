/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import { ContextProvider } from "./Context.tsx";
import IntroForm from "./IntroForm.tsx";
import EngineerSelection from "./EngineerSelection.tsx";
import Review from "./Review.tsx";

const root = document.getElementById("root");

render(
  () => (
    <Router root={ContextProvider}>
      <Route path="/" component={IntroForm} />
      <Route path="/engineer-select" component={EngineerSelection} />
      <Route path="/review" component={Review} />
    </Router>
  ),
  root!,
);
