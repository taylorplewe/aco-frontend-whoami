import {
  Show,
  For,
  createSignal,
  useContext,
  onMount,
  createMemo,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Context, STORAGE_KEY_SELECTED_ENGINEERS } from "../Context.tsx";
import shuffle from "../shuffle.ts";
import urls from "../urls.ts";
import "./EngineerSelection.css";
import EngineerSelectionNavButtons from "../components/EngineerSelectionNavButtons.tsx";

const APPEAR_TRANSITION_DURATION = 500;
const TRANSITION_INTERVAL = APPEAR_TRANSITION_DURATION * 0.5;

export default function () {
  const context = useContext(Context);
  const navigate = useNavigate();

  // appear animation
  const [headerStyle, setHeaderStyle] = createSignal<any>({});
  const [ulStyle, setUlStyle] = createSignal<any>({});
  onMount(() => {
    window.addEventListener("keydown", ({ key }) => {
      switch (key) {
        case "ArrowRight":
        case "ArrowLeft":
          navigateBetweenEngineers(key === "ArrowRight");
          break;
      }
    });
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
    if (
      context?.store.currentEngineerIndex === context?.store.engineers.length
    ) {
      startExitAnimation();
    } else {
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
      <div id="sticky-header" style={headerStyle()}>
        <header id="engineer-select-header">
          <p>
            <em>who is...</em>
          </p>
          <h1>
            Engineer
            <span id="engineer-number-container">
              <span id="engineer-number">
                &nbsp;#{context?.store.currentEngineerIndex}
              </span>
            </span>
          </h1>
        </header>
        <div class="engineer-navigation-buttons">
          <EngineerSelectionNavButtons
            onClick={(selectedIndex: number) =>
              context?.setStore("currentEngineerIndex", selectedIndex)
            }
          />
        </div>
        <input
          id="search-input"
          type="text"
          placeholder="Search..."
          value={searchInput()}
          onInput={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <ul id="engineer-select-list" style={ulStyle()}>
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
                  <div class="selected-mystery-index-token">
                    {context?.store.selectedEngineers[engineer.id] || 0}
                  </div>
                </Show>
              </button>
            </li>
          )}
        </For>
      </ul>
      <div id="back-to-review-backdrop">
        <button id="back-to-review" onClick={startExitAnimation}>
          OK, looks good! ✅
        </button>
      </div>
    </>
  );
}
