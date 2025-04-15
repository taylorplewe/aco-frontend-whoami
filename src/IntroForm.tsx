import { createSignal, createEffect, useContext } from "solid-js";
import { useNavigate } from "@solidjs/router";

import "./App.css";
import { Context } from "./Context.tsx";

export default function () {
  const [userName, setUserName] = createSignal<string>("");
  const navigate = useNavigate();
  const context = useContext(Context);

  createEffect(() => {
    context?.setStore("userName", userName());
  });

  return (
    <>
      <form id="intro-form">
        <label for="user-name-input">What is your name?</label>
        <input
          id="user-name-input"
          value={userName()}
          onchange={(e) => setUserName(e.target.value)}
        />
        <button type="button" onClick={() => navigate("/engineer-select")}>
          Let's go!
        </button>
      </form>
    </>
  );
}
