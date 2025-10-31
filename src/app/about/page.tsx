import Container from "@/components/Container";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4f0ea] pt-10 pb-16">
      <Container className="py-6 lg:py-10 sm:p-20 p-5  max-w-6xl mx-auto">
        {/* Header - mirrors products typography scale */}
        <div className="sm:mb-12 mb-6 flex flex-col justify-center items-center">
          <h1 className="tracking-wide leading-[1.1] text-[60px] sm:text-[180px] ">
            ABOUT us
          </h1>
          <div className="flex flex-col justify-center items-center sm:flex-row gap-4 mt-7   ">
            <Image
              src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761803241/a-minimalist-logo-design-featuring-an-el_8121Zr-jSHSHRvsQymAUyQ_-CNX5oqWQ_G2PeXUx0E9Bg_e9cmg6.jpg"
              alt="About logo"
              width={100}
              height={100}
              className=" h-50 w-50 sm:w-100 sm:h-100 object-cover rounded-3xl hover:scale-105 transition-all duration-300 shadow-accent"
            />
            <p className="text-xl sm:text-2xl capitalize pl-6 mt-1.5  w-full sm:w-1/2 self-start">
              We design, engineer, and craft bespoke architectural domes and
              hand‑finished statues that unite traditional artistry with modern
              precision.
              <span className="text-[15px] sm:text-[18px] text-gray-500 block mt-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
                ducimus illo suscipit corporis similique beatae blanditiis
                deleniti, quae tempore, fuga fugit hic optio quibusdam
                laboriosam illum dignissimos. Nihil aspernatur, nam
                necessitatibus at totam esse quis alias voluptas fugiat
                molestias dolores ducimus omnis! Omnis ullam quidem sunt
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-5 m-20">
          <div className="text-[50px] sm:text-[150px] italic leading-0 pt-10 mt-5 sm:mt-20">
            Successfull
          </div>
          <div>
            <Image
              src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761803241/a-minimalist-logo-design-featuring-an-el_8121Zr-jSHSHRvsQymAUyQ_-CNX5oqWQ_G2PeXUx0E9Bg_e9cmg6.jpg"
              alt="About image"
              width={100}
              height={100}
              className="w-90 h-90 -rotate-6 object-cover rounded-3xl hover:rotate-0  transition-all duration-300 shadow-xl"
            />
          </div>
          <div className=" text-[50px] sm:text-[150px] z-40 italic leading-0 pb-10">
            business
          </div>
        </div>
        {/* ------------------- */}
        <div>
          <div className="text-[3.5rem] sm:text-[90px] z-40 sm:mt-50 text-center">
            the story begin 🗿
          </div>
        </div>
        <div className="flex flex-col sm:flex-row m-5 sm:m-20 sm:gap-5">
          <div className="flex-1/2 my-10">
            <h1 className="text-2xl sm:text-5xl sm:text-right">
              Lorem ipsum dolor sit amet.
            </h1>{" "}
            <p className="sm:text-xl capitalize text-gray-500 py-5 sm:py-10 sm:text-right">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam
              eveniet rem delectus quam tenetur molestias quisquam dignissimos
              dolore sequi obcaecati.
            </p>
          </div>

          <div className="flex-1/2 mx-0 sm:mx-10">
            <Image
              src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761803241/a-minimalist-logo-design-featuring-an-el_8121Zr-jSHSHRvsQymAUyQ_-CNX5oqWQ_G2PeXUx0E9Bg_e9cmg6.jpg"
              alt="Story image"
              width={100}
              height={100}
              className="w-150 h-90 object-cover rounded-3xl hover:scale-105 transition-all duration-300 shadow-accent"
            />
          </div>
        </div>
        {/* --------------? */}`
        <div className="flex flex-col sm:flex-row m-5 sm:m-20 sm:gap-5">
          <div className="flex-1/2 my-10">
            <h1 className="text-2xl sm:text-5xl sm:text-right">
              Lorem ipsum dolor sit amet.
            </h1>{" "}
            <p className="sm:text-xl capitalize text-gray-500 py-5 sm:py-10 sm:text-right">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam
              eveniet rem delectus quam tenetur molestias quisquam dignissimos
              dolore sequi obcaecati.
            </p>
          </div>

          <div className="flex-1/2 mx-0 sm:mx-10">
            <Image
              src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761803241/a-minimalist-logo-design-featuring-an-el_8121Zr-jSHSHRvsQymAUyQ_-CNX5oqWQ_G2PeXUx0E9Bg_e9cmg6.jpg"
              alt="Story image"
              width={100}
              height={100}
              className="w-150 h-90 object-cover rounded-3xl hover:scale-105 transition-all duration-300 shadow-accent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row m-5 sm:m-20 sm:gap-5">
          <div className="flex-1/2 my-10">
            <h1 className="text-2xl sm:text-5xl sm:text-right">
              Lorem ipsum dolor sit amet.
            </h1>{" "}
            <p className="sm:text-xl capitalize text-gray-500 py-5 sm:py-10 sm:text-right">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam
              eveniet rem delectus quam tenetur molestias quisquam dignissimos
              dolore sequi obcaecati.
            </p>
          </div>

          <div className="flex-1/2 mx-0 sm:mx-10">
            <Image
              src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761803241/a-minimalist-logo-design-featuring-an-el_8121Zr-jSHSHRvsQymAUyQ_-CNX5oqWQ_G2PeXUx0E9Bg_e9cmg6.jpg"
              alt="Story image"
              width={100}
              height={100}
              className="w-150 h-90 object-cover rounded-3xl hover:scale-105 transition-all duration-300 shadow-accent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row m-5 sm:m-20 sm:gap-5">
          <div className="flex-1/2 my-10">
            <h1 className="text-2xl sm:text-5xl sm:text-right">
              Lorem ipsum dolor sit amet.
            </h1>{" "}
            <p className="sm:text-xl capitalize text-gray-500 py-5 sm:py-10 sm:text-right">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam
              eveniet rem delectus quam tenetur molestias quisquam dignissimos
              dolore sequi obcaecati.
            </p>
          </div>

          <div className="flex-1/2 mx-0 sm:mx-10">
            <Image
              src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761803241/a-minimalist-logo-design-featuring-an-el_8121Zr-jSHSHRvsQymAUyQ_-CNX5oqWQ_G2PeXUx0E9Bg_e9cmg6.jpg"
              alt="Story image"
              width={100}
              height={100}
              className="w-150 h-90 object-cover rounded-3xl hover:scale-105 transition-all duration-300 shadow-accent"
            />
          </div>
        </div>
        <div>
          <div className=" text-[40px] sm:text-[70px] z-40 mt-30 text-center">
            journary never stop 💙
          </div>
        </div>
      </Container>
    </main>
  );
}
