// src/pages/SplashScreen.jsx [cite: 2536]
import React, { useState, useEffect } from "react"; // [cite: 2537]
import BackgroundPattern from "../components/splash/BackgroundPattern"; // [cite: 2539]
import FloatingElements from "../components/splash/FloatingElements"; // [cite: 2541]
import LogoContainer from "../components/splash/LogoContainer"; // [cite: 2542]
import TitleSection from "../components/splash/TitleSection"; // [cite: 2543]
import LoadingAnimation from "../components/splash/LoadingAnimation"; // [cite: 2544]
import Footer from "../components/splash/Footer"; // [cite: 2545]

export default function SplashScreen({ onComplete }) {
  // [cite: 2546]
  const [progress, setProgress] = useState(0); // [cite: 2547]
  const [isVisible, setIsVisible] = useState(true); // [cite: 2547]
  const [fadeIn, setFadeIn] = useState(false); // [cite: 2547]
  const [fadeOut, setFadeOut] = useState(false); // [cite: 2548]

  useEffect(() => {
    // [cite: 2549]
    setTimeout(() => {
      // [cite: 2550]
      setFadeIn(true); // [cite: 2551]
    }, 100); // [cite: 2552]

    const interval = setInterval(() => {
      // [cite: 2553]
      setProgress((prev) => {
        // [cite: 2553]
        if (prev >= 100) {
          // [cite: 2554]
          clearInterval(interval); // [cite: 2555]
          setTimeout(() => {
            // [cite: 2556]
            setFadeOut(true); // [cite: 2557]
            setTimeout(() => {
              // [cite: 2558]
              setIsVisible(false); // [cite: 2559]
              setTimeout(() => {
                // [cite: 2560]
                if (typeof onComplete === "function")
                  // [cite: 2561]
                  onComplete(); // [cite: 2562]
              }, 100); // [cite: 2563]
            }, 600); // [cite: 2564]
          }, 800); // [cite: 2565]
          return 100; // [cite: 2566]
        } // [cite: 2554]
        const nextProgress = prev + 6; // [cite: 2567]
        return nextProgress > 100 ? 100 : nextProgress; // [cite: 2568]
      }); // [cite: 2569]
    }, 120); // [cite: 2570]

    return () => clearInterval(interval); // [cite: 2571]
  }, [onComplete]); // [cite: 2572]

  if (!isVisible) return null; // [cite: 2573]

  return (
    // [cite: 2574]
    <div // [cite: 2575]
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 transition-all duration-600 ease-out ${
        // [cite: 2576]
        !fadeIn ? "opacity-0 scale-95" : "opacity-100 scale-100" // [cite: 2578]
      } ${
        // [cite: 2579]
        fadeOut ? "opacity-0 scale-105" : "" // [cite: 2580]
      }`} //
    >
      {" "}
      {/* */}
      <BackgroundPattern fadeOut={fadeOut} /> {/* [cite: 2582] */}
      <FloatingElements fadeOut={fadeOut} /> {/* [cite: 2583] */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center max-w-xs sm:max-w-lg w-full transition-all duration-800 ${
          // [cite: 2584]
          !fadeIn ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0" // [cite: 2586]
        } ${
          // [cite: 2587]
          fadeOut ? "opacity-0 -translate-y-8" : "" // [cite: 2588]
        }`}
      >
        {" "}
        {/* [cite: 2589] */}
        <LogoContainer /> {/* [cite: 2590] */}
        <TitleSection fadeIn={fadeIn} /> {/* [cite: 2591] */}
        <LoadingAnimation fadeIn={fadeIn} progress={progress} />{" "}
        {/* [cite: 2593] */}
      </div>{" "}
      {/* [cite: 2594] */}
      <Footer fadeOut={fadeOut} fadeIn={fadeIn} /> {/* [cite: 2595] */}
    </div> // [cite: 2596]
  ); // [cite: 2597]
} // [cite: 2598]
