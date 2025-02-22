"use client";

import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./mostProductiveDayChart.module.css";
import useInsightsStore from "@/stores/insights-store";

const MostProductiveDayChart = () => {
  const { getWeeklyFocusStats } = useInsightsStore();

  const labelFormatter = (value: number) => {
    if (value === 0) return "";
    return value > 1 ? `${value}h` : `${(value * 100).toFixed(0)}m`;
  };
  return (
    <div className={styles.mostProductiveDayChart__container}>
      <p className={styles.mostProductiveDayChart__label}>📅 Most Productive Day</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={getWeeklyFocusStats()} margin={{ top: 15, right: 0, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="day"
            stroke="var(--color-white)"
            tickLine={false}
            axisLine={false}
            style={{
              fontFamily: "var(--font-primary)",
            }}
          />
          <Bar
            unit={100}
            dataKey="focusTime"
            fill="var(--color-effect-opacity)"
            radius={[15, 15, 15, 15]}
            barSize={25}
            label={{
              fontFamily: "var(--font-primary)",
              position: "top",
              fontSize: "1.2rem",
              fill: "var(--color-secondary-white)",
              formatter: (value: number) => labelFormatter(value),
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostProductiveDayChart;
