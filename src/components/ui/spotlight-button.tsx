"use client";

import { motion } from "motion/react";
import React, { useRef, useState } from "react";

type ButtonVariant = "black" | "white" | "outline" | "outline-white";

interface SpotlightButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  hoverColor?: string;
  hoverTextColor?: string;
  animationDuration?: number;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  black: "bg-black text-white",
  white: "bg-white text-black",
  outline: "bg-transparent text-black border border-black",
  "outline-white": "bg-transparent text-white border border-white",
};

const CIRCLE_SIZE = 16; // px, matches w-4 h-4

const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  children,
  variant = "black",
  hoverColor = "var(--color-edusport-blue)",
  hoverTextColor,
  className = "",
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const getScale = (x: number, y: number) => {
    if (!buttonRef.current) return 0;
    const { width, height } = buttonRef.current.getBoundingClientRect();
    // Distance to farthest corner from cursor
    const dx = Math.max(x, width - x);
    const dy = Math.max(y, height - y);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return (distance / (CIRCLE_SIZE / 2)) * 2;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    setScale(getScale(x, y));
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    setScale(getScale(x, y));
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden px-6 py-3 rounded-full font-normal outline-none active:ring-2 active:ring-offset-2 active:ring-current ${variantStyles[variant]} ${className}`}
    >
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          backgroundColor: hoverColor,
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          left: position.x - CIRCLE_SIZE / 2,
          top: position.y - CIRCLE_SIZE / 2,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? scale : 0 }}
        transition={{
          duration: isHovered ? 1 : 0.4,
          ease: isHovered ? [0.4, 0, 0.2, 1] : [0.4, 0, 1, 1],
        }}
      />
      <span
        className="relative z-10 transition-colors duration-300"
        style={
          hoverTextColor
            ? { color: isHovered ? hoverTextColor : undefined }
            : undefined
        }
      >
        {children}
      </span>
    </button>
  );
};

export default SpotlightButton;
