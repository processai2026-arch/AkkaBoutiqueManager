import { useCallback, useEffect, useState } from "react";

type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};
type FsEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    const d = document as FsDoc;
    return !!(document.fullscreenElement || d.webkitFullscreenElement);
  });

  useEffect(() => {
    const onChange = () => {
      const d = document as FsDoc;
      setIsFullscreen(!!(document.fullscreenElement || d.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange as EventListener);
    };
  }, []);

  const toggle = useCallback(async () => {
    const d = document as FsDoc;
    const el = document.documentElement as FsEl;
    try {
      if (!document.fullscreenElement && !d.webkitFullscreenElement) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (d.webkitExitFullscreen) await d.webkitExitFullscreen();
      }
    } catch {
      /* user gesture / API unavailable */
    }
  }, []);

  return { isFullscreen, toggle };
}
