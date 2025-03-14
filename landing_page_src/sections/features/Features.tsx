"use client";

import React from "react";
import styles from "./features.module.css";
import { motion } from "framer-motion";

const features = [
  {
    icon: "🎵",
    title: "Lofi Music",
    description: "Immerse yourself in high-quality Lofi music for better focus.",
  },
  {
    icon: "⏳",
    title: "Focus Timer & Stats",
    description: "Track your focused sessions and monitor productivity trends.",
  },
  {
    icon: "🎨",
    title: "Personalized Themes",
    description:
      "Tailor your workspace with unique themes and immersive visuals to enhance your focus and relaxation.",
  },
  {
    icon: "📝",
    title: "Notes",
    description: "Quickly jot down thoughts, tasks, and reminders to stay organized.",
  },
  {
    icon: "📅",
    title: "Google Calendar",
    description: "Sync with your schedule and never miss important tasks.",
  },
  {
    icon: "🌟",
    title: "And Much More",
    description:
      "Melofi is constantly evolving with new tools to enhance your productivity and relaxation.",
  },
];

const Features = () => {
  return (
    <section className={`"lp-section" ${styles.features} section`} id="features">
      <h1 className="lp-section-title">Features</h1>
      <motion.div
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={styles.features__content}
      >
        {features.map((feature, index) => (
          <div key={index} className={styles.features_card}>
            <div className={styles.features__card_icon}>{feature.icon}</div>
            <h2 className={styles.features__card_title}>{feature.title}</h2>
            <p className={styles.features__card_description}>{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
