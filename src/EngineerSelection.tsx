import {
  Component,
  Show,
  createSignal,
  For,
  useContext,
  onMount,
} from "solid-js";

import { Context } from "./Context.tsx";
import shuffle from "./shuffle.ts";
import EngineerSelectionNavButton from "./EngineerSelectionNavButton.tsx";
import "./EngineerSelection.css";

const APPEAR_TRANSITION_DURATION = 500;
const TRANSITION_INTERVAL = APPEAR_TRANSITION_DURATION * 0.5;

const EngineerSelection: Component<{ engineerId: number }> = (props) => {
  const context = useContext(Context);

  const [engineerIdsWithBadImageUrls, setEngineerIdsWithBadImageUrls] =
    createSignal(new Set());
  const addToEngineerIdsWithBadImageUrls = (id: number): void => {
    const newSet = new Set(engineerIdsWithBadImageUrls());
    newSet.add(id);
    setEngineerIdsWithBadImageUrls(newSet);
  };

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

  return (
    <>
      <EngineerSelectionNavButton isForward={false} />
      <EngineerSelectionNavButton isForward={true} />
      <header id="engineer-select-header" style={headerStyle()}>
        <p>
          <em>who is...</em>
        </p>
        <h1>Engineer #{props.engineerId}</h1>
      </header>
      <ul id="engineer-select-list" style={ulStyle()}>
        <For each={Array.from(shuffle(context?.store.engineers || []))}>
          {(engineer, index) => (
            <li>
              <button>
                <Show
                  when={!engineerIdsWithBadImageUrls().has(index())}
                  fallback={<div class="img-placeholder"></div>}
                >
                  <img
                    src={engineer.imageUrl}
                    onError={() => addToEngineerIdsWithBadImageUrls(index())}
                  />
                </Show>
                {engineer.name}
              </button>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};
export default EngineerSelection;
