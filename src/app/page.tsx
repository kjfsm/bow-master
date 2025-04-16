"use client";

import SpectrumVisualizer from "@/components/SpectrumVisualizer";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header>
        <h1 className="font-bold text-xl">バイオリン音色スペクトラム</h1>
      </header>
      <main className="grow">
        <SpectrumVisualizer />
      </main>
      <footer>
        <p className="p-4 text-center">© 2023 バイオリン音色スペクトラム</p>
      </footer>
    </div>
  );
}
