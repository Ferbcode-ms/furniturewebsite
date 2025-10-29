import Container from "@/components/Container";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4f0ea] pt-10 pb-16">
      <Container className="py-6 lg:py-10 sm:p-20 p-5  max-w-6xl mx-auto">
        {/* Header - mirrors products typography scale */}
        <div className="sm:mb-12 mb-6 ">
          <h1 className="tracking-wide leading-[1.1] text-[40px] sm:text-[56px] md:text-[64px] lg:text-[250px]">
            ABOUT us
          </h1>
          <div className="flex gap-4 mt-7   ">
            <img
              src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761630207/abhinav-sharma-j_hMDRwWCsM-unsplash_ipctum.jpg"
              alt=""
              width={100}
              height={100}
              className="w-120 h-100 object-cover rounded-3xl hover:scale-105 transition-all duration-300"
            />
            <p className="text-2xl capitalize pl-6 w-1/2">
              We design, engineer, and craft bespoke architectural domes and
              hand‑finished statues that unite traditional artistry with modern
              precision.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
