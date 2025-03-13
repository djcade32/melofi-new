"use client";

import React from "react";
import styles from "./contact.module.css";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={styles.contact}
      id="contact"
    >
      <div className={styles.contact__txt}>
        <h1 className="lp-section-title">
          Stay in the Flow <br />
          with Mailofi
        </h1>
        <p className={`lp-section-subtitle ${styles.contact__subtitle}`}>
          Get exclusive productivity tips, Lofi playlists, new feature updates, and special
          perks—right in your inbox. Sign up and make every work session a vibe!
        </p>
      </div>
      <form className={styles.contact__form}>
        <input type="email" placeholder="name@example.com" />
        <div
          className={`lp-button ${styles.contact__form_button}`}
          style={{
            backgroundColor: "var(--color-effect-opacity)",
          }}
        >
          <p style={{ color: "white" }}>Subscribe</p>
        </div>
      </form>
    </motion.section>
  );
};

export default Contact;
