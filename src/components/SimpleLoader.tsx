import React from "react";

const SimpleLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Smooth spinner ring */}
        <div
          className="relative mx-auto mb-3 h-8 w-8"
          role="status"
          aria-label="Loading"
        >
          <div className="absolute inset-0 rounded-full border-2 border-black/80 border-t-transparent animate-spin" />
          <div className="absolute inset-1 rounded-full border-2 border-black/20 border-b-transparent animate-spin [animation-duration:1.4s]" />
        </div>

        {/* Bouncing dots */}
        <div
          className="flex items-center justify-center gap-1.5 mb-4"
          aria-hidden
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-700 animate-bounce [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
        </div>

        {/* Subtle label */}
        <p className="text-xs text-neutral-600 tracking-wide">
          Preparing your experience…
        </p>
      </div>
    </div>
  );
};

export default SimpleLoader;
