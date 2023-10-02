"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const heroImages = [
  { url: "/assets/images/hero-1.svg", alt: "hero1" },
  { url: "/assets/images/hero-2.svg", alt: "hero2" },
  { url: "/assets/images/hero-3.svg", alt: "hero3" },
  { url: "/assets/images/hero-4.svg", alt: "hero4" },
  { url: "/assets/images/hero-5.svg", alt: "hero5" },
];

export const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image, index) => (
          <Image
            src={image.url}
            alt={image.alt}
            width={484}
            height={484}
            className="object-contain"
            key={index}
          />
        ))}
      </Carousel>
      <Image
        src="assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"
      />
    </div>
  );
};
