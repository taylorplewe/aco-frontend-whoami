import { createContext, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { ParentComponent } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import "./App.css";

export type Engineer = {
  id: string;
  name: string;
  imageUrl: string;
};
type StoreStructure = {
  engineerName: string;
  engineers: Engineer[];
  currentEngineerIndex: number;
  selectedEngineers: Record<string, number | null>;
  hasVisitedReviewPage: boolean;
  numCorrect: number;
};
type ContextStructure = {
  store: StoreStructure;
  setStore: SetStoreFunction<StoreStructure>;
};
export const Context = createContext<ContextStructure>();

export const ContextProvider: ParentComponent = (props) => {
  const [store, setStore] = createStore<StoreStructure>({
    engineerName: "Default",
    engineers: [],
    currentEngineerIndex: 1,
    selectedEngineers: {},
    hasVisitedReviewPage: false,
    numCorrect: 0,
  });

  createEffect(() => {
    const currentNavButtonEl = document.querySelector(
      `#nav-button-${store.currentEngineerIndex}`,
    );
    currentNavButtonEl &&
      currentNavButtonEl.scrollIntoView({ behavior: "smooth" });
  });

  getEngineerListFromUsersJson().then((engineers) =>
    setStore("engineers", engineers),
  );

  return (
    <Context.Provider value={{ store, setStore }}>
      {props.children}
    </Context.Provider>
  );
};

const getEngineerListFromUsersJson = async (): Promise<Engineer[]> => {
  const res = await fetch("../users.json");
  const users = await res.json();
  return users as Engineer[];
};
