import { Show, Component } from "solid-js";

import styles from "./SearchInput.module.css";

const SearchInput: Component<{
  searchText: string;
  setSearchText: Function;
}> = (props) => {
  const clearSearchText = (): string => props.setSearchText("");

  return (
    <div class={styles.container}>
      <input
        class={styles.input}
        type="text"
        placeholder="Search..."
        value={props.searchText}
        onInput={(e) => props.setSearchText(e.target.value)}
        onKeyDown={({ key }) => key === "Escape" && clearSearchText()}
      />
      <Show when={props.searchText.length > 0}>
        <button
          class={styles.clearSearchButton}
          onClick={() => clearSearchText()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none" />
            <line
              x1="200"
              y1="56"
              x2="56"
              y2="200"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            />
            <line
              x1="200"
              y1="200"
              x2="56"
              y2="56"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            />
          </svg>
        </button>
      </Show>
    </div>
  );
};
export default SearchInput;
