import "./App.css";
import { useRef } from "react";
import NeonButton from "./components/NeonButton/NeonButton";
import { RevealBackground } from "./components/RevealBackground";
import VideoContainer from "./components/VideoContainer/VideoContainer";
import HoverCard from "./components/HoverCard/HoverCard";
import WebBrowserSimulator from "./components/WebBrowserSimulator/WebBrowserSimulator";
import FixedEnhancedScrollSVG from "./components/ScrollSVG/ScrollSVG";
import NeonCursor from "./components/NeonCursor/NeonCursor";

function App() {
  const item1Ref = useRef(null);
  const item2Ref = useRef(null);
  const item3Ref = useRef(null);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <g id="diego-text" fill="none" stroke="#FFD700" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
    <!-- D -->
    <path d="M260 300C260 300 260 780 260 780C350 780 440 780 500 700C560 620 560 460 500 380C440 300 350 300 260 300Z" />
    
    <!-- I -->
    <path d="M600 300L600 780" />
    
    <!-- E -->
    <path d="M700 300L900 300M700 540L880 540M700 780L900 780M700 300L700 780" />
    
    <!-- G -->
    <path d="M1100 540L1000 540L1000 460C1000 380 1040 300 1120 300C1200 300 1240 380 1240 460L1240 620C1240 700 1200 780 1120 780C1040 780 1000 700 1000 620" />
    
    <!-- O -->
    <path d="M1340 460C1340 380 1380 300 1460 300C1540 300 1580 380 1580 460L1580 620C1580 700 1540 780 1460 780C1380 780 1340 700 1340 620L1340 460Z" />
  </g>
  
  <!-- Frontend Dev text -->
  <g id="frontend-dev" fill="none" stroke="#FFD700" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <!-- Frontend -->
    <path d="M1100 850v70M1100 885h30M1150 850v70M1190 850v35h30v35M1240 850v70M1240 885h30M1290 850v70M1330 850h30v35h-30v35h30M1380 850v70M1380 885h30" />
    
    <!-- Dev -->
    <path d="M1430 850v70M1470 850v70M1510 850v35h30v35M1560 850h30v35h-30v35h30" />
  </g>
</svg>`;
  return (
    <div className="min-h-screen bg-black relative">
      {/* Add the fixed SVG background */}
      <FixedEnhancedScrollSVG
        svgContent={svg}
        pathConfigs={[
          // Global style for all paths
          { strokeColor: "#ff0000", strokeWidth: 10 },
          // Specific style for second path (index 1)
          { strokeColor: "#00ff00", strokeWidth: 20, pathIndex: 1 },
        ]}

        // loopAnimation
        // animationDuration={6000}
        // pauseDuration={3000}
      />

      <RevealBackground
        // showAll
        autoAnimate={true}
        animateToElements={[item1Ref, item2Ref, item3Ref]}
        background={
          <div className="w-full h-full relative bg-black">
            <div className="absolute inset-0 bg-white" />
            <div
              className="absolute inset-1"
              style={{
                backgroundColor: "#d5d5f4",
                opacity: 1,
                backgroundImage:
                  "linear-gradient(#000 2px, transparent 2px), linear-gradient(to right, #000 2px, #9f9fdb 2px)",
                backgroundSize: "4px 4px",
              }}
            />
            <div className="relative flex flex-col gap-8 p-8">
              <div className="grid grid-cols-3 gap-8">
                <div
                  ref={item1Ref}
                  className="bg-blue-500 p-8 rounded text-white text-center"
                >
                  <h3 className="text-xl font-bold">Hi!</h3>
                </div>
                <div
                  ref={item2Ref}
                  className="bg-green-500 p-8 rounded text-white text-center"
                >
                  <h3 className="text-xl font-bold">My name is</h3>
                </div>
                <div
                  ref={item3Ref}
                  className="bg-red-500 p-8 rounded text-white text-center"
                >
                  <h3 className="text-xl font-bold">Diego</h3>
                </div>
              </div>
            </div>
          </div>
        }
        revealRadius={150}
        blurAmount={0.8}
      >
        <div className="relative min-h-screen">
          <div className="p-8 mt-24">
            <h1 className="text-white text-4xl mb-4">Reveal Background Demo</h1>
            <p className="text-gray-300 mb-2">
              Move your mouse around to reveal the background content, or stay
              idle to see the automatic animation between the colored boxes.
            </p>

            <div className="mt-48">
              <WebBrowserSimulator>
                <VideoContainer />
              </WebBrowserSimulator>
            </div>
            <div className="mt-8 fixed bottom-0 left-0">
              <HoverCard isDarkTheme={true} />
            </div>
            <div className="mt-8">
              <NeonButton>About me</NeonButton>
            </div>
          </div>
        </div>
        <div style={{ height: "200vh" }}>This is a random container</div>
      </RevealBackground>
      <NeonCursor
        color="white"
        maxTrailPoints={50}
        rippleDuration={1500}
        rippleSize={150}
        cursorSize={4}
        glowSize={4}
      />
    </div>
  );
}

export default App;
