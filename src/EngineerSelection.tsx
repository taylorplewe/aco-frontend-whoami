import { useContext } from "solid-js";
import { Context } from "./Context.tsx";

export default function () {
  const context = useContext(Context);

  return (
    <>
      <p>Name is {context?.store.userName}</p>
    </>
  );
}
