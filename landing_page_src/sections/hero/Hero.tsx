"use client";

import Image from "next/image";
import React from "react";
import styles from "./hero.module.css";
import { motion } from "framer-motion";

const Hero = () => {
  const scrollToAbout = () => {
    const about = document.getElementById("about");
    about?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className={`${styles.hero}`} id="home">
      <div className={styles.hero__content}>
        <div className={styles.hero__content_txt}>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`lp-section-title`}
          >
            Stay Focused. Stay Inspired. Meet <span>Melofi</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`lp-section-subtitle ${styles.hero__subtitle}`}
          >
            A productivity and relaxation app with Lofi music, stunning visuals, and tools to boost
            your focus.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={styles.hero__buttons}
        >
          <div
            id="try-for-free"
            className={`lp-button ${styles.hero__button}`}
            onClick={() => window.open("/")}
            style={{
              backgroundColor: "var(--color-effect-opacity)",
            }}
          >
            <p style={{ color: "white" }}>Try for Free</p>
          </div>
          <div
            className={`lp-button ${styles.hero__button}`}
            onClick={scrollToAbout}
            style={{
              backgroundColor: "var(--color-secondary)",
            }}
          >
            <p style={{ color: "white" }}>Learn More</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            className={styles.hero__image}
            src="/assets/landing-page/hero.png"
            alt="hero"
            width={850}
            height={478.13}
            style={{
              borderRadius: 10,
              boxShadow: "var(--box-shadow-primary)",
              marginTop: 20,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
