import { createContext } from "solid-js";
import { createStore } from "solid-js/store";
import { ParentComponent } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import "./App.css";

type Engineer = {
  id: number;
  name: string;
  avatarUrl: string;
};
type StoreStructure = {
  userName: string;
  users: Engineer[];
};
type ContextStructure = {
  store: StoreStructure;
  setStore: SetStoreFunction<StoreStructure>;
};
export const Context = createContext<ContextStructure>();

export const ContextProvider: ParentComponent = (props) => {
  const [store, setStore] = createStore<StoreStructure>({
    userName: "Default",
    users: [],
  });

  getEngineerListFromUsersJson().then((engineers) =>
    setStore("users", engineers),
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
