import { createContext } from "solid-js";
import { createStore } from "solid-js/store";
import type { SetStoreFunction } from "solid-js/store";

import "./App.css";

type StoreStructure = {
  userName: string;
};
type ContextStructure = {
  store: StoreStructure;
  setStore: SetStoreFunction<StoreStructure>;
};
export const Context = createContext<ContextStructure>();

export function ContextProvider(props: any) {
  const [store, setStore] = createStore<StoreStructure>({
    userName: "Default",
  });

  return (
    <Context.Provider value={{ store, setStore }}>
      {props.children}
    </Context.Provider>
  );
}
