'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const TOTAL_FRAMES = 120;

function getFramePath(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `/sequence/frame_${padded}_delay-0.066s.webp`;
}

interface ScrollyCanvasProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

export default function ScrollyCanvas({ heroRef }: ScrollyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Preload all frames progressively
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let cancelled = false;

    const loadImage = (index: number): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) {
            loadedImages[index] = img;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            // Trigger state update with the newly loaded image array reference
            setImages([...loadedImages]);
          }
          resolve(img);
        };
        img.onerror = () => {
          resolve(null);
        };
        img.src = getFramePath(index);
      });
    };

    const loadProgressively = async () => {
      // 1. Load frame 0 immediately to show first paint and hide blocker loader
      await loadImage(0);
      if (cancelled) return;
      setIsLoaded(true);

      // 2. Load the remaining frames in background batches of 8
      const remainingIndices = Array.from({ length: TOTAL_FRAMES - 1 }, (_, i) => i + 1);
      const batchSize = 8;
      
      for (let i = 0; i < remainingIndices.length; i += batchSize) {
        if (cancelled) break;
        const batch = remainingIndices.slice(i, i + batchSize).map((index) => loadImage(index));
        await Promise.all(batch);
      }
    };

    loadProgressively();

    return () => {
      cancelled = true;
    };
  }, []);

  // Draw frame to canvas with cover logic & fallback for missing frames
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Find the nearest loaded frame if the target frame isn't loaded yet
      let img = images[index];
      if (!img) {
        let left = index - 1;
        let right = index + 1;
        while (left >= 0 || right < TOTAL_FRAMES) {
          if (left >= 0 && images[left]) {
            img = images[left];
            break;
          }
          if (right < TOTAL_FRAMES && images[right]) {
            img = images[right];
            break;
          }
          left--;
          right++;
        }
      }

      if (!img) return; // No frames loaded at all yet

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Object-fit: cover logic
      const scale = Math.max(cw / iw, ch / ih);
      const sw = cw / scale;
      const sh = ch / scale;
      const sx = (iw - sw) / 2;
      const sy = (ih - sh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    },
    [images]
  );

  // Resize canvas to match window
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (isLoaded) {
        drawFrame(currentFrameRef.current);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, drawFrame]);

  // Draw frames on scroll (updates index and draws fallback if needed)
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const index = Math.min(Math.round(latest), TOTAL_FRAMES - 1);
    if (index !== currentFrameRef.current) {
      currentFrameRef.current = index;
      drawFrame(index);
    }
  });

  // Redraw current frame whenever the images array updates in the background
  useEffect(() => {
    if (isLoaded) {
      drawFrame(currentFrameRef.current);
    }
  }, [images, isLoaded, drawFrame]);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
      {/* Tiny progress bar at the top once the site is visible, during background buffering */}
      {isLoaded && loadProgress < 100 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${loadProgress}%`,
            height: '2px',
            background: '#ff6b35',
            zIndex: 30,
            transition: 'width 0.3s ease',
          }}
        />
      )}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0d0d',
            zIndex: 20,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#ffffff',
                marginBottom: '1rem',
              }}
            >
              LOADING {loadProgress}%
            </div>
            <div
              style={{
                width: '200px',
                height: '2px',
                background: '#333',
                borderRadius: '1px',
                overflow: 'hidden',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: `${loadProgress}%`,
                  height: '100%',
                  background: '#ff6b35',
                  borderRadius: '1px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
