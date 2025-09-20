import React from "react";

const SimpleLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        {/* Simple spinner */}
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />

        {/* Simple loading text */}
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default SimpleLoader;
