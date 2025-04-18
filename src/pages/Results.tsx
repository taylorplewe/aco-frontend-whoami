import { onMount, createSignal, useContext, For } from "solid-js";
import styles from "./Results.module.css";

import { Context } from "../Context";

export default function () {
  const context = useContext(Context);
  const [_, setIsFetchingResults] = createSignal<boolean>(false);
  const [results, setResults] = createSignal<Record<string, number>>({});
  const [resultsArr, setResultsArr] = createSignal<[string, number][]>([]);

  const fetchResults = async (): Promise<void> => {
    setIsFetchingResults(true);
    try {
      const res = await fetch(
        "https://aco-frontends-guess-who.com/u/results.json",
      );
      const json = await res.json();
      setResults(json);
      setResultsArr(Object.entries(json) as [string, number][]);
    } finally {
      setIsFetchingResults(false);
    }
  };

  onMount(fetchResults);

  return (
    <>
      <main class={styles["main"]}>
        <h1 class={styles["header"]}>Results</h1>
        <ul
          class={styles["results-bars"]}
          style={{
            "grid-template-columns": `repeat(${Object.keys(results()).length}, 1fr)`,
          }}
        >
          <For each={resultsArr()}>
            {([_, score]) => (
              <li class={styles["result-bar-container"]}>
                <div
                  class={styles["result-bar"]}
                  style={{
                    height: `${(score / (context?.store.engineers.length || 1)) * 100}%`,
                  }}
                >
                  <p class={styles["result-bar-number"]}>{score}</p>
                </div>
              </li>
            )}
          </For>
        </ul>
        <ul
          class={styles["user-names-list"]}
          style={{
            "grid-template-columns": `repeat(${Object.keys(results()).length}, 1fr)`,
          }}
        >
          <For each={resultsArr()}>
            {([name, _]) => (
              <li>
                <div class={styles["user-name-slot"]}>
                  <p class={styles["user-name"]}>{name}</p>
                </div>
              </li>
            )}
          </For>
        </ul>
      </main>
    </>
  );
}
