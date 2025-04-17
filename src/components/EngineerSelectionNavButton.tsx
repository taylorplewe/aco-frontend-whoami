import { Component, Index, createMemo, createSignal, onMount } from "solid-js";
import "./EngineerSelectionNavButton.css";

const EngineerSelectionNavButton: Component<{
  isForward: boolean;
  onClick: Function;
}> = (props) => {
  const [engineerText, setEngineerText] = createSignal<string>("");
  const mm = matchMedia("screen and (max-width: 700px)");
  mm.onchange = () => setEngineerText(mm.matches ? "" : " engineer");
  onMount(() => setEngineerText(mm.matches ? "" : " engineer"));
  const buttonText = createMemo(() =>
    props.isForward
      ? ["", `next${engineerText()}`, "👉"]
      : ["👈", `previous${engineerText()}`, ""],
  );

  return (
    <>
      <nav>
        <button
          class="next-prev-engineer-button"
          classList={{ "is-forward": props.isForward }}
          onClick={() => props.onClick()}
        >
          <Index each={buttonText()}>{(item) => <span>{item()}</span>}</Index>
        </button>
      </nav>
    </>
  );
};
export default EngineerSelectionNavButton;
