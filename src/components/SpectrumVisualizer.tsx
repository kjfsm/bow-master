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
  deviceId: "",
  baseFreq: 442,
  tuningSystem: "just",
};

export default function SpectrumVisualizer() {
  const [config, setConfig] = useState<Config>(defaultConfig);

  // 初期値をlocalStorageから取得
  // localStorageのconfigを読み、型がConfigと一致する場合のみセット
  useEffect(() => {
    const savedConfig = localStorage.getItem("config");
    if (savedConfig) {
      const parsedConfig: Config = JSON.parse(savedConfig);
      if (
        parsedConfig.deviceId &&
        parsedConfig.baseFreq &&
        parsedConfig.tuningSystem
      ) {
        setConfig(parsedConfig);
      } else {
        // localStorageのconfigが不正な場合、デフォルト値をセット
        setConfig(defaultConfig);
      }
    }
  }, []);

  useEffect(() => {
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
