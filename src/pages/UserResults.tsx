import { useContext, createSignal, onMount } from "solid-js";

import { Context } from "../Context";
import "./UserResults.css";

const APPEAR_TRANSITION_DURATION = 500;
const TRANSITION_INTERVAL = APPEAR_TRANSITION_DURATION * 0.6;
const SUSPENSE_DURATION = 1200;

export default function () {
  const context = useContext(Context);

  // appear animation
  const [aStyle, setAStyle] = createSignal<any>({});
  const [bStyle, setBStyle] = createSignal<any>({});
  const [cStyle, setCStyle] = createSignal<any>({});
  onMount(() => {
    setTimeout(() => {
      setAStyle({
        opacity: "1.0",
        translate: "0 0",
        "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
      });
      setTimeout(() => {
        setBStyle({
          opacity: "1.0",
          translate: "0 0",
          "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
        });
        setTimeout(() => {
          setCStyle({
            opacity: "1.0",
            translate: "0 0",
            "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
          });
        }, TRANSITION_INTERVAL);
      }, SUSPENSE_DURATION);
    }, 50);
  });

  return (
    <>
      <p class="user-results" style={aStyle()}>
        you got...
      </p>
      <div class="number-result">
        <h1 class="user-results" style={bStyle()}>
          {context?.store.numCorrect}
        </h1>
        <p class="user-results" style={cStyle()}>
          /{context?.store.engineers.length}
        </p>
      </div>
      <p class="user-results" style={cStyle()}>
        correct!
      </p>
    </>
  );
}
