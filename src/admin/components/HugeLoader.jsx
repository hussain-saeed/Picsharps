import React from "react";
import { motion } from "framer-motion";

function HugeLoader() {
  const brandName = "Picsharps";

  const containerVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center -mt-32">
      <div className="flex flex-col items-center gap-8">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 md:w-48 md:h-48"
        >
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          animate="animate"
          className="flex text-3xl md:text-6xl font-extrabold text-[#1B2337] tracking-tight"
        >
          {brandName}
        </motion.div>
      </div>
    </div>
  );
}

export default HugeLoader;
