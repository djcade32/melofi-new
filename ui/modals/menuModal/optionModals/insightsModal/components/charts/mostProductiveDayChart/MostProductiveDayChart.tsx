"use client";

import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./mostProductiveDayChart.module.css";
import useInsightsStore from "@/stores/insights-store";
import useUserStore from "@/stores/user-store";

const dummyWeeklyFocusStats = [
  { day: "Sun", focusTime: 8 },
  { day: "Mon", focusTime: 13 },
  { day: "Tue", focusTime: 5 },
  { day: "Wed", focusTime: 16 },
  { day: "Thu", focusTime: 5 },
  { day: "Fri", focusTime: 11 },
  { day: "Sat", focusTime: 4 },
];

const MostProductiveDayChart = () => {
  const { getWeeklyFocusStats } = useInsightsStore();
  const { isPremiumUser } = useUserStore();

  const labelFormatter = (value: number) => {
    if (value === 0) return "";
    return value > 1 ? `${value}h` : `${(value * 100).toFixed(0)}m`;
  };
  return (
    <div className={styles.mostProductiveDayChart__container}>
      <p className={styles.mostProductiveDayChart__label}>📅 Most Productive Day of the Week</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={isPremiumUser ? getWeeklyFocusStats() : dummyWeeklyFocusStats}
          margin={{ top: 25, right: 0, left: 0, bottom: 20 }}
        >
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
