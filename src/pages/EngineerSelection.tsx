import {
  Show,
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
  const [searchInput, setSearchInput] = createSignal<string>("");
  const shuffledEngineers = createMemo(() =>
    Array.from(shuffle(context?.store.engineers || [])),
  );
  const filteredEngineers = createMemo(() =>
    shuffledEngineers().filter((engineer) =>
      engineer.name.toLowerCase().includes(searchInput().toLowerCase()),
    ),
  );

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

  // handle bad image URLs
  const [engineerIdsWithBadImageUrls, setEngineerIdsWithBadImageUrls] =
    createSignal(new Set());
  const addToEngineerIdsWithBadImageUrls = (id: string): void => {
    const newSet = new Set(engineerIdsWithBadImageUrls());
    newSet.add(id);
    setEngineerIdsWithBadImageUrls(newSet);
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
    setSearchInput("");
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
        class={styles["sticky-header"]}
        style={headerStyle()}
      >
        <header class={styles["engineer-select-header"]}>
          <p>
            <em>who is...</em>
          </p>
          <h1>
            Engineer
            <span class={styles["engineer-number-container"]}>
              <span class={styles["engineer-number"]}>
                &nbsp;#{context?.store.currentEngineerIndex}
              </span>
            </span>
          </h1>
        </header>
        <div class={styles["engineer-navigation-buttons"]}>
          <EngineerSelectionNavButtons
            onClick={(selectedIndex: number) =>
              context?.setStore("currentEngineerIndex", selectedIndex)
            }
          />
        </div>
        <div class={styles["search-input-container"]}>
          <input
            class={styles["search-input"]}
            type="text"
            placeholder="Search..."
            value={searchInput()}
            onInput={(e) => setSearchInput(e.target.value)}
            onKeyDown={({ key }) => key === "Escape" && setSearchInput("")}
          />
          <Show when={searchInput().length > 0}>
            <button
              class={styles["clear-search-button"]}
              onClick={() => setSearchInput("")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none" />
                <line
                  x1="200"
                  y1="56"
                  x2="56"
                  y2="200"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                />
                <line
                  x1="200"
                  y1="200"
                  x2="56"
                  y2="56"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                />
              </svg>
            </button>
          </Show>
        </div>
      </div>
      <ul class={styles["engineer-select-list"]} style={ulStyle()}>
        <For each={filteredEngineers()}>
          {(engineer) => (
            <li>
              <button
                onClick={() => selectEngineer(engineer.id)}
                classList={{
                  "currently-selected":
                    Boolean(getSelectedMysteryIndexForEngineer(engineer.id)) &&
                    getSelectedMysteryIndexForEngineer(engineer.id) ===
                      context?.store.currentEngineerIndex,
                }}
              >
                <Show
                  when={!engineerIdsWithBadImageUrls().has(engineer.id)}
                  fallback={<div class="img-placeholder"></div>}
                >
                  <img
                    src={engineer.imageUrl}
                    alt={engineer.name}
                    onError={() =>
                      addToEngineerIdsWithBadImageUrls(engineer.id)
                    }
                  />
                </Show>
                {engineer.name}
                <Show
                  when={Boolean(
                    getSelectedMysteryIndexForEngineer(engineer.id),
                  )}
                >
                  <div class={styles["selected-mystery-index-token"]}>
                    {context?.store.selectedEngineers[engineer.id] || 0}
                  </div>
                </Show>
              </button>
            </li>
          )}
        </For>
      </ul>
      <div class={styles["back-to-review-backdrop"]}>
        <button class={styles["back-to-review"]} onClick={startExitAnimation}>
          OK, looks good! ✅
        </button>
      </div>
    </>
  );
}
