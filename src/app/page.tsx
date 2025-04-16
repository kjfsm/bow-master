"use client";

import SettingsDialog from "@/components/SettingsDialog";
import SpectrumCanvas from "@/components/SpectrumCanvas";
import { useEffect, useState } from "react";

export default function Home() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [config, setConfig] = useState({
		deviceId: "",
		baseFreq: 442,
		tuningSystem: "equal",
	});

	// 🎯 SSRとクライアント差を避けるため、初期値は固定
	const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
	const [ready, setReady] = useState(false); // 初期は描画させない

	useEffect(() => {
		// クライアントマウント時に実サイズ取得
		const updateSize = () => {
			setCanvasSize({
				width: window.innerWidth,
				height: window.innerHeight - 120, // ヘッダー分などを考慮
			});
			setReady(true);
		};

		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return (
		<div className="flex h-screen w-screen flex-col items-center bg-gray-50 text-gray-900">
			<header className="flex w-full items-center justify-between border-b bg-white px-4 py-2 shadow-sm">
				<h1 className="font-bold text-xl">バイオリン音色スペクトラム</h1>
				<button
					type="button"
					onClick={() => setSettingsOpen(true)}
					className="rounded bg-blue-500 px-4 py-1 text-sm text-white hover:bg-blue-600"
				>
					設定
				</button>
			</header>

			<main className="flex w-full flex-1 items-center justify-center">
				{ready && (
					<SpectrumCanvas
						width={canvasSize.width}
						height={canvasSize.height}
						deviceId={config.deviceId}
					/>
				)}
			</main>

			<SettingsDialog
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
				onApply={(newConfig) => setConfig(newConfig)}
			/>
		</div>
	);
}
