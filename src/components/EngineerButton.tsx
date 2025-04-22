import { Component, Show } from "solid-js";

import { Engineer } from "../Context";
import styles from "./EngineerButton.module.css";

const EngineerButton: Component<{
  engineer: Engineer;
  currentEngineerIndex: number;
  selectedMysteryIndex: number | null;
  selectEngineer: Function;
}> = (props) => {
  return (
    <li class={styles.item}>
      <button
        class={styles.button}
        classList={{
          "currently-selected":
            Boolean(props.selectedMysteryIndex) &&
            props.selectedMysteryIndex === props.currentEngineerIndex,
        }}
        onClick={() => props.selectEngineer(props.engineer.id)}
      >
        <img src={props.engineer.imageUrl} alt={props.engineer.name} />
        {props.engineer.name}
        <Show when={Boolean(props.selectedMysteryIndex)}>
          <div class={styles.selectedMysteryIndexToken}>
            {props.selectedMysteryIndex}
          </div>
        </Show>
      </button>
    </li>
  );
};
export default EngineerButton;
