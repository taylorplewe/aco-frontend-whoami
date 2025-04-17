import { createSignal, useContext, onMount, Index } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Context, Engineer } from "../Context.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import urls from "../urls.ts";
import "./Review.css";

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
    context?.setStore("hasVisitedReviewPage", true);
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
    });
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
      const res = await fetch("https://tplewe.com/aco-frontend-whoami/submit", {
        method: "POST",
        body: requestData,
      });
      const json = await res.json();
      context?.setStore("numCorrect", json["num-correct"]);
      startExitAnimation();
    } finally {
      setIsSubmitting(false);
    }
  };

  // exit animation
  const startExitAnimation = (): void => {
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
          setTimeout(
            () => navigate(urls.USER_RESULTS),
            APPEAR_TRANSITION_DURATION,
          );
        }, EXIT_INTERVAL);
      }, EXIT_INTERVAL);
    }, EXIT_INTERVAL);
  };

  return (
    <>
      <header style={headerStyle()}>
        <h1>Review</h1>
      </header>
      <div class="your-name" style={yourNameStyle()}>
        <p class="label">Your name</p>
        <p class="name">{context?.store.engineerName}</p>
      </div>
      <div class="selected-engineers" style={selectedEngineersStyle()}>
        <Index each={Array(context?.store.engineers.length || 0)}>
          {(_, index) => (
            <>
              <p>Engineer #{index + 1}:</p>
              <p class="selected-engineer">
                {getEngineerByMysteryIndex(index + 1)?.name}
              </p>
            </>
          )}
        </Index>
      </div>
      <footer style={footerStyle()}>
        <button
          onClick={() => navigate(urls.ENGINEER_SELECT)}
          disabled={isSubmitting()}
        >
          👈 Change my answers
        </button>
        <button
          id="submit-button"
          classList={{ "is-submitting": isSubmitting() }}
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
