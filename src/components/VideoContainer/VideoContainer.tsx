import React, { useState } from "react";

const VideoContainer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // SVG Icons as components
  const MicIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );

  const VideoIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );

  const EndCallIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 2L2 22" />
      <path d="M2 2l20 20" />
    </svg>
  );

  return (
    <div className="  flex items-center justify-center">
      <div className="relative w-fit aspect-video rounded-xl overflow-hidden mb-4 bg-black">
        {/* Example video - replace src with your preferred video */}
        <video
          className="w-full h-full  max-w-[500px]"
          autoPlay
          loop
          muted={isMuted}
        >
          <source
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Control Bar */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[#e0e0e0] text-gray-600"
            style={{
              boxShadow:
                "inset 5px 5px 10px #c7c7c7, inset -5px -5px 10px #f9f9f9",
            }}
          >
            <MicIcon />
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[#e0e0e0] text-gray-600"
            style={{
              boxShadow:
                "inset 5px 5px 10px #c7c7c7, inset -5px -5px 10px #f9f9f9",
            }}
          >
            <VideoIcon />
          </button>

          <button
            className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 text-white"
            style={{
              boxShadow:
                "inset 5px 5px 10px rgba(0,0,0,0.2), inset -5px -5px 10px rgba(255,255,255,0.1)",
            }}
          >
            <EndCallIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
