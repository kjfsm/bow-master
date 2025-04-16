"use client";

import Border from "@/components/Border";
import Settings from "@/components/Settings";
import SpectrumCanvas from "@/components/SpectrumCanvas";
import { useState } from "react";

export type Config = {
  deviceId: string;
  baseFreq: number;
  tuningSystem: string;
};

export default function Home() {
  const [config, setConfig] = useState<Config>({
    deviceId: "",
    baseFreq: 442,
    tuningSystem: "just",
  });

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* ヘッダー */}
      <Border className="border-red-400">
        <header className="sticky top-0 z-10 w-full border-b bg-white px-4 py-2 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-bold text-xl">バイオリン音色スペクトラム</h1>
          </div>
        </header>
      </Border>
      {/* メインコンテンツ */}
      <Border className="border-blue-400">
        <Settings config={config} setConfig={setConfig} />
        <main className="h-full w-full">
          <SpectrumCanvas
            deviceId={config.deviceId}
            baseFreq={config.baseFreq}
          />
        </main>
      </Border>
    </div>
  );
}
