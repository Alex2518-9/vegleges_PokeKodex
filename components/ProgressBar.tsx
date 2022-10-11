import React from "react";
import styles from "../styles/Progressbar.module.css";

interface BarProps {
  completed: number;
  statName: string;
}
const ProgressBar = ({ completed, statName }: BarProps) => {
  return (
    <div className={styles.progContainer}>
      <span className={styles.statName}>{`${statName}:`}</span>
      <div className={styles.statData}>
        <div className={styles.fillContainer}>
          <div
            style={{
              width: `${completed}px`,
              background: "#e7d068",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            className={styles.filler}
          >
            <span className={styles.Completed}>{` ${completed}`}</span>
          </div>
        </div>
        <div>255</div>
      </div>
    </div>
  );
};

export default ProgressBar;
