import React from "react";
import styles from "./achievementsSection.module.css";
import AchievementsSectionCard from "./components/achievementsSectionCard/AchievementsSectionCard";
import { Achievement } from "@/types/general";

const achievements: Achievement[] = [
  {
    id: 1,
    title: "Focus Master 🧘‍♂️",
    description: "Reach 100 hours of total focus time.",
    completed: false,
  },
  {
    id: 2,
    title: "Note Taker Extraordinaire 📝",
    description: "Create 50 notes to capture your thoughts and ideas.",
    completed: false,
  },
  {
    id: 3,
    title: "Timekeeper ⏰",
    description: "Set and complete 15 alarms to stay on track.",
    completed: false,
  },
  {
    id: 4,
    title: "Pomodoro Pro 🍅",
    description: "Complete 50 Pomodoro tasks with dedication.",
    completed: false,
  },
  {
    id: 5,
    title: "Pomodoro Champion 🏆",
    description: "Successfully finish 100 Pomodoro sessions.",
    completed: false,
  },
  {
    id: 6,
    title: "Deep Focus Streak 🔥",
    description: "Focus for 5 consecutive days without breaking your streak.",
    completed: false,
  },
  {
    id: 7,
    title: "Marathon Focus 🏃‍♂️",
    description: "Complete 5+ hours of focus time in a single day.",
    completed: false,
  },
  {
    id: 8,
    title: "Productivity Week 📅",
    description: "Accumulate 25+ hours of focus time in one week.",
    completed: false,
  },
  {
    id: 9,
    title: "Night Owl 🌙",
    description: "Complete 5 focus sessions between midnight and 5 AM.",
    completed: false,
  },
  {
    id: 10,
    title: "Early Bird 🌅",
    description: "Start a focus session before 7 AM for 5 days.",
    completed: false,
  },
  {
    id: 11,
    title: "Scene Explorer 🎨",
    description: "Try 5 different scenes while using Melofi.",
    completed: false,
  },
  {
    id: 12,
    title: "Habit Builder 🔄",
    description: "Use Melofi 10 days in a row to build a consistent routine.",
    completed: false,
  },
  {
    id: 13,
    title: "Focus Legend ⭐",
    description: "Reach 500 hours of total focus time.",
    completed: false,
  },
  {
    id: 14,
    title: "Note Taker Master 📝",
    description: "Create 100 notes to capture your thoughts and ideas.",
    completed: false,
  },
];

const AchievementsSection = () => {
  return (
    <div className={styles.achievementsSection__container}>
      {achievements.map((achievement) => (
        <AchievementsSectionCard
          key={achievement.id}
          title={achievement.title}
          description={achievement.description}
          completed={achievement.completed}
        />
      ))}
    </div>
  );
};

export default AchievementsSection;
