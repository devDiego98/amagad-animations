import React, { useEffect, useRef, useState } from "react";

interface SVGPathConfig {
  /** Stroke color for the path */
  strokeColor?: string;
  /** Stroke width for the path */
  strokeWidth?: number;
  /** Index of the path to apply styles to. If not provided, styles apply to all paths */
  pathIndex?: number;
}

interface FixedScrollSVGProps {
  /** SVG content as a string */
  svgContent: string;
  /** Whether to loop the animation continuously */
  loopAnimation?: boolean;
  /** Duration of the draw in/out animation in milliseconds */
  animationDuration?: number;
  /** Duration to pause at full draw before reversing, in milliseconds */
  pauseDuration?: number;
  /** Configuration for SVG path styles */
  pathConfigs?: SVGPathConfig[];
}

/**
 * FixedScrollSVG Component
 *
 * A React component that renders an SVG with animated path drawing effects.
 * The animation can be controlled either by scroll position or run in a continuous loop.
 * Supports custom styling for individual paths or all paths.
 *
 * @component
 * @example
 * ```tsx
 * <FixedScrollSVG
 *   svgContent={mySvgString}
 *   loopAnimation={true}
 *   animationDuration={2000}
 *   pauseDuration={500}
 *   pathConfigs={[
 *     { strokeColor: "#ff0000", strokeWidth: 2 }, // applies to all paths
 *     { strokeColor: "#00ff00", strokeWidth: 3, pathIndex: 1 } // applies to second path only
 *   ]}
 * />
 * ```
 */
const FixedScrollSVG: React.FC<FixedScrollSVGProps> = ({
  svgContent,
  loopAnimation = false,
  animationDuration = 2000,
  pauseDuration = 0,
  pathConfigs = [],
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathLengthsRef = useRef<Map<number, number>>(new Map());
  const animationRef = useRef<number | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(loopAnimation);

  // Helper function to apply path configurations
  const applyPathConfig = (path: SVGPathElement, index: number): void => {
    // Find specific config for this path index
    const specificConfig = pathConfigs.find(
      (config) => config.pathIndex === index
    );
    // Find global config (no pathIndex specified)
    const globalConfig = pathConfigs.find(
      (config) => config.pathIndex === undefined
    );

    // Apply specific config first, fall back to global config
    const config = specificConfig || globalConfig;

    if (config) {
      if (config.strokeColor) {
        path.style.stroke = config.strokeColor;
      }
      if (config.strokeWidth) {
        path.style.strokeWidth = `${config.strokeWidth}`;
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const svg = svgDoc.documentElement;

    // Create temporary SVG
    const tempSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    ) as SVGSVGElement;
    tempSvg.style.position = "absolute";
    tempSvg.style.opacity = "0";
    tempSvg.style.pointerEvents = "none";
    document.body.appendChild(tempSvg);

    // Copy SVG attributes
    Array.from(svg.attributes).forEach((attr) => {
      if (attr.name !== "xmlns") {
        tempSvg.setAttribute(attr.name, attr.value);
      }
    });

    // Calculate path lengths
    const paths = Array.from(svg.querySelectorAll("path")) as SVGPathElement[];
    paths.forEach((path, index) => {
      const tempPath = path.cloneNode(true) as SVGPathElement;
      tempSvg.appendChild(tempPath);
      const pathLength = tempPath.getTotalLength();
      pathLengthsRef.current.set(index, pathLength);
      tempSvg.removeChild(tempPath);
    });

    document.body.removeChild(tempSvg);

    // Configure main SVG
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Prepare paths for animation
    paths.forEach((path, index) => {
      const pathLength = pathLengthsRef.current.get(index);
      if (typeof pathLength === "undefined") return;

      // Store original attributes before applying configs
      const originalFill = path.getAttribute("fill");
      const originalStroke = path.getAttribute("stroke");
      const originalStrokeWidth = path.getAttribute("stroke-width");
      const vectorEffect = path.getAttribute("vector-effect");

      // Set animation properties
      path.style.strokeDasharray = `${pathLength}`;
      path.style.strokeDashoffset = `${pathLength}`;
      path.style.transition = loopAnimation
        ? "none"
        : "stroke-dashoffset 0.1s linear";

      // Apply original attributes
      if (originalFill) path.style.fill = originalFill;
      if (originalStroke) path.style.stroke = originalStroke;
      if (originalStrokeWidth) path.style.strokeWidth = originalStrokeWidth;
      if (vectorEffect) path.style.vectorEffect = vectorEffect;

      // Apply custom path configurations
      applyPathConfig(path, index);
    });

    // Clear and append SVG
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg);

    // Update paths based on progress
    const updatePaths = (progress: number): void => {
      paths.forEach((path, index) => {
        const pathLength = pathLengthsRef.current.get(index);
        if (typeof pathLength === "undefined") return;
        path.style.strokeDashoffset = `${pathLength - pathLength * progress}`;
      });
    };

    // Handle scroll progress
    const updateScrollProgress = (): void => {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const progress = Math.min(
        1,
        scrollPosition / (documentHeight - windowHeight)
      );

      updatePaths(progress);
    };

    // Animation loop
    const animate = (): void => {
      const totalCycleDuration = animationDuration * 2 + pauseDuration;
      let startTime: number | null = null;

      const step = (timestamp: number): void => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        let progress: number;
        if (elapsed < animationDuration) {
          progress = elapsed / animationDuration;
        } else if (elapsed < animationDuration + pauseDuration) {
          progress = 1;
        } else if (elapsed < totalCycleDuration) {
          const drawOutElapsed = elapsed - (animationDuration + pauseDuration);
          progress = 1 - drawOutElapsed / animationDuration;
        } else {
          startTime = timestamp;
          progress = 0;
        }

        progress = Math.max(0, Math.min(1, progress));
        updatePaths(progress);

        if (isLooping) {
          animationRef.current = requestAnimationFrame(step);
        }
      };

      animationRef.current = requestAnimationFrame(step);
    };

    // Set up event listeners
    if (loopAnimation) {
      animate();
    } else {
      window.addEventListener("scroll", updateScrollProgress);
      updateScrollProgress();
    }

    // Cleanup function
    return () => {
      if (!loopAnimation) {
        window.removeEventListener("scroll", updateScrollProgress);
      }
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      pathLengthsRef.current.clear();
    };
  }, [
    svgContent,
    loopAnimation,
    animationDuration,
    pauseDuration,
    isLooping,
    pathConfigs,
  ]);

  // Update looping state
  useEffect(() => {
    setIsLooping(loopAnimation);
  }, [loopAnimation]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 0,
        mixBlendMode: "difference",
      }}
    />
  );
};

export default FixedScrollSVG;
