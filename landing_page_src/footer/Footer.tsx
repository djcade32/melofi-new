"use client";

import React from "react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <section className={styles.footer}>
      <h1 className="lp-section-title">Melofi</h1>
      <div>
        <a
          href="https://www.producthunt.com/posts/melofi-2-0?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-melofi&#0045;2&#0045;0"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=946095&theme=neutral&t=1742941036955"
            alt="Melofi&#0032;2&#0046;0 - New&#0032;widgets&#0044;&#0032;and&#0032;features&#0032;–&#0032;designed&#0032;for&#0032;peak&#0032;productivity | Product Hunt"
            style={{ width: 250, height: 54 }}
            width="250"
            height="54"
          />
        </a>
      </div>
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
