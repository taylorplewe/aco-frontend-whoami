import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import "./App.css";

export default function () {
  const [userName, setUserName] = createSignal("");
  const navigate = useNavigate();

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
