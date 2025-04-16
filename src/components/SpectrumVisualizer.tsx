"use client";

import Settings from "@/components/Settings";
import SpectrumCanvas from "@/components/SpectrumCanvas";
import { useEffect, useState } from "react";

export type Config = {
  deviceId: string;
  baseFreq: number;
  tuningSystem: string;
};

const defaultConfig: Config = {
  deviceId: "default",
  baseFreq: 442,
  tuningSystem: "just",
};

export default function SpectrumVisualizer() {
  const [config, setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    const storedConfig = localStorage.getItem("config");
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      setConfig((prev) => ({
        ...prev,
        ...parsedConfig,
      }));
    } else {
      console.log("No config found in localStorage, using default config.");
    }
  }, []);

  useEffect(() => {
    console.log("Config updated, saving to localStorage:", config);
    localStorage.setItem("config", JSON.stringify(config));
  }, [config]);

  return (
    <div className="">
      <Settings config={config} setConfig={setConfig} />
      <main className="">
        <SpectrumCanvas deviceId={config.deviceId} baseFreq={config.baseFreq} />
      </main>
    </div>
  );
}
