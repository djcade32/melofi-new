import React, { useEffect, useState } from "react";
import styles from "./achievementsSection.module.css";
import AchievementsSectionCard from "./components/achievementsSectionCard/AchievementsSectionCard";
import { Achievement } from "@/types/general";
import useUserStatsStore from "@/stores/user-stats-store";
import { AchievementTypes } from "@/enums/general";

const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    title: "Focus Master 🧘‍♂️",
    description: "Reach 100 hours of total focus time.",
  },
  {
    title: "Note Taker Extraordinaire 📝",
    description: "Create 50 notes to capture your thoughts and ideas.",
  },
  {
    title: "Timekeeper ⏰",
    description: "Set and complete 15 alarms to stay on track.",
  },
  {
    title: "Pomodoro Pro 🍅",
    description: "Complete 50 Pomodoro tasks with dedication.",
  },
  {
    title: "Pomodoro Champion 🏆",
    description: "Successfully finish 100 Pomodoro sessions.",
  },
  // {
  //   title: "Deep Focus Streak 🔥",
  //   description: "Focus for 5 consecutive days without breaking your streak.",
  // },
  {
    title: "Marathon Focus 🏃‍♂️",
    description: "Complete 5+ hours of focus time in a single day.",
  },
  // {
  //   title: "Productivity Week 📅",
  //   description: "Accumulate 25+ hours of focus time in one week.",
  // },
  // {
  //   title: "Night Owl 🌙",
  //   description: "Complete 5 focus sessions between midnight and 5 AM.",
  // },
  // {
  //   title: "Early Bird 🌅",
  //   description: "Start a focus session before 7 AM for 5 days.",
  // },
  {
    title: "Scene Explorer 🎨",
    description: "Try 5 different scenes while using Melofi.",
  },
  // {
  //   title: "Habit Builder 🔄",
  //   description: "Use Melofi 10 days in a row to build a consistent routine.",
  // },
  {
    title: "Focus Legend ⭐",
    description: "Reach 500 hours of total focus time.",
  },
  {
    title: "Note Taker Master 📝",
    description: "Create 100 notes to capture your thoughts and ideas.",
  },
];

const AchievementsSection = () => {
  const { achievements } = useUserStatsStore();
  const [userAchievements, setUserAchievements] = useState<AchievementTypes[]>([]);
  useEffect(() => {
    setUserAchievements(achievements);
  }, [achievements]);
  return (
    <div className={styles.achievementsSection__container}>
      {ACHIEVEMENTS_LIST.map((achievement) => (
        <AchievementsSectionCard
          key={achievement.title}
          title={achievement.title}
          description={achievement.description}
          completed={userAchievements.includes(achievement.title as AchievementTypes)}
        />
      ))}
    </div>
  );
};

export default AchievementsSection;
