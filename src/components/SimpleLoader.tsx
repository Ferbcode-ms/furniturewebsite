import React from "react";

const SimpleLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Premium 4-dot bounce loader */}
        <div
          className="flex items-center justify-center gap-2 mb-6"
          aria-hidden
        >
          <span
            className="h-5 w-5 rounded-full bg-[var(--textcolor)] animate-[bounce_0.9s_infinite] [animation-delay:-0.3s]"
            style={{
              animationTimingFunction: "cubic-bezier(0.17, 0.67, 0.83, 0.67)",
            }}
          />
          <span
            className="h-5 w-5 rounded-full bg-[var(--textcolor)] animate-[bounce_0.9s_infinite] [animation-delay:-0.2s]"
            style={{
              animationTimingFunction: "cubic-bezier(0.17, 0.67, 0.83, 0.67)",
            }}
          />
          <span
            className="h-5 w-5 rounded-full bg-[var(--textcolor)] animate-[bounce_0.9s_infinite] [animation-delay:-0.1s]"
            style={{
              animationTimingFunction: "cubic-bezier(0.17, 0.67, 0.83, 0.67)",
            }}
          />
          <span
            className="h-5 w-5 rounded-full bg-[var(--textcolor)] animate-[bounce_0.9s_infinite] [animation-delay:-0.0s]"
            style={{
              animationTimingFunction: "cubic-bezier(0.17, 0.67, 0.83, 0.67)",
            }}
          />
        </div>

        {/* Loading text */}
        <p className="text-sm font-medium text-[var(--textcolor)] tracking-wider uppercase">
          Loading
        </p>
      </div>
    </div>
  );
};

export default SimpleLoader;
