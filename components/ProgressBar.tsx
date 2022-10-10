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
      <div className={styles.fillContainer}>
        <div
          style={{
            width: `${completed}px`,
            background: "#e7d068",
            paddingLeft: "10px",
            borderRadius: '5px'
          }}
          className={styles.filler}
        >
          <span>{` ${completed}`}</span>
        </div>
      </div>
      <span>255</span>
    </div>
  );
};

export default ProgressBar;
