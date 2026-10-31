import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 35 });
  const ry = useSpring(y, { stiffness: 350, damping: 35 });
  const [active, setActive] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    if (!mq.matches) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      setActive(
        !!e.target.closest("a,button,input,select,textarea,label,[data-hover]")
      );
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!fine) return null;

  return (
    <>
      <motion.div
        data-testid="custom-cursor-ring"
        className="fixed top-0 left-0 z-[100] pointer-events-none"
        style={{ x: rx, y: ry }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-neon t-fast ${
            active ? "w-14 h-14 bg-neon/10" : "w-7 h-7"
          }`}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[100] pointer-events-none"
        style={{ x, y }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon" />
      </motion.div>
    </>
  );
}
