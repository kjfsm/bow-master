"use client";

import { useEffect, useRef } from "react";
import { getAudioStream } from "../utils/audioUtils";

interface Props {
  deviceId: string;
  baseFreq: number;
  className?: string;
}

export default function SpectrumCanvas({
  deviceId,
  baseFreq,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animationFrameId: number;

    const drawSpectrum = (dataArray: Uint8Array) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw spectrum
      ctx.beginPath();
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      const barWidth = parent.clientWidth / dataArray.length;
      dataArray.forEach((value, index) => {
        const x = index * barWidth;
        const y = parent.clientHeight - (value / 255) * parent.clientHeight;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw baseFreq line
      const baseFreqX = (baseFreq / 1000) * parent.clientWidth; // Assuming baseFreq is normalized to 0-1000
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.moveTo(baseFreqX, 0);
      ctx.lineTo(baseFreqX, parent.clientHeight);
      ctx.stroke();
    };

    const startAudio = async () => {
      audioContext = new AudioContext();
      try {
        const stream = await getAudioStream(deviceId);
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const renderFrame = () => {
          analyser?.getByteFrequencyData(dataArray);
          drawSpectrum(dataArray);
          animationFrameId = requestAnimationFrame(renderFrame);
        };

        renderFrame();
      } catch (error) {
        console.error("Failed to start audio stream:", error);
      }
    };

    startAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [deviceId, baseFreq]);

  return (
    <div className={`bg-black ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
