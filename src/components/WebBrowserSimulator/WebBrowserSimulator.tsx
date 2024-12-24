import { useState, useRef, useEffect, ReactNode } from "react";

interface WebBrowserSimulatorProps {
  children: ReactNode;
}

const WebBrowserSimulator = ({ children }: WebBrowserSimulatorProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wasMinimized, setWasMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    // Clear any existing timeout
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    setWasMinimized(true);
    setIsFullscreen(false);
    setIsMinimized(!isMinimized);
  };

  const handleFullscreen = () => {
    setIsMinimized(false);
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (!isMinimized && containerRef.current && wasMinimized) {
      // Use timeout to ensure DOM is ready
      timeoutRef.current = window.setTimeout(() => {
        if (containerRef.current instanceof HTMLElement) {
          try {
            containerRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          } catch (error) {
            console.error("Scroll failed:", error);
          }
        }
      }, 100);
    }

    // Cleanup timeout on unmount or state change
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMinimized, wasMinimized]);

  // Early return if not visible
  if (!isVisible) {
    return null;
  }

  const neomorphicStyles = {
    background:
      "linear-gradient(225deg, rgb(240, 240, 240), rgb(202, 202, 202));",
    boxShadow:
      "rgb(199, 199, 199) 2px 3px 10px, rgb(249, 249, 249) 2px 0px 20px;",
    borderRadius: "14px",
  } as const;

  return (
    <div
      ref={containerRef}
      style={!isMinimized ? neomorphicStyles : undefined}
      className={`${
        isMinimized ? "fixed" : ""
      } transition-all duration-300 ease-in-out bg-gradient-to-br from-gray-100 to-gray-200
      ${
        isMinimized
          ? "bottom-4 right-4 w-12 h-12 rounded-full cursor-pointer shadow-lg"
          : isFullscreen
          ? "fixed z-10 inset-0 top-0 left-0 right-0 bottom-0 w-full h-full rounded-none"
          : "w-full h-full"
      }`}
      onClick={isMinimized ? handleMinimize : undefined}
    >
      {!isMinimized && (
        <div className="flex p-2 gap-1 bg-transparent">
          <button
            type="button"
            title="Close"
            className="circle cursor-pointer transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <span className="bg-red-500 inline-block center w-3 h-3 rounded-full shadow-sm" />
          </button>
          <button
            type="button"
            title="Minimize"
            className="circle cursor-pointer transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
          >
            <span className="bg-gray-500 inline-block center w-3 h-3 rounded-full shadow-sm" />
          </button>
          <button
            type="button"
            title="Fullscreen"
            className="circle cursor-pointer transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleFullscreen();
            }}
          >
            <span className="bg-green-500 inline-block center w-3 h-3 rounded-full shadow-sm" />
          </button>
        </div>
      )}

      <div className="card_content p-4">
        {!isMinimized && (
          <div className="text-gray-700 relative">{children}</div>
        )}
      </div>
    </div>
  );
};

export default WebBrowserSimulator;
