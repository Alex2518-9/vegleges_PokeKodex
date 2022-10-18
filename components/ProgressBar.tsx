import React from "react";
import styles from "../styles/Progressbar.module.css";
import { Line } from "rc-progress";

interface BarProps {
  completed: number;
  statName: string;
}
const ProgressBar = ({ completed, statName }: BarProps) => {
  return (
    <div className={styles.progContainer}>
      <div className={styles.statName}>{statName}</div>
      <div className={styles.statData}>
        <Line
          percent={(completed / 255) * 100}
          strokeColor="#3d1d8f"
          strokeWidth={5}
          trailWidth={5}
        />
        <span className={styles.Completed}>{` ${completed}`}</span>
      </div>
      <div>255</div>
    </div>
  );
};

export default ProgressBar;
