import { Component, For, useContext } from "solid-js";
import { Context } from "./Context.tsx";
import shuffle from "./shuffle.ts";

export const EngineerSelection: Component<{ engineerId: number }> = (props) => {
  const context = useContext(Context);

  return (
    <>
      <p>Engineer #{props.engineerId}</p>
      <ul id="engineer-select-list">
        <For each={Array.from(shuffle(context?.store.users || []))}>
          {(engineer) => (
            <li>
              <button>{engineer.name}</button>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};
export default EngineerSelection;
