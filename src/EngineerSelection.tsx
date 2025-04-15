import { For, useContext } from "solid-js";
import { Context } from "./Context.tsx";

export default function () {
  const context = useContext(Context);

  return (
    <>
      <p>Name is {context?.store.userName}</p>
      <For each={context?.store.users}>
        {(engineer) => <p>{engineer.name}</p>}
      </For>
    </>
  );
}
