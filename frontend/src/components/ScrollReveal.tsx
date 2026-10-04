"use client";

import { useEffect, ReactNode, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "zoom";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cập nhật liên tục khi cuộn tới và khi cuộn ngược ra khỏi màn hình
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "-20px 0px -40px 0px",
      }
    );

    const currentTarget = domRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, []);

  // Transform styles mượt mà với hiệu ứng blur và scale chuẩn Apple/Stripe
  const getDirectionStyle = () => {
    if (isVisible) {
      return "translate-x-0 translate-y-0 opacity-100 scale-100 blur-none";
    }

    switch (direction) {
      case "up":
        return "translate-y-16 opacity-0 scale-[0.96] blur-[2px]";
      case "down":
        return "-translate-y-16 opacity-0 scale-[0.96] blur-[2px]";
      case "left":
        return "translate-x-16 opacity-0 scale-[0.98] blur-[2px]";
      case "right":
        return "-translate-x-16 opacity-0 scale-[0.98] blur-[2px]";
      case "zoom":
        return "opacity-0 scale-[0.92] blur-[4px]";
      default:
        return "translate-y-16 opacity-0 scale-[0.96]";
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
        transitionDuration: "850ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Apple smooth fluid curve
      }}
      className={`transition-all will-change-[transform,opacity,filter] ${getDirectionStyle()} ${className}`}
    >
      {children}
    </div>
  );
}
