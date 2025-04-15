import { createSignal } from "solid-js";
import "./App.css";

export default function () {
  const [userName, setUserName] = createSignal("");

  return (
    <>
      <form>
        <label for="user-name-input">What is your name?</label>
        <input
          id="user-name-input"
          value={userName()}
          onchange={(e) => setUserName(e.target.value)}
        />
        <button type="button">Let's go!</button>
      </form>
    </>
  );
}
