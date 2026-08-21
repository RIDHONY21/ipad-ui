import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="background-layer" aria-hidden="true">
      <div className="grid-overlay" />

      <motion.div
        className="light-orb orb-a"
        animate={{
          x: [0, 40, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="light-orb orb-b"
        animate={{
          x: [0, -35, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}