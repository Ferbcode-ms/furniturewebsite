"use client";
import React, { useRef } from "react";
import Container from "../Container";
import Link from "next/link";
import Image from "next/image";
import AnimatedButton from "../AnimatedButton";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(SplitText, ScrollTrigger);

const Hero = () => {
  const HeadingRef = useRef(null);
  const paraWrapperRef = useRef(null);
  const btnRef = useRef(null);
  const para2 = useRef(null);
  const bottomSectionRef = useRef(null);
  const productCardRef = useRef(null);
  const productTitleRef = useRef(null);

  useGSAP(() => {
    const splitHeading = new SplitText(HeadingRef.current, { type: "chars" });
    const splitPara = new SplitText(paraWrapperRef.current, { type: "words" });
    const splitPara2 = new SplitText(para2.current, { type: "lines" });

    // Initial Hero animation
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from(splitHeading.chars, {
      yPercent: 200,
      stagger: 0.05,
      ease: "circ.out",
    })
      .from(
        splitPara.words,
        {
          opacity: 0,
          y: 40,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .from(
        btnRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      );

    // Scroll-based bottom animation
    // Smooth scroll-based animation
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: bottomSectionRef.current,
        start: "top 85%", // trigger a bit later
        end: "bottom 85%", // extend scroll range (longer = slower)
        scrub: 2, // smooth scrub
        // markers: true, // remove later
      },
    });

    // Step 1: SplitText reveal (word by word)
    tl2.from(splitPara2.lines, {
      opacity: 0,
      y: 80,
      stagger: 0.08,
      ease: "power3.out",
    });

    // Step 2: Subtle upward float of the paragraph
    tl2.to(
      para2.current,
      {
        y: -30, // smaller lift for smoother feel
        ease: "power1.out",
      },
      "+=0.3"
    );

    // Step 3: Fade + scale in the product card
    tl2.from(
      productCardRef.current,
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.7"
    );

    // Step 4: Reveal the "Product of the day" text
    tl2.from(
      productTitleRef.current,
      {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // Step 5: Gentle parallax upward motion
    tl2.to(
      productCardRef.current,
      {
        y: -40,
        ease: "power1.out",
      },
      "-=0.5"
    );

    tl2.to(
      productTitleRef.current,
      {
        y: -30,
        ease: "power1.out",
      },
      "-=0.5"
    );
  });

  return (
    <Container>
      <div className="flex md:flex-row mt-10 flex-col gap-10 items-end relative overflow-hidden min-h-[70vh] md:min-h-auto bg-[url(https://images.unsplash.com/photo-1723376779603-69f15cdfa034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-no-repeat">
        <div className="absolute inset-0 bg-black/15 z-0"></div>
        <div className="p-4 w-full relative sm:px-10 z-10 md:z-auto">
          {/* Heading */}
          <div
            className="sm:ml-20 my-10 sm:my-20 sm:mb-30 font-semibold text-[60px] sm:text-[250px] sm:leading-[200px] text-[#f4f0ea] overflow-hidden"
            ref={HeadingRef}
          >
            FURNITURE
          </div>

          {/* Paragraph */}
          <div className="flex flex-col items-start gap-4 w-full sm:ml-20 mb-5 overflow-hidden">
            <div
              ref={paraWrapperRef}
              className="text-sm sm:text-lg text-white flex flex-col gap-1 overflow-hidden"
            >
              <p>ADD ELEGANCE AND CHARM TO YOUR SPACE</p>
              <p>WITH FURNITURE THAT</p>
              <p>EXPRESSES YOUR INDIVIDUALITY</p>
            </div>

            {/* Button */}
            <div className="flex sm:justify-end w-full md:w-auto relative z-10 md:z-auto overflow-hidden">
              <Link href="#trending" ref={btnRef}>
                <AnimatedButton
                  label="EXPLORE COLLECTION"
                  className="text-white border-1 border-background px-2 py-1"
                  variant="solid"
                />
              </Link>
            </div>
          </div>

          {/* ✅ Bottom Section */}
          <div
            className="flex flex-col gap-5 mt-10 p-5 rounded-lg"
            ref={bottomSectionRef}
          >
            {/* para2 text */}
            <p
              className="text-center w-full sm:w-1/2 mx-auto font-semibold text-2xl sm:text-6xl text-[#f4f0ea]"
              ref={para2}
            >
              WHERE STYLE ENDURES: TIMELESS FURNITURE FOR YOUR STORY
            </p>

            {/* Product Card */}
            <div
              className="group mx-auto p-2 hover:bg-background text-center transition cursor-pointer rounded-lg duration-400"
              ref={productCardRef}
            >
              <Image
                src="https://plus.unsplash.com/premium_photo-1678074057896-eee996d4a23e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="chair"
                width={280}
                height={320}
                className="h-40 sm:h-70 w-50 sm:w-70 mb-3 object-cover mx-auto group-hover:scale-105 transition duration-700 rounded-lg"
              />
              <p className="group-hover:opacity-100 opacity-0 text-center transition duration-700">
                white chair -
              </p>
              <p className="font-bold group-hover:opacity-100 opacity-0 text-center transition duration-700">
                $ 400
              </p>
            </div>

            {/* Product Title */}
            <p
              className="text-center font-semibold text-3xl sm:text-8xl text-[#f4f0ea]"
              ref={productTitleRef}
            >
              Product of the day
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Hero;
