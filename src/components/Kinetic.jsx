import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const KineticLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block will-change-transform"
      initial={{ y: "115%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

export const Reveal = ({ children, delay = 0, y = 28, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ index, eyebrow, title, accent }) => (
  <div className="mb-14 md:mb-20">
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon mb-4">
        {index} // {eyebrow}
      </p>
    </Reveal>
    <h2 className="font-display font-bold text-white tracking-tight leading-[1.08] text-[clamp(1.7rem,7vw,3rem)]">
      <KineticLine delay={0.05}>{title}</KineticLine>
      {accent ? (
        <KineticLine delay={0.16}>
          <span className="text-stroke">{accent}</span>
        </KineticLine>
      ) : null}
    </h2>
  </div>
);
