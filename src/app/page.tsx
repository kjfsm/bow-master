'use client';
import SpectrogramCanvas from '@/components/SpectrogramCanvas';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <SpectrogramCanvas />
    </main>
  );
}
