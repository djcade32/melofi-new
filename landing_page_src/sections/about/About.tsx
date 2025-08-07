"use client";

import React from "react";
import styles from "./about.module.css";
import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className={`lp-section ${styles.about} section`} id="about">
      <motion.div
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={styles.about__content_txt}
      >
        <h1 className={"lp-section-title"}>What is Melofi?</h1>
        <p>
          Melofi is a carefully crafted productivity app designed to enhance focus and relaxation
          through a combination of ambient Lofi music, stunning visuals, and essential productivity
          tools. Whether you're working, studying, or unwinding, Melofi creates the perfect
          environment to keep you motivated and stress-free.
        </p>
      </motion.div>
      <div>
        <img
          className={styles.about__image}
          src="/assets/landing-page/about.png"
          alt="about"
          width={700}
          height={393.75}
        />
      </div>
    </section>
  );
};

export default About;
