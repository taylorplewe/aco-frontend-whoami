import styles from "./LoadingSpinner.module.css";

export default function () {
  return (
    <svg class={styles["spinner"]} viewBox="0 0 80 80">
      <circle
        cx="40"
        cy="40"
        r="30"
        fill="none"
        stroke-width="8"
        stroke-dasharray="188.49, 188.49"
        stroke-dashoffset="56.55"
        transform="rotate(-90 40 40)"
      />
    </svg>
  );
}
