"use client";

import Image from "next/image";
import React from "react";
import styles from "./hero.module.css";

const Hero = () => {
  const scrollToAbout = () => {
    const about = document.getElementById("about");
    about?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className={`${styles.hero}`} id="home">
      <div className={styles.hero__content}>
        <div className={styles.hero__content_txt}>
          <h1 className={`lp-section-title`}>
            Stay Focused. Stay Inspired. Meet <span>Melofi</span>
          </h1>
          <p className={`lp-section-subtitle ${styles.hero__subtitle}`}>
            A productivity and relaxation app with Lofi music, stunning visuals, and tools to boost
            your focus.
          </p>
        </div>

        <div className={styles.hero__buttons}>
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
        </div>

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
      </div>
    </section>
  );
};

export default Hero;
