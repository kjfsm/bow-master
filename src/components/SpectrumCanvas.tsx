"use client";

import { useEffect, useRef } from "react";

interface Props {
	width: number;
	height: number;
	deviceId: string;
}

export default function SpectrumCanvas({ width, height, deviceId }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!deviceId) return;

		const audioCtx = new AudioContext();
		const analyser = audioCtx.createAnalyser();
		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Float32Array(bufferLength);

		navigator.mediaDevices
			.getUserMedia({ audio: { deviceId } })
			.then((stream) => {
				const source = audioCtx.createMediaStreamSource(stream);
				source.connect(analyser);

				const canvas = canvasRef.current;
				const ctx = canvas?.getContext("2d");
				const baseFreq = 442;

				const draw = () => {
					requestAnimationFrame(draw);
					analyser.getFloatFrequencyData(dataArray);

					if (!ctx || !canvas) return;

					ctx.clearRect(0, 0, canvas.width, canvas.height);

					const minHz = 300;
					const maxHz = 2000;

					for (let i = 0; i < bufferLength; i++) {
						const freq = (i * audioCtx.sampleRate) / analyser.fftSize;
						if (freq < minHz || freq > maxHz) continue;

						const x = ((freq - minHz) / (maxHz - minHz)) * canvas.width;
						const y =
							canvas.height - ((dataArray[i] + 140) / 100) * canvas.height;

						ctx.fillStyle = "lime";
						ctx.fillRect(x, y, 2, 2);
					}

					// 倍音ガイド（1〜4倍音）
					for (const n of [1, 2, 3, 4]) {
						const f = baseFreq * n;
						const x = ((f - minHz) / (maxHz - minHz)) * canvas.width;
						ctx.strokeStyle = "red";
						ctx.beginPath();
						ctx.moveTo(x, 0);
						ctx.lineTo(x, canvas.height);
						ctx.stroke();

						ctx.fillStyle = "red";
						ctx.fillText(`${n}倍音`, x + 4, 12 + 12 * (n - 1));
					}
				};

				draw();
			});

		return () => {
			audioCtx.close();
		};
	}, [deviceId]);

	return (
		<div className="h-full w-full bg-black">
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				className="h-full w-full"
			/>
		</div>
	);
}
