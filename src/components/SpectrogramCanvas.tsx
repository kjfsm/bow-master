'use client';

import { useEffect, useRef } from 'react';

export default function SpectrogramCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fftSize = 1024;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 800;
    canvas.height = 400;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = fftSize;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const draw = () => {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        // スクロール表示
        const imageData = ctx.getImageData(1, 0, canvas.width - 1, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        // 右端に新しいスペクトルを描画
        for (let i = 0; i < bufferLength; i++) {
          const value = dataArray[i];
          const y = Math.floor((i / bufferLength) * canvas.height);
          const color = `hsl(${value}, 100%, ${value / 2}%)`;
          ctx.fillStyle = color;
          ctx.fillRect(canvas.width - 1, canvas.height - y, 1, 1);
        }
      };

      draw();
    });
  }, []);

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="border border-white" />
    </div>
  );
}
