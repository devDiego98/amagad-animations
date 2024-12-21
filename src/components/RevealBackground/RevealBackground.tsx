import React, { useState, useEffect, useRef, ReactNode } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface RevealBackgroundProps {
  background: ReactNode;
  revealRadius?: number;
  blurAmount?: number;
  children?: ReactNode;
  showAll?: boolean;
  autoAnimate?: boolean;
  animateToElements?: React.RefObject<HTMLElement>[];
}

const RevealBackground: React.FC<RevealBackgroundProps> = ({
  children,
  background,
  revealRadius = 100,
  blurAmount = 18,
  showAll = false,
  autoAnimate = false,
  animateToElements = [],
}) => {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  const idleTimerRef = useRef<number>();
  const animationFrameRef = useRef<number>();
  const lastInteractionTime = useRef<number>(Date.now());

  // Function to get element center position relative to container
  const getElementPosition = (element: HTMLElement): MousePosition => {
    if (!containerRef) return { x: 0, y: 0 };

    const containerRect = containerRef.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      x: elementRect.left + elementRect.width / 2 - containerRect.left,
      y: elementRect.top + elementRect.height / 2 - containerRect.top,
    };
  };

  // Animation function
  const animatePosition = (
    startPos: MousePosition,
    endPos: MousePosition,
    progress: number
  ) => {
    const easedProgress = easeInOutCubic(progress);
    return {
      x: startPos.x + (endPos.x - startPos.x) * easedProgress,
      y: startPos.y + (endPos.y - startPos.y) * easedProgress,
    };
  };

  // Easing function
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    if (!autoAnimate || animateToElements.length < 2 || !isIdle) return;

    let startTime: number;
    let startPos = mousePos;
    const animationDuration = 1000; // 1 second per transition

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / animationDuration, 1);

      const currentElement = animateToElements[currentElementIndex].current;
      const nextElement =
        animateToElements[(currentElementIndex + 1) % animateToElements.length]
          .current;

      if (currentElement && nextElement) {
        const endPos = getElementPosition(nextElement);
        const newPos = animatePosition(startPos, endPos, progress);
        setMousePos(newPos);

        if (progress === 1) {
          startTime = timestamp;
          startPos = endPos;
          setCurrentElementIndex(
            (prev) => (prev + 1) % animateToElements.length
          );
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isIdle, currentElementIndex, autoAnimate, animateToElements.length]);

  useEffect(() => {
    const handleUserInteraction = () => {
      lastInteractionTime.current = Date.now();
      setIsIdle(false);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = window.setTimeout(() => {
        setIsIdle(true);
      }, 2000);
    };

    // Add global mouse movement and interaction listeners
    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (!containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = (): void => {
    if (!autoAnimate) {
      setMousePos({ x: -1000, y: -1000 }); // Move mask out of view
    }
  };

  const maskStyle: React.CSSProperties = {
    maskImage: `radial-gradient(circle ${revealRadius}px at ${mousePos.x}px ${mousePos.y}px, 
      black 0%,
      rgba(0, 0, 0, 0.95) 10%,
      rgba(0, 0, 0, 0.8) 20%,
      rgba(0, 0, 0, 0.6) 30%,
      rgba(0, 0, 0, 0.4) 40%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0.1) 80%,
      transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle ${revealRadius}px at ${mousePos.x}px ${mousePos.y}px, 
      black 0%,
      rgba(0, 0, 0, 0.95) 10%,
      rgba(0, 0, 0, 0.8) 20%,
      rgba(0, 0, 0, 0.6) 30%,
      rgba(0, 0, 0, 0.4) 40%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0.1) 80%,
      transparent 100%)`,
    filter: `blur(${blurAmount}px)`,
  };

  return (
    <div
      ref={setContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-screen overflow-hidden"
    >
      {/* Hidden background content */}
      {!showAll && (
        <div className="absolute inset-0 opacity-0">{background}</div>
      )}

      {/* Revealed and blurred content with mask */}
      <div
        className="absolute inset-0"
        style={showAll ? { filter: `blur(${blurAmount}px)` } : maskStyle}
      >
        {background}
      </div>

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default RevealBackground;
