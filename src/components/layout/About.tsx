"use client";
import Container from "@/components/Container";
import AnimatedButton from "@/components/AnimatedButton";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AboutPage() {
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const imgWrapperRef = useRef(null); // ✅ parent div for both images

  useEffect(() => {
    // ✅ Split heading + paragraph
    const headingSplit = new SplitText(headingRef.current, {
      type: "words,chars",
      charsClass: "char",
      wordsClass: "word",
    });

    const paraSplit = new SplitText(paragraphRef.current, {
      type: "lines",
      linesClass: "line overflow-hidden",
    });

    // ✅ Text entrance animation
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    textTl
      .from(headingSplit.chars, {
        opacity: 0,
        y: 50,
        stagger: 0.02,
        ease: "power3.out",
      })
      .from(
        paraSplit.lines,
        {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // ✅ Animate the parent image wrapper smoothly with scroll
    gsap.to(imgWrapperRef.current, {
      y: -50, // move upward while scrolling
      ease: "none",
      scrollTrigger: {
        trigger: imgWrapperRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5, // smooth motion
        // markers: true, // enable to debug
      },
    });

    // ✅ Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      headingSplit.revert();
      paraSplit.revert();
    };
  }, []);

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-around sm:p-10 ">
        {/* ✅ Animate this wrapper */}
        <div
          ref={imgWrapperRef}
          className="relative hidden sm:block rounded-lg will-change-transform translate-y-10"
        >
          <Image
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=687&auto=format&fit=crop"
            alt=""
            width={280}
            height={320}
            className="w-70 h-80 bg-cover hover:scale-105 transition duration-500 border-2 border-white rounded-lg"
          />
          <Image
            src="https://plus.unsplash.com/premium_photo-1705169612261-2cf0407141c3?q=80&w=687&auto=format&fit=crop"
            alt=""
            width={280}
            height={320}
            className="w-70 h-80 bg-cover absolute top-40 left-30 border-2 border-white rounded-lg hover:scale-105 transition duration-500"
          />
        </div>

        {/* ✅ Text Section */}
        <div className="flex flex-col sm:gap-4 max-w-2xl text-[--textcolor]">
          <h2
            ref={headingRef}
            className="text-2xl sm:text-5xl p-5 overflow-hidden"
          >
            WELCOME TO OUR FURNITURE SHOP, WHERE TIMELESS AND STYLISH DESIGNS
            MEET STORYTELLING.
          </h2>

          <p
            ref={paragraphRef}
            className="sm:text-xl p-4 capitalize overflow-hidden"
          >
            Every piece of furniture in our collection tells a personal story.
            Custom-designed and personalized to enhance your home&apos;s
            aesthetics.
          </p>

          <div className="ml-4">
            <Link href="#trending">
              <AnimatedButton
                label="ABOUT US"
                className="text-[--textcolor] border-2 px-4 py-2"
              />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
