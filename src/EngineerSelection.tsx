import { Component, For, useContext } from "solid-js";
import { Context } from "./Context.tsx";
import shuffle from "./shuffle.ts";

export const EngineerSelection: Component<{ engineerId: number }> = (props) => {
  const context = useContext(Context);

  return (
    <>
      <p>
        <em>who is...</em>
      </p>
      <h1>Engineer #{props.engineerId}</h1>
      <ul id="engineer-select-list">
        <For each={Array.from(shuffle(context?.store.users || []))}>
          {(engineer) => (
            <li>
              <button>
                <img src={engineer.imageUrl} />
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
