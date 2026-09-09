"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Progressive enhancement: SSR stays readable; media never inherits a reveal. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || reducedMotion.matches || element.querySelector("img, picture, video, canvas, iframe") || !("IntersectionObserver" in window)) return;

    const animation = element.animate(
      [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 550, delay: Math.min(Math.max(delay, 0), 0.3) * 1000, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "both" }
    );
    animation.pause();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animation.play();
      observer.disconnect();
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    observer.observe(element);
    animation.onfinish = () => animation.cancel();

    const showContent = () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        animation.cancel();
      }
    };
    reducedMotion.addEventListener("change", showContent);
    return () => {
      observer.disconnect();
      animation.cancel();
      reducedMotion.removeEventListener("change", showContent);
    };
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
