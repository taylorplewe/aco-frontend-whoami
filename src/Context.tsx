import {
  ParentComponent,
  onMount,
  createContext,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
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
  numCorrect: number | null;
};
type ContextStructure = {
  store: StoreStructure;
  setStore: SetStoreFunction<StoreStructure>;
};
export const Context = createContext<ContextStructure>();

const STORAGE_KEY = "ACO_FRONTENDS_GUESS_WHO";
export const STORAGE_KEY_ENGINEER_NAME = `${STORAGE_KEY}_ENGINEER_NAME`;
export const STORAGE_KEY_SELECTED_ENGINEERS = `${STORAGE_KEY}_SELECTED_ENGINEERS`;
export const STORAGE_KEY_NUM_CORRECT = `${STORAGE_KEY}_NUM_CORRECT`;

export const ContextProvider: ParentComponent = (props) => {
  const [store, setStore] = createStore<StoreStructure>({
    engineerName: "Default",
    engineers: [],
    currentEngineerIndex: 1,
    selectedEngineers: {},
    numCorrect: null,
  });

  onMount(() => {
    const setStoreValueIfPresent = (
      storageKey: string,
      storeSetter: Function,
    ): void => {
      const value = sessionStorage.getItem(storageKey);
      if (value) {
        storeSetter(value);
      }
    };
    setStoreValueIfPresent(STORAGE_KEY_ENGINEER_NAME, (v: string) =>
      setStore("engineerName", v),
    );
    setStoreValueIfPresent(STORAGE_KEY_SELECTED_ENGINEERS, (v: string) =>
      setStore("selectedEngineers", JSON.parse(v)),
    );
    setStoreValueIfPresent(STORAGE_KEY_NUM_CORRECT, (v: string) =>
      setStore("numCorrect", parseInt(v)),
    );
  });

  // auto scroll to selected engineer nav button
  createEffect(() => {
    const currentNavButtonEl = document.querySelector(
      `#nav-button-${store.currentEngineerIndex}`,
    );
    const selectedEngineer = document.querySelector(".currently-selected");

    const scrollTop = document.documentElement.scrollTop;
    currentNavButtonEl &&
      currentNavButtonEl.scrollIntoView({ behavior: "smooth" });
    document.documentElement.scrollTop = scrollTop;

    selectedEngineer &&
      selectedEngineer.scrollIntoView({ behavior: "smooth", block: "center" });
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
