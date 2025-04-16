export async function getAudioStream(deviceId: string): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
      },
    });
    return stream;
  } catch (error) {
    console.error("Error accessing audio stream:", error);
    throw error;
  }
}
