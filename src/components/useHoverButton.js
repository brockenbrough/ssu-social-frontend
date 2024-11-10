import { useEffect, useRef } from "react";
import gsap from "gsap";

export const useHoverButton = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let hover = false;
    let x = 0;
    let y = 0;
    let width = 0;

    const calculatePosition = () => {
      const rect = el.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
      width = rect.width;
    };

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      const hoverArea = 0.55; 

      if (distance < width * hoverArea) {
        hover = true;
        gsap.to(el, {
          x: dx * 0.7, 
          y: dy * 0.6, 
          scale: 1.15, 
          ease: "power2.out",
          duration: 0.4,
        });
        el.style.zIndex = 10;
      } else if (hover) {
        hover = false;
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1, 
          ease: "elastic.out(1.2, 0.4)",
          duration: 0.7,
        });
        el.style.zIndex = 1;
      }
    };

    const handleResize = () => {
      calculatePosition();
    };

    calculatePosition();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return elementRef;
};
