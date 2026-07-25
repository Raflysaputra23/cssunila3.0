"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface VideoBackgroundProps {
  opacity?: number;
  bgImageSrc?: string;
  bgImageOpacity?: number;
}

export default function VideoBackground({
  opacity = 0.55,
  bgImageSrc,
  bgImageOpacity = 0.2,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showBg, setShowBg] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {
      const unlock = () => {
        video.play().catch(() => {});
        window.removeEventListener("click", unlock);
        window.removeEventListener("touchstart", unlock);
      };
      window.addEventListener("click", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });
    });

    const unmute = () => {
      video.muted = false;
      video.volume = 0.3;
      window.removeEventListener("click", unmute);
      window.removeEventListener("touchstart", unmute);
    };
    window.addEventListener("click", unmute, { once: true });
    window.addEventListener("touchstart", unmute, { once: true });

    const handleEnded = () => {
      setIsPlaying(false);
      setShowBg(true);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      window.removeEventListener("click", unmute);
      window.removeEventListener("touchstart", unmute);
    };
  }, []);

  const handleHeroClick = () => {
    const video = videoRef.current;
    if (!video || isPlaying) return; 

    setShowBg(false);
    setIsPlaying(true);
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <div
      aria-hidden
      onClick={handleHeroClick}
      className={`absolute inset-0 -z-10 overflow-hidden ${
        !isPlaying ? "cursor-default" : "pointer-events-none"
      }`}
    >
      {bgImageSrc && (
        <Image
          src={bgImageSrc}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: showBg ? bgImageOpacity : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: 0,
          }}
        />
      )}
{/* 
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      /> */}

      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        style={{
          opacity: isPlaying ? opacity : 0,
          transition: "opacity 1s ease-in-out",
          zIndex: 1,
        }}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      >
        <source src="/video/animasi-css3.webm" type="video/webm" />
        <source src="/video/animasi-css3.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
