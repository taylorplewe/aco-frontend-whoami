import {
  createSignal,
  createEffect,
  useContext,
  createMemo,
  onMount,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Context, STORAGE_KEY_ENGINEER_NAME } from "../Context.tsx";
import urls from "../urls.ts";

export default function () {
  const [userName, setUserName] = createSignal<string>("");
  const [isValidated, setIsValidated] = createSignal<boolean>(false);
  const navigate = useNavigate();
  const context = useContext(Context);

  createEffect(() => {
    context?.setStore("engineerName", userName());
  });

  onMount(() => {
    const urlParams = new URL(window.location.href).searchParams;
    if (urlParams.get("results")) {
      navigate(urls.RESULTS);
    }
    const previouslyEnteredEngineerName = sessionStorage.getItem(
      STORAGE_KEY_ENGINEER_NAME,
    );
    if (previouslyEnteredEngineerName) {
      context?.setStore(
        "engineerName",
        previouslyEnteredEngineerName as string,
      );
      startTransitionToNextPage();
    }
  });

  const isInvalid = createMemo(
    () => isValidated() && !userName().trim().length,
  );

  const onNextClick = (): void => {
    setIsValidated(true);
    if (!isInvalid()) {
      sessionStorage.setItem(STORAGE_KEY_ENGINEER_NAME, userName());
      startTransitionToNextPage();
    }
  };

  // exit animation
  const TRANSITION_TO_NEXT_PAGE_LENGTH = 300;
  const [isTransitioningToNextPage, setIsTransitioningToNextPage] =
    createSignal<boolean>(false);
  const startTransitionToNextPage = (): void => {
    setIsTransitioningToNextPage(true);
    setTimeout(
      () => navigate(urls.ENGINEER_SELECT),
      TRANSITION_TO_NEXT_PAGE_LENGTH,
    );
  };

  return (
    <>
      <form
        id="intro-form"
        classList={{
          "transitioning-to-next-page": isTransitioningToNextPage(),
        }}
        style={{ "transition-duration": `${TRANSITION_TO_NEXT_PAGE_LENGTH}ms` }}
        onSubmit={(e) => {
          e.preventDefault();
          onNextClick();
        }}
      >
        <label for="user-name-input">What is your name?</label>
        <input
          id="user-name-input"
          classList={{ invalid: isInvalid() }}
          value={userName()}
          onInput={(e) => setUserName(e.target.value)}
        />
        <p class="invalid-msg" classList={{ visible: isInvalid() }}>
          Name is required!
        </p>
        <button type="button" onClick={onNextClick}>
          Let's go! 👉
        </button>
      </form>
    </>
  );
}
