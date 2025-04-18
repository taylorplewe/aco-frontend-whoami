import { onMount, createSignal, For } from "solid-js";
import styles from "./Results.module.css";

export default function () {
  const [_, setIsFetchingResults] = createSignal<boolean>(false);
  const [results, setResults] = createSignal<Record<string, number>>({});

  const fetchResults = async (): Promise<void> => {
    setIsFetchingResults(true);
    try {
      const res = await fetch(
        "https://aco-frontends-guess-who.com/u/results.json",
      );
      const json = await res.json();
      setResults(json);
    } finally {
      setIsFetchingResults(false);
    }
  };

  onMount(fetchResults);

  return (
    <>
      <h1>Results</h1>
      <ul class={styles["results-list"]}>
        <For each={Object.entries(results())}>
          {([name, score]) => (
            <li>
              <p>{name}</p>
              <p>{score}</p>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
