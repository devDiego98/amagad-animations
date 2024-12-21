// Modified NeonCursor.tsx
import React, { useState, useEffect } from "react";

interface Point {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface NeonCursorProps {
  color?: string;
  maxTrailPoints?: number;
  rippleDuration?: number;
  rippleSize?: number;
  cursorSize?: number;
  glowSize?: number;
}

const NeonCursor: React.FC<NeonCursorProps> = ({
  color = "rgb(59,130,246)",
  maxTrailPoints = 15,
  rippleDuration = 1000,
  rippleSize = 100,
  cursorSize = 2,
  glowSize = 6,
}) => {
  const [position, setPosition] = useState<Point>({
    x: 0,
    y: 0,
    opacity: 1,
    timestamp: Date.now(),
  });
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [trail, setTrail] = useState<Point[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const getRGBA = (alpha: number): string => {
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return color.replace(")", `,${alpha})`).replace("rgb", "rgba");
  };

  useEffect(() => {
    let moveTimeout: number;
    let fadeInterval: number;

    const updateMousePosition = (e: MouseEvent): void => {
      const currentTime = Date.now();
      const currentPos: Point = {
        x: e.clientX - cursorSize / 2,
        y: e.clientY - cursorSize / 2,
        opacity: 1,
        timestamp: currentTime,
      };

      setPosition(currentPos);
      setIsMoving(true);

      setTrail((prevTrail) => {
        const newTrail = [...prevTrail, currentPos];
        return newTrail.slice(-maxTrailPoints);
      });

      clearTimeout(moveTimeout);
      moveTimeout = window.setTimeout(() => {
        setIsMoving(false);
      }, 50);
    };

    const fadeLoop = () => {
      setTrail((prevTrail) => {
        const currentTime = Date.now();
        return prevTrail
          .map((point) => ({
            ...point,
            opacity: Math.max(0, 1 - (currentTime - point.timestamp) / 500),
          }))
          .filter((point) => point.opacity > 0);
      });
    };

    fadeInterval = window.setInterval(fadeLoop, 16);

    const handleClick = (e: MouseEvent): void => {
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, rippleDuration);
    };

    const handleMouseLeave = (): void => {
      setIsMoving(false);
    };

    // Use capture phase to ensure we get the events first
    document.addEventListener("mousemove", updateMousePosition, true);
    document.addEventListener("mousedown", handleClick, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", updateMousePosition, true);
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      clearTimeout(moveTimeout);
      clearInterval(fadeInterval);
      document.body.style.cursor = "auto";
    };
  }, [maxTrailPoints, cursorSize, rippleDuration]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        cursor: "none",
        zIndex: 1000, // Ensure cursor is always on top
      }}
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-transparent pointer-events-none"
          style={{
            left: ripple.x - rippleSize / 2,
            top: ripple.y - rippleSize / 2,
            width: `${rippleSize}px`,
            height: `${rippleSize}px`,
            border: `2px solid ${getRGBA(0.8)}`,
            animation: `neonCursorRipple ${rippleDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          }}
        />
      ))}

      {!isMoving && (
        <div
          className={`absolute rounded-full transition-transform duration-75 pointer-events-none
          ${isMoving ? "scale-75" : "scale-100"}`}
          style={{
            width: `${glowSize * 2}px`,
            height: `${glowSize * 2}px`,
            transform: `translate(${
              position.x - glowSize + cursorSize / 2
            }px, ${position.y - glowSize + cursorSize / 2}px)`,
            background: `radial-gradient(circle, ${getRGBA(0.8)} 0%, ${getRGBA(
              0.4
            )} 50%, ${getRGBA(0)} 100%)`,
            boxShadow: `0 0 20px ${getRGBA(isMoving ? 0.8 : 0.6)}`,
          }}
        />
      )}

      {trail.map((point, index) => (
        <div
          key={`${point.timestamp}-${index}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${cursorSize}px`,
            height: `${cursorSize}px`,
            transform: `translate(${point.x}px, ${point.y}px)`,
            backgroundColor: color,
            opacity: point.opacity * 0.5,
            boxShadow: `0 0 ${6 * point.opacity}px ${getRGBA(
              0.8 * point.opacity
            )}`,
            transition: "opacity 0.05s ease-out",
          }}
        />
      ))}

      {
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${cursorSize}px`,
            height: `${cursorSize}px`,
            transform: `translate(${position.x}px, ${position.y}px)`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${getRGBA(1)}`,
            opacity: isMoving ? 1 : position.opacity,
          }}
        />
      }

      <style>
        {`
          @keyframes neonCursorRipple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NeonCursor;
