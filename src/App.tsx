import "./App.css";
import { useRef } from "react";
import NeonButton from "./components/NeonButton/NeonButton";
import NeonCursor from "./components/NeonCursor/NeonCursor";
import { RevealBackground } from "./components/RevealBackground";
import VideoContainer from "./components/VideoContainer/VideoContainer";
import HoverCard from "./components/HoverCard/HoverCard";
import WebBrowserSimulator from "./components/WebBrowserSimulator/WebBrowserSimulator";

function App() {
  const item1Ref = useRef(null);
  const item2Ref = useRef(null);
  const item3Ref = useRef(null);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Add the grid background */}

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
              <h2 className="text-slate-900 text-2xl">Hidden Content</h2>
              <p className="text-slate-700">
                This content will only be visible in the spotlight. Stay idle
                for 2 seconds to see the animation.
              </p>
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
          <div className="p-8">
            <h1 className="text-white text-4xl mb-4">Reveal Background Demo</h1>
            <p className="text-gray-300 mb-8">
              Move your mouse around to reveal the background content, or stay
              idle to see the automatic animation between the colored boxes.
            </p>

            <div className="mt-48">
              <WebBrowserSimulator>
                <VideoContainer />
              </WebBrowserSimulator>
            </div>
            <div className="mt-8">
              <HoverCard isDarkTheme={true} />
            </div>
            <div className="mt-8">
              <NeonButton
              // color="#ff0034"
              >
                Minimal Blur
              </NeonButton>
            </div>
          </div>
        </div>
      </RevealBackground>

      {/* Add the NeonCursor on top */}
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
