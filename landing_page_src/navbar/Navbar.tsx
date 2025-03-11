"use client";

import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import { IoMenuOutline, IoCloseOutline } from "@/imports/icons";

const links = ["Home", "About", "Features", "Pricing", "Contact"];

const Navbar = () => {
  const [selectedLink, setSelectedLink] = useState<string | null>("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const doc = document.getElementById("home-layout");
    if (!doc) return;
    const handleScroll = () => {
      const navbar = document.querySelector(`.${styles.navbar}`);
      // Add class to navbar when user scrolls down
      navbar?.classList.remove(styles.navbar__scrolled_end);
      navbar?.classList.add(styles.navbar__scrolled);
      // console.log(navbar);
      // const scrollY = window.scrollY;
      // const sections = document.querySelectorAll(".lp-section");
      // const links = document.querySelectorAll(`.${styles.navbar__link}`);
      // sections.forEach((section, index) => {
      //   const sectionTop = section.getBoundingClientRect().top;
      //   const sectionBottom = section.getBoundingClientRect().bottom;
      //   if (scrollY >= sectionTop && scrollY < sectionBottom) {
      //     setSelectedLink(links[index].textContent);
      //   }
      // });
    };
    const handleOnScrollEnd = () => {
      const navbar = document.querySelector(`.${styles.navbar}`);
      navbar?.classList.remove(styles.navbar__scrolled);
      navbar?.classList.add(styles.navbar__scrolled_end);
    };

    doc.addEventListener("scrollend", handleOnScrollEnd);
    doc.addEventListener("scroll", handleScroll);
    return () => {
      doc.removeEventListener("scroll", handleScroll);
      doc.removeEventListener("scrollend", handleOnScrollEnd);
    };
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${styles.navbar}`}>
      <h1 className={styles.navbar__melofi_txt}>Melofi</h1>
      <ul className={`${styles.navbar__links} ${styles.navbar__links_desktop}`}>
        {links.map((name) => (
          <li className={styles.navbar__link} key={name} onClick={() => setSelectedLink(name)}>
            <a
              href={`#${name.toLowerCase()}`}
              style={{
                color: selectedLink === name ? "var(--color-effect-opacity)" : "",
              }}
            >
              {name}
            </a>
            <div
              className={`${styles.navbar__link_indicator} `}
              style={{
                backgroundColor: selectedLink === name ? "var(--color-effect-opacity)" : "",
                width: selectedLink === name ? 30 : "",
              }}
            />
          </li>
        ))}
      </ul>
      <div className={`lp-button ${styles.navbar__btn_desktop}`} onClick={() => window.open("/")}>
        <p style={{ color: "white" }}>Open Melofi</p>
      </div>
      <IoMenuOutline
        color={"white"}
        size={40}
        className={`${styles.navbar__menu_btn} ${isMenuOpen && styles.open}`}
        onClick={handleMenuClick}
      />
      <div
        className={`${styles.navbar__backdrop} ${isMenuOpen && styles.open}`}
        onClick={handleMenuClick}
      />
      <div className={`${styles.navbar__side_menu} ${isMenuOpen && styles.open}`}>
        <div className={`${styles.navbar__close_btn}  ${isMenuOpen && styles.open}`}>
          <IoCloseOutline color={"var(--color-primary)"} size={40} onClick={handleMenuClick} />
          <ul className={`${styles.navbar__links}  ${isMenuOpen && styles.open}`}>
            {links.map((name) => (
              <li className={styles.navbar__link} key={name} onClick={() => setSelectedLink(name)}>
                <a
                  onClick={handleMenuClick}
                  href={`#${name.toLowerCase()}`}
                  style={{
                    color: selectedLink === name ? "var(--color-effect-opacity)" : "",
                  }}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
