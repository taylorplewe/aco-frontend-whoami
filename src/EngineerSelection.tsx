import { Show, For, createSignal, useContext, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Context } from "./Context.tsx";
import shuffle from "./shuffle.ts";
import EngineerSelectionNavButton from "./EngineerSelectionNavButton.tsx";
import "./EngineerSelection.css";

const APPEAR_TRANSITION_DURATION = 500;
const TRANSITION_INTERVAL = APPEAR_TRANSITION_DURATION * 0.5;

export default function () {
  const context = useContext(Context);
  const navigate = useNavigate();

  // appear animation
  const [headerStyle, setHeaderStyle] = createSignal<any>({});
  const [ulStyle, setUlStyle] = createSignal<any>({});
  onMount(() =>
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
    }),
  );

  const navigateBetweenEngineers = (isForward: boolean): void => {
    if (isForward) {
      context?.setStore("currentEngineerIndex", (index) => index + 1);
    } else {
      context?.setStore("currentEngineerIndex", (index) => index - 1);
    }
  };

  // handle bad image URLs
  const [engineerIdsWithBadImageUrls, setEngineerIdsWithBadImageUrls] =
    createSignal(new Set());
  const addToEngineerIdsWithBadImageUrls = (id: number): void => {
    const newSet = new Set(engineerIdsWithBadImageUrls());
    newSet.add(id);
    setEngineerIdsWithBadImageUrls(newSet);
  };

  const getSelectedMysteryIndexForEngineer = (id: number): number | null => {
    return context?.store.selectedEngineers[id] || null;
  };

  // selecting an engineer
  const selectEngineer = (id: number): void => {
    // delete currently selected one if it's there
    const currSelected = Object.entries(
      context?.store.selectedEngineers || {},
    ).find(
      ([, mysteryIndex]) =>
        mysteryIndex === context?.store.currentEngineerIndex,
    )?.[0];
    if (currSelected !== undefined) {
      context?.setStore("selectedEngineers", Number(currSelected), null);
    }
    context?.setStore(
      "selectedEngineers",
      id,
      context?.store.currentEngineerIndex,
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
        setTimeout(() => navigate("/review"), TRANSITION_INTERVAL);
      }, TRANSITION_INTERVAL);
    });
  };

  return (
    <>
      <Show when={(context?.store.currentEngineerIndex || 1) > 1}>
        <EngineerSelectionNavButton
          isForward={false}
          onClick={() => navigateBetweenEngineers(false)}
        />
      </Show>
      <Show
        when={
          (context?.store.currentEngineerIndex || 1) <
          (context?.store.engineers.length || 1)
        }
      >
        <EngineerSelectionNavButton
          isForward={true}
          onClick={() => navigateBetweenEngineers(true)}
        />
      </Show>
      <header id="engineer-select-header" style={headerStyle()}>
        <p>
          <em>who is...</em>
        </p>
        <h1>Engineer #{context?.store.currentEngineerIndex}</h1>
      </header>
      <ul id="engineer-select-list" style={ulStyle()}>
        <For each={Array.from(shuffle(context?.store.engineers || []))}>
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
      <Show when={context?.store.hasVisitedReviewPage}>
        <button id="back-to-review" onClick={startExitAnimation}>
          OK, looks good!
        </button>
      </Show>
    </>
  );
}
