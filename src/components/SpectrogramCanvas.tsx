"use client";

import Meyda from "meyda";
import { useEffect, useRef, useState } from "react";

type ColorMapFunc = (value: number) => string;

const colorMaps: { [key: string]: ColorMapFunc } = {
	grayscale: (v) => `rgb(${v}, ${v}, ${v})`,
	jet: (v) => {
		const t = v / 255;
		const r = Math.round(
			255 * Math.max(Math.min(1.5 - Math.abs((t - 0.5) * 4), 1), 0),
		);
		const g = Math.round(
			255 * Math.max(Math.min(1 - Math.abs((t - 0.5) * 4), 1), 0),
		);
		const b = Math.round(
			255 * Math.max(Math.min(1.5 - Math.abs((t - 0.75) * 4), 1), 0),
		);
		return `rgb(${r}, ${g}, ${b})`;
	},
	inferno: (v) => {
		const t = v / 255;
		const r = Math.min(255, 255 * t ** 0.5);
		const g = Math.min(255, 255 * t ** 3);
		const b = Math.min(255, 255 * t ** 6);
		return `rgb(${r}, ${g}, ${b})`;
	},
	viridis: (v) => {
		const t = v / 255;
		const r = 255 * Math.sin(Math.PI * t);
		const g = 255 * Math.sin(Math.PI * t + Math.PI / 3);
		const b = 255 * Math.sin(Math.PI * t + (2 * Math.PI) / 3);
		return `rgb(${r}, ${g}, ${b})`;
	},
};

export default function SpectrogramCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedDeviceId, setSelectedDeviceId] = useState<
		string | undefined
	>();
	const [colorMapName, setColorMapName] = useState("inferno");

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
			navigator.mediaDevices.enumerateDevices().then((allDevices) => {
				const audioInputs = allDevices.filter((d) => d.kind === "audioinput");
				setDevices(audioInputs);
				if (audioInputs.length > 0) {
					setSelectedDeviceId(audioInputs[0].deviceId);
				}
			});
		});
	}, []);

	useEffect(() => {
		if (!selectedDeviceId) return;

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = 800;
		canvas.height = 400;

		const bufferSize = 1024;
		const audioCtx = new AudioContext();
		let analyzer: Meyda.MeydaAnalyzer;

		navigator.mediaDevices
			.getUserMedia({ audio: { deviceId: { exact: selectedDeviceId } } })
			.then((stream) => {
				const source = audioCtx.createMediaStreamSource(stream);

				analyzer = Meyda.createMeydaAnalyzer({
					audioContext: audioCtx,
					source,
					bufferSize,
					featureExtractors: ["amplitudeSpectrum"],
					callback: (features: { amplitudeSpectrum: number[] }) => {
						const spectrum = features.amplitudeSpectrum;
						if (!spectrum || !ctx) return;

						const imageData = ctx.getImageData(
							1,
							0,
							canvas.width - 1,
							canvas.height,
						);
						ctx.putImageData(imageData, 0, 0);

						const colorMap = colorMaps[colorMapName];

						for (let i = 0; i < spectrum.length; i++) {
							const value = Math.min(spectrum[i] * 255, 255);
							if (value === 0) continue;

							const y = Math.floor((i / spectrum.length) * canvas.height);
							ctx.fillStyle = colorMap(Math.floor(value));
							ctx.fillRect(canvas.width - 1, canvas.height - y, 1, 1);
						}
					},
				});

				analyzer.start();
			});

		return () => {
			analyzer?.stop();
			audioCtx.close();
		};
	}, [selectedDeviceId, colorMapName]);

	return (
		<div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 rounded p-6 shadow">
			<h1 className="font-bold text-2xl">BowMaster Visualizer</h1>

			<div className="flex w-full flex-col justify-center gap-4 md:flex-row">
				<select
					className="rounded border border-gray-400 p-2 "
					onChange={(e) => setSelectedDeviceId(e.target.value)}
					value={selectedDeviceId}
				>
					{devices.map((device) => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label || `Microphone (${device.deviceId})`}
						</option>
					))}
				</select>

				<select
					className="rounded border border-gray-400 p-2 "
					onChange={(e) => setColorMapName(e.target.value)}
					value={colorMapName}
				>
					{Object.keys(colorMaps).map((name) => (
						<option key={name} value={name}>
							{name}
						</option>
					))}
				</select>
			</div>

			<canvas ref={canvasRef} className="rounded border border-gray-500" />
		</div>
	);
}
