import { Component, Index, createMemo } from "solid-js";
import "./EngineerSelectionNavButton.css";

const EngineerSelectionNavButton: Component<{
  isForward: boolean;
  onClick: Function;
}> = (props) => {
  const buttonText = createMemo(() =>
    props.isForward
      ? ["", "next engineer", "👉"]
      : ["👈", "previous engineer", ""],
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
