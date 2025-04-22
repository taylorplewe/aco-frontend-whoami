import {
  For,
  createSignal,
  createMemo,
  useContext,
  onMount,
  onCleanup,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Context, STORAGE_KEY_SELECTED_ENGINEERS } from "../Context.tsx";
import EngineerSelectionNavButtons from "../components/EngineerSelectionNavButtons.tsx";
import SearchInput from "../components/SearchInput.tsx";
import EngineerButton from "../components/EngineerButton.tsx";
import shuffle from "../shuffle.ts";
import urls from "../urls.ts";
import styles from "./EngineerSelection.module.css";

const APPEAR_TRANSITION_DURATION = 500;
const TRANSITION_INTERVAL = APPEAR_TRANSITION_DURATION * 0.5;

export default function () {
  const context = useContext(Context);
  const navigate = useNavigate();

  const navKeydownEventHandler: EventListenerOrEventListenerObject = (
    e: Event,
  ) => {
    switch ((e as KeyboardEvent).key) {
      case "ArrowRight":
      case "ArrowLeft":
        navigateBetweenEngineers((e as KeyboardEvent).key === "ArrowRight");
        break;
    }
  };

  // appear animation
  const [headerStyle, setHeaderStyle] = createSignal<any>({});
  const [ulStyle, setUlStyle] = createSignal<any>({});
  onMount(() => {
    window.addEventListener("keydown", navKeydownEventHandler);
    setTimeout(() => {
      setHeaderStyle({
        opacity: "1.0",
        translate: "0 0",
        "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
      });
      setTimeout(() => {
        setUlStyle({
          opacity: "1.0",
          translate: "0 0",
          "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
        });
      }, TRANSITION_INTERVAL);
    }, 90);
  });

  onCleanup(() =>
    window.removeEventListener("keydown", navKeydownEventHandler),
  );

  // search
  const [searchText, setSearchText] = createSignal<string>("");
  const shuffledEngineers = createMemo(() =>
    Array.from(shuffle(context?.store.engineers || [])),
  );
  const filteredEngineers = createMemo(() =>
    shuffledEngineers().filter((engineer) =>
      engineer.name.toLowerCase().includes(searchText().toLowerCase()),
    ),
  );

  // navigate between engineers
  const canNavigateLeft = createMemo(
    () => (context?.store.currentEngineerIndex || 1) > 1,
  );
  const canNavigateRight = createMemo(
    () =>
      (context?.store.currentEngineerIndex || 1) <
      (context?.store.engineers.length || 1),
  );
  const navigateBetweenEngineers = (isForward: boolean): void => {
    if (isForward && canNavigateRight()) {
      context?.setStore("currentEngineerIndex", (index) => index + 1);
    } else if (!isForward && canNavigateLeft()) {
      context?.setStore("currentEngineerIndex", (index) => index - 1);
    }
  };

  const getSelectedMysteryIndexForEngineer = (id: string): number | null => {
    return context?.store.selectedEngineers[id] || null;
  };

  // selecting an engineer
  const selectEngineer = (id: string): void => {
    // delete currently selected one if it's there
    const currSelected = Object.entries(
      context?.store.selectedEngineers || {},
    ).find(
      ([, mysteryIndex]) =>
        mysteryIndex === context?.store.currentEngineerIndex,
    )?.[0];
    if (currSelected !== undefined) {
      context?.setStore("selectedEngineers", currSelected, null);
    }
    context?.setStore(
      "selectedEngineers",
      id,
      context?.store.currentEngineerIndex,
    );
    sessionStorage.setItem(
      STORAGE_KEY_SELECTED_ENGINEERS,
      JSON.stringify(context?.store.selectedEngineers),
    );
    setSearchText("");
    if (
      context?.store.currentEngineerIndex !== context?.store.engineers.length
    ) {
      context?.setStore("currentEngineerIndex", (index) => index + 1);
    }
  };

  const startExitAnimation = (): void => {
    setTimeout(() => {
      setUlStyle({
        opacity: "0.0",
        translate: "0 32px",
        "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
      });
      setTimeout(() => {
        setHeaderStyle({
          opacity: "0.0",
          translate: "0 32px",
          "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
        });
        setTimeout(() => navigate(urls.REVIEW), APPEAR_TRANSITION_DURATION);
      }, TRANSITION_INTERVAL);
    });
  };

  return (
    <>
      <div
        id="engineer-select-header"
        class={styles.stickyHeader}
        style={headerStyle()}
      >
        <header class={styles.engineerSelectHeader}>
          <p>who is...</p>
          <h1>
            Engineer
            <span class={styles.engineerNumberContainer}>
              <span class={styles.engineerNumber}>
                &nbsp;#{context?.store.currentEngineerIndex}
              </span>
            </span>
          </h1>
        </header>
        <div class={styles.engineerNavigationButtons}>
          <EngineerSelectionNavButtons
            onClick={(selectedIndex: number) =>
              context?.setStore("currentEngineerIndex", selectedIndex)
            }
          />
        </div>
        <SearchInput searchText={searchText()} setSearchText={setSearchText} />
      </div>
      <ul class={styles.engineerSelectList} style={ulStyle()}>
        <For each={filteredEngineers()}>
          {(engineer) => (
            <EngineerButton
              engineer={engineer}
              currentEngineerIndex={context?.store.currentEngineerIndex || 1}
              selectedMysteryIndex={getSelectedMysteryIndexForEngineer(
                engineer.id,
              )}
              selectEngineer={selectEngineer}
            />
          )}
        </For>
      </ul>
      <div class={styles.backToReviewBackdrop}>
        <button class={styles.backToReview} onClick={startExitAnimation}>
          OK, looks good! ✅
        </button>
      </div>
    </>
  );
}
