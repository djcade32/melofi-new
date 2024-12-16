import React, { useRef } from "react";
import styles from "./carousel.module.css";
import { RxCaretDown, RxCaretLeft, RxCaretRight, RxCaretUp } from "@/imports/icons";

interface CarouselProps {
  children: React.ReactNode[];

  itemsToShow?: number;
  orientation?: "horizontal" | "vertical";
  itemsContainer?: string;
  id?: string;
}

const Carousel = ({
  children,
  itemsToShow = 1,
  orientation = "horizontal",
  itemsContainer,
  id,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null); // Reference for carousel container
  const isHorizontal = orientation === "horizontal";

  // Scroll by clicking on arrows (optional)
  const scrollNext = () => {
    if (!carouselRef.current) return;

    const scrollAmount = isHorizontal
      ? carouselRef.current.offsetWidth / itemsToShow
      : carouselRef.current.offsetHeight / itemsToShow;

    if (isHorizontal) {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (!carouselRef.current) return;

    const scrollAmount = isHorizontal
      ? carouselRef.current.offsetWidth / itemsToShow
      : carouselRef.current.offsetHeight / itemsToShow;

    if (isHorizontal) {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ top: -scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`${styles.carousel__container} ${
        isHorizontal ? styles.horizontal : styles.vertical
      }`}
      id={id}
    >
      {/* Arrows */}
      <div
        className={`${styles.carousel__arrow} ${styles.prev_arrow}`}
        onClick={scrollPrev}
        style={{
          top: isHorizontal ? "50%" : "-15px",
          left: isHorizontal ? "0" : "50%",
        }}
      >
        {isHorizontal ? (
          <RxCaretLeft size={40} color="var(--color-white)" />
        ) : (
          <RxCaretUp size={40} color="var(--color-white)" />
        )}
      </div>

      <div
        className={`${itemsContainer} ${styles.carousel__wrapper}`}
        ref={carouselRef} // Attach reference to the carousel container
        style={{
          display: "grid",
          overflowX: isHorizontal ? "auto" : "hidden", // Enable horizontal scrolling
          overflowY: !isHorizontal ? "auto" : "hidden", // Enable vertical scrolling
          scrollSnapType: isHorizontal ? "x mandatory" : "y mandatory", // Optional snap effect
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            style={{
              scrollSnapAlign: "start", // Aligns each item to the start when scrolled
            }}
            id="carousel-item"
          >
            {child}
          </div>
        ))}
      </div>

      <div
        className={`${styles.carousel__arrow} ${styles.prev_arrow}`}
        onClick={scrollNext}
        style={{
          bottom: isHorizontal ? "50%" : "15px",
          left: isHorizontal ? "0" : "50%",
        }}
      >
        {isHorizontal ? (
          <RxCaretRight size={40} color="var(--color-white)" />
        ) : (
          <RxCaretDown size={40} color="var(--color-white)" />
        )}
      </div>
    </div>
  );
};

export default Carousel;
