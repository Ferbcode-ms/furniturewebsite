"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

type AnimatedButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "outline";
};

export default function AnimatedButton({
  label,
  onClick,
  className = "",
  variant = "outline",
}: AnimatedButtonProps) {
  const base = variant === "solid" ? "" : "";

  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-3 rounded-full  text-sm font-medium transition-all cursor-pointer border-[#4d3d30] ${base} ${className} `}
    >
      <span className="relative h-5 overflow-hidden">
        <span className="block transition-transform duration-500 group-hover:-translate-y-full font-semibold ease-out">
          {label}
        </span>
        <span className="block absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0 font-semibold ease-out">
          {label}
        </span>
      </span>
      <span className="relative inline-block w-7 h-7 overflow-hidden bg-[#4d3d30] rounded-2xl ">
        <ArrowRight className="absolute inset-1 h-5 w-5 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-0 text-white stroke-3 " />
        <ArrowRight className="absolute inset-1 h-5 w-5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 text-white stroke-3" />
      </span>
    </button>
  );
}
