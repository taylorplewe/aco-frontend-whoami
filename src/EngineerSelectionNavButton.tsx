import { Component, Index, createMemo } from "solid-js";
import "./EngineerSelectionNavButton.css";

const EngineerSelectionNavButton: Component<{ isForward: boolean }> = (
  props,
) => {
  const buttonText = createMemo(() =>
    props.isForward
      ? ["", "next engineer", "👉"]
      : ["👈", "previous engineer", ""],
  );

  return (
    <>
      <nav>
        <button classList={{ "is-forward": props.isForward }}>
          <Index each={buttonText()}>{(item) => <span>{item()}</span>}</Index>
        </button>
      </nav>
    </>
  );
};
export default EngineerSelectionNavButton;
