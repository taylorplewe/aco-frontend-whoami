import { createSignal, createEffect, useContext, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";

import "./App.css";
import { Context } from "./Context.tsx";

export default function () {
  const [userName, setUserName] = createSignal<string>("");
  const [isValidated, setIsValidated] = createSignal<boolean>(false);
  const navigate = useNavigate();
  const context = useContext(Context);

  createEffect(() => {
    context?.setStore("userName", userName());
  });

  const isInvalid = createMemo(
    () => isValidated() && !userName().trim().length,
  );

  const onNextClick = (): void => {
    setIsValidated(true);
    if (!isInvalid()) {
      startTransitionToNextPage();
    }
  };

  const TRANSITION_TO_NEXT_PAGE_LENGTH = 1_000;
  const [isTransitioningToNextPage, setIsTransitioningToNextPage] =
    createSignal<boolean>(false);
  const startTransitionToNextPage = (): void => {
    setIsTransitioningToNextPage(true);
    setTimeout(
      () => navigate("/engineer-select"),
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
