"use client";

import { useEffect, useRef } from "react";

interface Props {
  deviceId: string;
  baseFreq: number;
}

export default function SpectrumCanvas({ deviceId, baseFreq }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!deviceId) return;

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    let stream: MediaStream;

    navigator.mediaDevices.getUserMedia({ audio: { deviceId } }).then((s) => {
      stream = s;
      const source = audioCtx.createMediaStreamSource(s);
      source.connect(analyser);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      const draw = () => {
        requestAnimationFrame(draw);
        analyser.getFloatFrequencyData(dataArray);

        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const minHz = 300;
        const maxHz = 2000;

        for (let i = 0; i < bufferLength; i++) {
          const freq = (i * audioCtx.sampleRate) / analyser.fftSize;
          if (freq < minHz || freq > maxHz) continue;

          const x = ((freq - minHz) / (maxHz - minHz)) * width;
          const y = height - ((dataArray[i] + 140) / 100) * height;

          ctx.fillStyle = "lime";
          ctx.fillRect(x, y, 2, 2);
        }

        // 倍音ガイド（1〜4倍音）
        for (const n of [1, 2, 3, 4]) {
          const f = baseFreq * n;
          const x = ((f - minHz) / (maxHz - minHz)) * width;
          ctx.strokeStyle = "red";
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();

          ctx.fillStyle = "red";
          ctx.fillText(`${n}倍音`, x + 4, 12 + 12 * (n - 1));
        }
      };

      draw();
    });

    return () => {
      audioCtx.close();
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
    };
  }, [deviceId, baseFreq]);

  return (
    <div className="h-full w-full bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
