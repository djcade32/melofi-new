"use client";

import React, { useState } from "react";
import styles from "./contact.module.css";
import { motion } from "framer-motion";
import { subscribeToNewsletter } from "@/lib/brevo/actions";
import { isValidEmail } from "@/utils/general";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setError("Please enter a valid email");
    const isSuccess = await subscribeToNewsletter(email, "landing_page");
    if (isSuccess) {
      setEmail("");
      setError("");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } else {
      setError("Something went wrong. Please try again later");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={`${styles.contact} section`}
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
      <div>
        {showSuccess ? (
          <div>
            <h1 className="lp-section-title">Thank you for subscribing!</h1>
            <p className={`lp-section-subtitle ${styles.contact__subtitle}`}>
              You will receive an email shortly to confirm your subscription.
            </p>
          </div>
        ) : (
          <>
            {" "}
            <form className={styles.contact__form} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={handleChange}
                style={{
                  border: error ? "1px solid red" : "",
                }}
              />
              <div
                onClick={handleSubscribe}
                className={`lp-button ${styles.contact__form_button}`}
                style={{
                  backgroundColor: "var(--color-effect-opacity)",
                }}
              >
                <p style={{ color: "white" }}>Subscribe</p>
              </div>
            </form>
            <div style={{ height: 25 }}>
              {error && <p className={styles.contact__error}>{error}</p>}
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default Contact;
