"use client";

import { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, ChevronFirst, ChevronLast } from "lucide-react";

const songs = [
  {
    title: "Jua La Asubuhi (Morning Sun)",
    artist: "my dear shelter x onion drift",
    src: "/audio/song1.wav",
  },
  {
    title: "Sauti ya Uhai (Voice of Life)",
    artist: "my dear shelter",
    src: "/audio/song2.wav",
  },
];

const additionalSongs = [
  {
    number: "ⅠⅠⅠ",
    title: "Moyo wa Tumaini (Heart of Hope)",
    artist: "my dear shelter x onion drift",
    duration: "2:12",
  },
  {
    number: "Ⅳ",
    title: "Upepo wa Mashariki (Eastern Breeze)",
    artist: "my dear shelter x onion drift",
    duration: "2:52",
  },
  {
    number: "Ⅴ",
    title: "Mbingu za Amani (Skies of Peace)",
    artist: "my dear shelter x xhu li",
    duration: "2:57",
  },
  {
    number: "Ⅵ",
    title: "Bahari ya Ndoto (Ocean of Dreams)",
    artist: "my dear shelter",
    duration: "2:14",
  },
  {
    number: "Ⅶ",
    title: "Mapigo ya Mwanga (Beats of Light)",
    artist: "my dear shelter",
    duration: "2:22",
  },
  {
    number: "Ⅷ",
    title: "Midundo ya Uponyaji (Rhythms of Healing)",
    artist: "my dear shelter x",
    duration: "2:22",
  },
  {
    number: "Ⅸ",
    title: "Midundo ya Uponyaji (Rhythms of Healing)",
    artist: "my dear shelter x",
    duration: "2:22",
  },
  {
    number: "Ⅹ",
    title: "Mwanzo Mpya (New Beginning)",
    artist: "my dear shelter x",
    duration: "2:32",
  },
];

const AudioPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const waveSurferRef = useRef(null);
  const waveFormRef = useRef(null);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    let wavesurfer = null;

    const initializeWaveSurfer = async () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }

      wavesurfer = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#1c2730",
        progressColor: "#1fec85",
        barWidth: 10,
        barGap: 10,
        height: 80,
        renderFunction: (channels, ctx) => {
          const { width, height } = ctx.canvas;
          const scale = channels[0].length / width;
          const step = 10;

          ctx.translate(0, height / 2);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();

          for (let i = 0; i < width; i += step * 2) {
            const index = Math.floor(i * scale);
            const value = Math.abs(channels[0][index]);
            let x = i;
            let y = value * height;

            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
            ctx.lineTo(x + step, 0);

            x = x + step;
            y = -y;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
            ctx.lineTo(x + step, 0);
          }

          ctx.stroke();
          ctx.closePath();
        },
      });

      waveSurferRef.current = wavesurfer;

      await wavesurfer.load(currentSong.src);

      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration());
      });

      wavesurfer.on("audioprocess", () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      });

      wavesurfer.on("finish", handleNext);
    };

    initializeWaveSurfer();

    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [currentSongIndex, currentSong.src]);

  const handlePlayPause = () => {
    if (waveSurferRef.current) {
      if (isPlaying) {
        waveSurferRef.current.pause();
      } else {
        waveSurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    );
  };

  return (
    <div className="p-4 rounded-[18px] w-full bg-card mt-4">
      <div className="mb-4 flex justify-between items-center">
        <span className="font-semibold">EP Preview</span>
      </div>

      <div className="max-w-lg mx-auto p-4 border border-border text-dark rounded-lg bg-card">
        <h2 className="text-xl font-bold mb-2 animate-pulse">
          {currentSong.title}
        </h2>
        <p className="text-sm mb-4">{currentSong.artist}</p>
        <div ref={waveFormRef} className="mb-4 border py-2 border-border"></div>
        <div className="flex justify-between items-center mt-4">
          <button onClick={handlePrev}>
            <ChevronFirst className="text-2xl" />
          </button>
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <Pause className="text-2xl" />
            ) : (
              <Play className="text-2xl" />
            )}
          </button>
          <button onClick={handleNext}>
            <ChevronLast className="text-2xl" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          <span>
            {new Date(currentTime * 1000).toISOString().substring(14, 19)}
          </span>{" "}
          /{" "}
          <span>
            {new Date(duration * 1000).toISOString().substring(14, 19)}
          </span>
        </div>
        <ul className="mt-4">
          {songs.map((song, index) => (
            <li
              key={index}
              className={`cursor-pointer px-3 py-4 text-sm border-border border ${
                currentSongIndex === index && "border-accent bg-accent/20"
              } rounded-lg mb-2 flex justify-between items-center`}
              onClick={() => setCurrentSongIndex(index)}
            >
              <span className="flex items-center gap-x-4 font-medium">
                <span>{index === 0 ? "Ⅰ" : "ⅠⅠ"}</span>
                <span className="flex flex-col gap-y-0.5">
                  <span>{song.title}</span>
                  <span className="text-xs font-normal">{song.artist}</span>
                </span>
              </span>
              <span className="text-xs font-normal">
                {new Date(duration * 1000).toISOString().substring(14, 19)}
              </span>
            </li>
          ))}

          {additionalSongs.map((song, index) => (
            <li
              key={index}
              className="cursor-not-allowed px-3 py-4 text-sm border-border border rounded-lg mb-2 flex justify-between items-center"
            >
              <span className="flex items-center gap-x-4 font-medium">
                <span>{song.number}</span>
                <span className="flex flex-col gap-y-0.5">
                  <span>{song.title}</span>
                  <span className="text-xs font-normal">{song.artist}</span>
                </span>
              </span>
              <span>{song.duration}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AudioPlayer;
