"use client";

import type { Config } from "@/components/SpectrumVisualizer";
import { useEffect, useState } from "react";

interface Props {
  config: Config;
  setConfig: (config: Config) => void;
}

export default function Settings({ config, setConfig }: Props) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((allDevices) => {
      const audioIn = allDevices.filter((d) => d.kind === "audioinput");
      setDevices(audioIn);
      if (audioIn.length && !config.deviceId) {
        const newConfig = {
          ...config,
          deviceId: audioIn[0].deviceId,
        };
        setConfig(newConfig);
      }
    });
  }, [config, setConfig]);

  return (
    <div className="z-10 flex w-full flex-wrap items-center gap-4 bg-white px-4 py-2 text-sm shadow-md">
      {/* マイク */}
      <label className="flex items-center gap-1">
        マイク:
        <select
          className="rounded border border-gray-300 px-2 py-1"
          value={config.deviceId}
          onChange={(e) => {
            const deviceId = e.target.value;
            const newConfig = {
              ...config,
              deviceId: deviceId,
            };
            setConfig(newConfig);
          }}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `マイク (${device.deviceId.slice(0, 5)}…)`}
            </option>
          ))}
        </select>
      </label>

      {/* 基準周波数 */}
      <label className="flex items-center gap-1">
        基準周波数:
        <input
          type="number"
          min={430}
          max={450}
          step={0.1}
          className="w-20 rounded border border-gray-300 px-2 py-1"
          value={config.baseFreq}
          onChange={(e) => {
            const baseFreq = Number.parseFloat(e.target.value);
            const newConfig = {
              ...config,
              baseFreq: baseFreq,
            };
            setConfig(newConfig);
          }}
        />
        Hz
      </label>

      {/* 音律 */}
      <label className="flex items-center gap-1">
        音律:
        <select
          className="rounded border border-gray-300 px-2 py-1"
          value={config.tuningSystem}
          onChange={(e) => {
            const tuningSystem = e.target.value;
            const newConfig = {
              ...config,
              tuningSystem: tuningSystem,
            };
            setConfig(newConfig);
          }}
        >
          <option value="just">純正律</option>
          <option value="equal">平均律</option>
        </select>
      </label>
    </div>
  );
}
