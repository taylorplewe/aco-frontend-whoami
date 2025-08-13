import { onMount, onCleanup, createSignal, useContext, For } from "solid-js";

import { Context } from "../Context.tsx";
import styles from "./Results.module.css";

const BAR_ANIM_DURATION = 1500;

export default function () {
  const context = useContext(Context);
  const [_, setIsFetchingResults] = createSignal<boolean>(false);
  const [results, setResults] = createSignal<Record<string, number>>({});
  const [resultsArr, setResultsArr] = createSignal<[string, number][]>([]);
  const [animHeight, setAnimHeight] = createSignal<number>(0);
  const [areNumbersVisible, setAreNumbersVisible] =
    createSignal<boolean>(false);

  const fetchResults = async (): Promise<void> => {
    setIsFetchingResults(true);
    try {
      const res = await fetch(
        "https://tplewe.com/aco-frontend-whoami/results.json",
      );
      const json = await res.json();
      setResults(json);
      setResultsArr(
        Object.entries(json).sort(([name], [name2]) =>
          name.localeCompare(name2),
        ) as [string, number][],
      );
    } finally {
      setIsFetchingResults(false);
    }
  };

  const windowKeyDownListener: EventListenerOrEventListenerObject = (
    e: Event,
  ) => {
    switch ((e as KeyboardEvent).key) {
      case " ":
        setAnimHeight(100);
        setTimeout(() => setAreNumbersVisible(true), BAR_ANIM_DURATION);
        break;
      case "w":
        setResultsArr(
          structuredClone(resultsArr()).sort(
            ([, score], [, score2]) => score2 - score,
          ),
        );
        break;
    }
  };
  onMount(() => {
    fetchResults();
    window.addEventListener("keydown", windowKeyDownListener);
  });
  onCleanup(() => window.removeEventListener("keydown", windowKeyDownListener));

  return (
    <>
      <main class={styles.main}>
        <h1 class={styles.header}>Results</h1>
        <ul
          class={styles.resultsBars}
          style={{
            "grid-template-columns": `repeat(${Object.keys(results()).length}, 1fr)`,
          }}
        >
          <For each={resultsArr()}>
            {([_, score]) => (
              <li class={styles.resultBarContainer}>
                <div
                  class={styles.resultBarAnim}
                  style={{ height: `${animHeight()}%` }}
                >
                  <div
                    class={styles.resultBar}
                    style={{
                      height: `${(score / (context?.store.engineers.length || 1)) * 100}%`,
                    }}
                  >
                    <p
                      style={{ opacity: areNumbersVisible() ? "1" : "0" }}
                      class={styles.resultBarNumber}
                    >
                      {score}
                    </p>
                  </div>
                </div>
              </li>
            )}
          </For>
        </ul>
        <ul
          class={styles.userNamesList}
          style={{
            "grid-template-columns": `repeat(${Object.keys(results()).length}, 1fr)`,
          }}
        >
          <For each={resultsArr()}>
            {([name, _]) => (
              <li>
                <div class={styles.userNameSlot}>
                  <p class={styles.userName}>{name}</p>
                </div>
              </li>
            )}
          </For>
        </ul>
      </main>
    </>
  );
}
