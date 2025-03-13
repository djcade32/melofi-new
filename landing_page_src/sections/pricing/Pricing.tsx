"use client";

import React, { useState } from "react";
import styles from "./pricing.module.css";
import Switch from "@/ui/components/shared/switch/Switch";
import { BsCheck2 } from "@/imports/icons";
import { motion } from "framer-motion";

const freeFeatures = [
  "Melofi Lofi Player",
  "To Do List",
  "Limited Scenes",
  "Limited Sounds",
  "Google Calendar",
  "Notes",
];

const premiumFeatures = [
  "Focus Stats",
  "Templates",
  "Spotify",
  "More Scenes",
  "Watch Youtube",
  "Pomodoro Timer",
  "Alarms",
  "More Sounds",
  "Priority Support",
  "Motivational Quotes",
  "More to come",
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);
  return (
    <section className={`lp-section ${styles.pricing}`} id="pricing">
      <h1 className="lp-section-title">Pricing</h1>
      <div className={styles.pricing__switch}>
        <p className={`${!isYearly ? styles.active : ""} ${styles.pricing__switch_txt}`}>MONTHLY</p>
        <Switch
          sx={{
            width: 51,
            height: 35,
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: 31,
              height: 31,
            },
          }}
          checked={isYearly}
          onChange={() => setIsYearly((prev) => !prev)}
        />
        <p className={`${isYearly ? styles.active : ""} ${styles.pricing__switch_txt}`}>YEARLY</p>
        <div className={styles.pricing__save}>
          <p>SAVE 33%</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={styles.pricing__plans}
      >
        {/* Free Plan */}
        <div className={styles.pricing__plans_plan_border_free}>
          <div className={styles.pricing__plans_plan}>
            <h1>Free</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <p className={styles.pricing__plan_price}>$0</p>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--color-secondary)",
                }}
              >
                No Credit Card Required
              </p>
            </div>
            <div
              className={`lp-button ${styles.pricing__plan_button}`}
              style={{
                backgroundColor: "var(--color-secondary)",
              }}
              onClick={() => window.open("/")}
            >
              <p style={{ color: "white" }}>Try for Free</p>
            </div>
            <div className={styles.pricing__plan_features}>
              {freeFeatures.map((feature, index) => (
                <div className={styles.pricing__plan_feature} key={index}>
                  <BsCheck2 size={30} />
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Plan */}
        <div className={styles.pricing__plans_plan_border_premium}>
          <div className={styles.pricing__plans_plan}>
            <h1>Premium</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <p className={styles.pricing__plan_price}>{isYearly ? "$4" : "$6"}</p>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--color-secondary)",
                }}
              >
                {isYearly ? "per month, billed annually" : "per month"}
              </p>
            </div>
            <div
              className={`lp-button ${styles.pricing__plan_button}`}
              style={{
                backgroundColor: "var(--color-effect-opacity)",
              }}
              onClick={() => window.open("/")}
            >
              <p style={{ color: "white" }}>Go Premium</p>
            </div>
            <div className={styles.pricing__plan_features}>
              {premiumFeatures.map((feature, index) => (
                <div className={styles.pricing__plan_feature} key={index}>
                  <BsCheck2 size={30} />
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Pricing;
