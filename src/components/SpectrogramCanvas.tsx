import { useEffect, useRef } from "react";

export default function SpectrogramCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const audioCtx = new window.AudioContext();
		const analyser = audioCtx.createAnalyser();
		analyser.fftSize = 2048;

		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			const source = audioCtx.createMediaStreamSource(stream);
			source.connect(analyser);

			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);

			const draw = () => {
				requestAnimationFrame(draw);
				analyser.getByteFrequencyData(dataArray);

				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				const barWidth = (canvas.width / bufferLength) * 2.5;
				let x = 0;

				for (let i = 0; i < bufferLength; i++) {
					const barHeight = dataArray[i];
					ctx.fillStyle = "lime";
					ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
					x += barWidth + 1;
				}
			};

			draw();
		});
	}, []);

	return <canvas ref={canvasRef} width={800} height={400} />;
}
