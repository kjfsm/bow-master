"use client";

import SpectrumVisualizer from "@/components/SpectrumVisualizer";

export default function Home() {
  return (
    <div className="">
      {/* ヘッダー */}
      <header className="">
        <div className="">
          <h1 className="font-bold text-xl">バイオリン音色スペクトラム</h1>
        </div>
      </header>
      {/* メインコンテンツ */}
      <SpectrumVisualizer />
    </div>
  );
}
