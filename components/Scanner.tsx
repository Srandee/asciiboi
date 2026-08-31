"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type Props = {
  onDetect: (payload: string, source: "camera" | "image") => void;
  paused?: boolean;
};

export function Scanner({ onDetect, paused }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDetectRef = useRef(onDetect);
  const pausedRef = useRef(paused);
  const [camError, setCamError] = useState<string | null>(null);

  onDetectRef.current = onDetect;
  pausedRef.current = paused;

  const readFile = useCallback(async (file: File) => {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bitmap, 0, 0);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(image.data, image.width, image.height);
    if (code?.data) onDetectRef.current(code.data, "image");
    else setCamError("No QR found in that photo.");
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let stream: MediaStream | undefined;
    let raf = 0;
    let cancelled = false;

    const videoEl = video;
    const canvasEl = canvas;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        videoEl.srcObject = stream;
        await videoEl.play();
        const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const tick = () => {
          if (cancelled) return;
          if (!pausedRef.current && videoEl.readyState >= 2 && videoEl.videoWidth) {
            canvasEl.width = videoEl.videoWidth;
            canvasEl.height = videoEl.videoHeight;
            ctx.drawImage(videoEl, 0, 0);
            const image = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
            const code = jsQR(image.data, image.width, image.height);
            if (code?.data) onDetectRef.current(code.data, "camera");
          }
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setCamError("Camera is blocked here. Type a code or upload a QR photo.");
      }
    }

    start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-black">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="viewfinder h-44 w-44 rounded-2xl" />
        </div>
      </div>
      {camError ? <p className="text-center text-xs text-mist">{camError}</p> : null}
      <label className="block cursor-pointer rounded-full bg-bark px-4 py-3 text-center text-sm text-paper ring-1 ring-white/10">
        Upload a QR photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void readFile(file);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
