"use client";
import React, { useLayoutEffect, useRef } from "react";
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

  useLayoutEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let ctx1: gsap.Context | null = null;
    (async () => {
      try {
        if (typeof document !== "undefined" && (document as any).fonts?.ready) {
          await (document as any).fonts.ready;
        }
      } catch {}
      if (cancelled) return;

      const splitHeading = new SplitText(HeadingRef.current, { type: "chars" });
      const splitPara = new SplitText(paraWrapperRef.current, {
        type: "words",
      });
      const splitPara2 = new SplitText(para2.current, { type: "lines" });

      // Initial Hero animation
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.2 });
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
      });

      // Scroll-based bottom animation
      ctx1 = gsap.context(() => {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: bottomSectionRef.current,
            start: "top 85%",
            end: "bottom 85%",
          },
        });

        tl2.from(splitPara2.lines, {
          opacity: 0,
          y: 80,
          stagger: 0.08,
          ease: "power3.out",
        });

        tl2.to(
          para2.current,
          {
            y: -30,
            ease: "power1.out",
          },
          "+=0.3"
        );

        tl2.from(
          productCardRef.current,
          {
            scale: 0.9,
            duration: 0.2,
            ease: "power2.out",
          },
          "+=0.3"
        );

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
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
      ctx1?.revert();
    };
  });

  return (
    <Container>
      <div className="flex md:flex-row mt-10 flex-col gap-10 items-end relative overflow-hidden min-h-[70vh] md:min-h-auto bg-[url(https://res.cloudinary.com/duk94ehtq/image/upload/v1761630109/abhinav-sharma-Js76NA2Qnzg-unsplash_xufiyx.jpg)] bg-cover bg-no-repeat">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="p-4 w-full relative sm:px-10 z-10 md:z-auto">
          {/* Heading */}
          <div
            className="sm:ml-20 my-10 sm:my-20 sm:mb-30 font-semibold text-[60px] sm:text-[130px] sm:leading-[150px] text-[#f4f0ea] overflow-hidden"
            ref={HeadingRef}
          >
            ART GALLERY
          </div>

          {/* Paragraph */}
          <div className="flex flex-col items-start gap-4 w-full sm:ml-20 mb-5 overflow-hidden">
            <div
              ref={paraWrapperRef}
              className="text-sm sm:text-lg text-white flex flex-col gap-1 overflow-hidden"
            >
              <p>ADD ELEGANCE AND STRENGTH TO YOUR SPACE</p>
              <p>WITH DOMES THAT</p>
              <p>REFLECT YOUR VISION AND STYLE</p>
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
              WHERE ARCHITECTURE ENDURES: CREATING DOMES THAT LAST A LIFETIME
            </p>

            {/* Product Card */}
            <div
              className="group mx-auto p-2 hover:bg-background text-center transition cursor-pointer rounded-lg duration-400"
              ref={productCardRef}
            >
              <Image
                src="https://5.imimg.com/data5/SELLER/Default/2024/2/387885660/CQ/LV/KE/26774566/ccnfgn-500x500.png"
                alt="chair"
                width={280}
                height={320}
                className="h-auto w-50 sm:w-70 mb-3 object-cover mx-auto group-hover:scale-105 transition duration-700 rounded-lg"
              />
              <p className="group-hover:opacity-100 opacity-0 text-center transition duration-700">
                EAGLE -
              </p>
              <p className="font-bold group-hover:opacity-100 opacity-0 text-center transition duration-700">
                ₹ 400
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
