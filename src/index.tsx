/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import { ContextProvider } from "./Context.tsx";
import IntroForm from "./pages/IntroForm.tsx";
import EngineerSelection from "./pages/EngineerSelection.tsx";
import Review from "./pages/Review.tsx";
import UserResults from "./pages/UserResults.tsx";
import Results from "./pages/Results.tsx";
import urls from "./urls.ts";

const root = document.getElementById("root");

render(
  () => (
    <Router root={ContextProvider}>
      <Route path={urls.INTRO} component={IntroForm} />
      <Route path={urls.ENGINEER_SELECT} component={EngineerSelection} />
      <Route path={urls.REVIEW} component={Review} />
      <Route path={urls.USER_RESULTS} component={UserResults} />
      <Route path={urls.RESULTS} component={Results} />
    </Router>
  ),
  root!,
);
