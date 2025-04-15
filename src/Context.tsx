import { createContext } from "solid-js";
import { createStore } from "solid-js/store";

import "./App.css";

export const Context = createContext();

export function ContextProvider(props: any) {
  const [store, setStore] = createStore({ userName: "Default" });

  return (
    <Context.Provider value={{ store, setStore }}>
      {props.children}
    </Context.Provider>
  );
}
