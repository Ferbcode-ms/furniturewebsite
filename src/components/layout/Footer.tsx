"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" relative m-2 sm:m-4  mt-20 bg-[url(https://res.cloudinary.com/duk94ehtq/image/upload/v1761630207/abhinav-sharma-j_hMDRwWCsM-unsplash_ipctum.jpg)] bg-cover bg-center  text-white ">
      <div className="absolute inset-0 h-full w-full bg-black/40 "></div>
      <div className=" flex flex-col justify-between z-10 relative ">
        {/* Links grid */}
        <div className="p-6 font-bold flex justify-between gap-10">
          {/* Shop */}
          <div>
            <ul className="">
              <li>
                <Link href="/products" className="t">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="">
            <Link
              href={
                "https://www.instagram.com/ravinder_singh_jagraon?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              }
            >
              {" "}
              <p>INSTAGRAM</p>
            </Link>
            <Link href={"https://www.youtube.com/@ravinderfiberartjagraon9583"}>
              {" "}
              <p>YOUTUBE</p>
            </Link>
            <Link href={"https://www.facebook.com/ravinder.devgan.14/"}>
              {" "}
              <p>FACEBOOK</p>
            </Link>
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-9xl m-10 sm:p-20 sm:m-20 my-50 tracking-tigh ">
            ART GALLERY
          </h2>
        </div>
        {/* Bottom bar */}
        <div className="flex justify-between p-2 sm:p-6 bg-black/30 sm:text-sm text-[12px] ">
          <p>© {new Date().getFullYear()} Furniture. All rights reserved.</p>
          <p>MADE BY : FERBCODE.MS</p>
        </div>
      </div>
    </footer>
  );
}
