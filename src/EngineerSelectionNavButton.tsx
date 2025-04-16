import { Component, createMemo } from "solid-js";
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
          <span>{buttonText()[0]}</span>
          <span>{buttonText()[1]}</span>
          <span>{buttonText()[2]}</span>
        </button>
      </nav>
    </>
  );
};
export default EngineerSelectionNavButton;
