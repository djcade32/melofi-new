"use client";

import React from "react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <section className={styles.footer}>
      <h1 className="lp-section-title">Melofi</h1>
      <div className={styles.footer__footerLinks}>
        <a href="#home">Home</a>
        <span> | </span>
        <a href="#about">About</a>
        <span> | </span>
        <a href="#pricing">Pricing</a>
        <span> | </span>
        <a href="/legal/terms-and-conditions" target="_blank">
          Terms & Conditions
        </a>
        <span> | </span>
        <a href="/legal/privacy-policy" target="_blank">
          Privacy Policy
        </a>
      </div>
      <div className={styles.footer__copyright}>
        <p>Contact us: welcome@melofi.app</p>
        <p>© 2025 Melofi. All rights reserved.</p>
      </div>
    </section>
  );
};

export default Footer;
