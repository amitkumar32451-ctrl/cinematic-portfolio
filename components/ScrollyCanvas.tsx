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

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let cancelled = false;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) {
            loadedImages[index] = img;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            if (loadedCount === TOTAL_FRAMES) {
              setImages(loadedImages);
              setIsLoaded(true);
            }
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = getFramePath(index);
      });
    };

    // Load frames in batches of 10 for better performance
    const loadInBatches = async () => {
      const batchSize = 10;
      for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
        if (cancelled) break;
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }
    };

    loadInBatches();

    return () => {
      cancelled = true;
    };
  }, []);

  // Draw frame to canvas with cover logic
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !images[index]) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = images[index];
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

  // Draw frames on scroll
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const index = Math.min(Math.round(latest), TOTAL_FRAMES - 1);
    if (index !== currentFrameRef.current && images[index]) {
      currentFrameRef.current = index;
      drawFrame(index);
    }
  });

  // Draw first frame when loaded
  useEffect(() => {
    if (isLoaded && images[0]) {
      drawFrame(0);
    }
  }, [isLoaded, images, drawFrame]);

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
