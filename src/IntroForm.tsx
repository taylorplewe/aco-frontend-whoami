import { createSignal } from "solid-js";
import "./App.css";

export default function () {
  const [userName, setUserName] = createSignal("");

  return (
    <>
      <button>Send</button>
      <label for="user-name-input">What is your name?</label>
      <input
        id="user-name-input"
        value={userName()}
        onchange={(e) => setUserName(e.target.value)}
      />
    </>
  );
}
