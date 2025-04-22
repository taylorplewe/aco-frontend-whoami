import { createSignal, useContext, onMount, Index } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Context, Engineer, STORAGE_KEY_NUM_CORRECT } from "../Context.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import urls from "../urls.ts";
import styles from "./Review.module.css";

const APPEAR_TRANSITION_DURATION = 500;
const TRANSITION_INTERVAL = APPEAR_TRANSITION_DURATION * 0.6;
const EXIT_INTERVAL = 80;

export default function () {
  const context = useContext(Context);
  const navigate = useNavigate();

  // appear animation
  const [headerStyle, setHeaderStyle] = createSignal<any>({});
  const [yourNameStyle, setYourNameStyle] = createSignal<any>({});
  const [selectedEngineersStyle, setSelectedEngineersStyle] = createSignal<any>(
    {},
  );
  const [footerStyle, setFooterStyle] = createSignal<any>({});
  onMount(() => {
    setTimeout(() => {
      setHeaderStyle({
        opacity: "1.0",
        translate: "0 0",
        "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
      });
      setTimeout(() => {
        setYourNameStyle({
          opacity: "1.0",
          translate: "0 0",
          "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
        });
        setTimeout(() => {
          setSelectedEngineersStyle({
            opacity: "1.0",
            translate: "0 0",
            "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
          });
          setTimeout(() => {
            setFooterStyle({
              opacity: "1.0",
              translate: "0 0",
              "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
            });
          }, TRANSITION_INTERVAL);
        }, TRANSITION_INTERVAL);
      }, TRANSITION_INTERVAL);
    }, 90);
  });

  const getEngineerByMysteryIndex = (
    mysteryIndex: number,
  ): Engineer | undefined => {
    const engineerId =
      Object.entries(context?.store.selectedEngineers || {}).find(
        ([, _mysteryIndex]) => _mysteryIndex === mysteryIndex,
      )?.[0] || 0;
    return context?.store.engineers.find(
      (engineer) => engineer.id == engineerId,
    );
  };

  // submitting
  const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
  const submit = async (): Promise<void> => {
    const requestData = JSON.stringify({
      name: context?.store.engineerName,
      selectedEngineers: context?.store.selectedEngineers,
    });
    try {
      setIsSubmitting(true);
      const res = await fetch(urls.SUBMIT, {
        method: "POST",
        body: requestData,
      });
      const json = await res.json();
      context?.setStore("numCorrect", json["num-correct"]);
      sessionStorage.setItem(STORAGE_KEY_NUM_CORRECT, json["num-correct"]);
      startExitAnimation(urls.USER_RESULTS);
    } finally {
      setIsSubmitting(false);
    }
  };

  // exit animation
  const startExitAnimation = (toUrl: string): void => {
    setFooterStyle({
      opacity: "0.0",
      translate: "0 32px",
      "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
    });
    setTimeout(() => {
      setSelectedEngineersStyle({
        opacity: "0.0",
        translate: "0 32px",
        "transition-duration": `${APPEAR_TRANSITION_DURATION}ms`,
      });
      setTimeout(() => {
        setYourNameStyle({
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
          setTimeout(() => navigate(toUrl), APPEAR_TRANSITION_DURATION);
        }, EXIT_INTERVAL);
      }, EXIT_INTERVAL);
    }, EXIT_INTERVAL);
  };

  return (
    <>
      <header class={styles.reviewHeader} style={headerStyle()}>
        <h1>Review</h1>
      </header>
      <div class={styles.yourName} style={yourNameStyle()}>
        <p class={`${styles.label} ${styles.p}`}>Your name</p>
        <p class={`${styles.name} ${styles.p}`}>
          {context?.store.engineerName}
        </p>
      </div>
      <div class={styles.selectedEngineers} style={selectedEngineersStyle()}>
        <Index each={Array(context?.store.engineers.length || 0)}>
          {(_, index) => (
            <>
              <p class={styles.p}>Engineer #{index + 1}:</p>
              <p class={`${styles.selectedEngineer} ${styles.p}`}>
                {getEngineerByMysteryIndex(index + 1)?.name}
              </p>
            </>
          )}
        </Index>
      </div>
      <footer class={styles.footer} style={footerStyle()}>
        <button
          onClick={() => startExitAnimation(urls.ENGINEER_SELECT)}
          disabled={isSubmitting()}
        >
          👈 Change my answers
        </button>
        <button
          class={styles.submitButton}
          classList={{ [styles.isSubmitting]: isSubmitting() }}
          onClick={submit}
          disabled={isSubmitting()}
        >
          <span>Submit ✅</span>
          <LoadingSpinner />
        </button>
      </footer>
    </>
  );
}
