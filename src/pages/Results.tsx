import { onMount, createSignal } from "solid-js";

export default function () {
  const [_, setIsFetchingResults] = createSignal<boolean>(false);

  const fetchResults = async (): Promise<void> => {
    setIsFetchingResults(true);
    try {
      const res = await fetch(
        "https://tplewe.com/aco-frontend-whoami/results.json",
      );
      const json = await res.json();
      console.log("resultssss", json);
    } finally {
      setIsFetchingResults(false);
    }
  };

  onMount(fetchResults);

  return (
    <>
      <h1>Results</h1>
    </>
  );
}
