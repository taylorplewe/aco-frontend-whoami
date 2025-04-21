import {
  Component,
  Show,
  createMemo,
  createSignal,
  Index,
  useContext,
  onMount,
} from "solid-js";

import { Context } from "../Context";
import styles from "./EngineerSelectionNavButtons.module.css";

const EngineerSelectionNavButtons: Component<{ onClick: Function }> = (
  props,
) => {
  const context = useContext(Context);
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => setIsMounted(true));

  const selectedButtonEl = createMemo(() => {
    if (isMounted()) {
      return document.querySelector(
        `#nav-button-${context?.store.currentEngineerIndex}`,
      );
    }
  });
  const selectedButtonOutlineLeftValue = createMemo(
    () => selectedButtonEl() && (selectedButtonEl() as HTMLElement).offsetLeft,
  );
  const selectedButtonOutlineTopValue = createMemo(
    () => selectedButtonEl() && (selectedButtonEl() as HTMLElement).offsetTop,
  );

  const doneNumbers = createMemo(() =>
    Object.values(context?.store.selectedEngineers || {}),
  );

  return (
    <ul class={styles["button-list"]}>
      <Index each={Array(context?.store.engineers.length)}>
        {(_, index) => (
          <li>
            <button
              id={`nav-button-${index + 1}`}
              class={styles["nav-button"]}
              classList={{
                [styles["nav-button--done"]]: doneNumbers().includes(index + 1),
              }}
              onClick={() => props.onClick(index + 1)}
            >
              {index + 1}
              <Show when={doneNumbers().includes(index + 1)}>
                <i class={styles["nav-button-check-mark"]}>
                  {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                </i>
              </Show>
            </button>
          </li>
        )}
      </Index>
      <div
        class={styles["nav-button-outline"]}
        style={{
          top: `${selectedButtonOutlineTopValue()}px`,
          left: `${selectedButtonOutlineLeftValue()}px`,
        }}
      ></div>
    </ul>
  );
};
export default EngineerSelectionNavButtons;
