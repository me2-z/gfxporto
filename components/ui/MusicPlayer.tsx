"use client";

import React, { useState, useEffect, useRef } from 'react';

const MUSIC_VIDEO_ID = 'nhys3nF4ZDU';

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
};

type YouTubePlayerEvent = {
  data?: number;
  target: YouTubePlayer;
};

type YouTubePlayerConstructor = new (
  elementId: string,
  options: {
    height: string;
    width: string;
    videoId: string;
    playerVars: { autoplay: 0 | 1; loop: 0 | 1; playlist: string };
    events: {
      onReady: (event: YouTubePlayerEvent) => void;
      onStateChange: (event: YouTubePlayerEvent) => void;
    };
  }
) => YouTubePlayer;

declare global {
  interface Window {
    YT?: {
      Player: YouTubePlayerConstructor;
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (!window.YT) {
        return;
      }

      playerRef.current = new window.YT.Player('yt-player-hidden', {
        height: '0',
        width: '0',
        videoId: MUSIC_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: MUSIC_VIDEO_ID,
        },
        events: {
          onReady: (event: YouTubePlayerEvent) => {
            event.target.setVolume(50);
          },
          onStateChange: (event: YouTubePlayerEvent) => {
            setIsPlaying(event.data === window.YT?.PlayerState.PLAYING);
          },
        },
      });
    };

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current?.playVideo) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current?.mute) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(val);
      if (val === 0) setIsMuted(true);
      else if (isMuted) setIsMuted(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-300 ${isExpanded ? 'bg-black/80 glass p-3 rounded-full' : ''}`}>
      <div id="yt-player-hidden" className="hidden pointer-events-none"></div>
      
      {isExpanded && (
        <div className="flex items-center gap-3 px-2 overflow-hidden transition-all duration-300">
          <button onClick={togglePlay} className="text-white hover:text-gray-300">
            <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill text-xl`}></i>
          </button>
          <button onClick={toggleMute} className="text-white hover:text-gray-300">
            <i className={`ri-volume-${isMuted ? 'mute' : 'up'}-fill text-xl`}></i>
          </button>
          <input 
            type="range" 
            min="0" max="100" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-20 accent-white h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:scale-105 transition-transform"
      >
        <div className="relative flex items-center justify-center">
          <i className="ri-music-2-line text-lg absolute z-10"></i>
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
              <span className="w-1 h-3 bg-white/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-5 bg-white/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-4 bg-white/30 rounded-full animate-bounce"></span>
              <span className="w-1 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
