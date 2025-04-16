"use client";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (config: {
    deviceId: string;
    baseFreq: number;
    tuningSystem: string;
  }) => void;
}

export default function SettingsDialog({ open, onClose, onApply }: Props) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [baseFreq, setBaseFreq] = useState(442);
  const [tuningSystem, setTuningSystem] = useState("equal");

  useEffect(() => {
    if (!open) return;

    navigator.mediaDevices.enumerateDevices().then((allDevices) => {
      const audioIn = allDevices.filter((d) => d.kind === "audioinput");
      setDevices(audioIn);
      if (audioIn.length && !selectedDeviceId) {
        setSelectedDeviceId(audioIn[0].deviceId);
      }
    });
  }, [open, selectedDeviceId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 font-bold text-xl">設定</h2>

        {/* マイクデバイス */}
        <div className="mb-4">
          <label className="mb-1 block font-medium text-sm">
            マイクデバイス
            <select
              className="w-full rounded border border-gray-300 px-2 py-1"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `マイク (${device.deviceId.slice(0, 5)}…)`}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 基準周波数 */}
        <div className="mb-4">
          <label className="mb-1 block font-medium text-sm">
            基準周波数 (Hz)
            <input
              type="number"
              min={430}
              max={450}
              step={0.1}
              className="w-full rounded border border-gray-300 px-2 py-1"
              value={baseFreq}
              onChange={(e) => setBaseFreq(Number(e.target.value))}
            />
          </label>
        </div>

        {/* 音律 */}
        <div className="mb-6">
          <label className="mb-1 block font-medium text-sm">
            音律
            <select
              className="w-full rounded border border-gray-300 px-2 py-1"
              value={tuningSystem}
              onChange={(e) => setTuningSystem(e.target.value)}
            >
              <option value="equal">平均律（Equal temperament）</option>
              <option value="just">純正律（Just intonation）</option>
            </select>
          </label>
        </div>

        {/* ボタン */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded bg-gray-200 px-4 py-1 hover:bg-gray-300"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
            onClick={() => {
              onApply({
                deviceId: selectedDeviceId,
                baseFreq,
                tuningSystem,
              });
              onClose();
            }}
          >
            適用
          </button>
        </div>
      </div>
    </div>
  );
}
