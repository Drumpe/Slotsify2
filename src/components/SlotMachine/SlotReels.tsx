import { useEffect, useRef, useState } from 'react';
import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';
import { useGame } from '../../context/GameContext';

const NUMBER_OF_REELS = 3;
const REEL_WIDTH = 80;    // logical units
const SYMBOL_SIZE = 80;   // logical units
const SPIN_SPEED = 0.5;
const symbols = Array.from({ length: 9 }, (_, i) => `/images/symbol_${i}.webp`);
const SYMBOLS_LEN = symbols.length;
const BOUNCE_EFFECT = 0.12;
const REEL_SPACING = 10;  // logical units

type ReelState = {
  container: Container;
  symbols: Sprite[];
  position: number;
};

function mod(n: number, m: number) { return ((n % m) + m) % m; }

function easeOutElastic(t: number): number {
  const p = BOUNCE_EFFECT;
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
}

function updateReelSpritesPosition(reel: ReelState) {
  for (let j = 0; j < reel.symbols.length; j++) {
    const sprite = reel.symbols[j];
    sprite.y = ((j + reel.position) % SYMBOLS_LEN) * SYMBOL_SIZE;
    if (sprite.y >= 4 * SYMBOL_SIZE) {
      sprite.y -= SYMBOLS_LEN * SYMBOL_SIZE;
    }
  }
}

function tweenTo(reel: ReelState, target: number, duration: number, onComplete?: () => void) {
  const start = reel.position;
  const change = target - start;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    reel.position = start + change * easeOutElastic(t);
    updateReelSpritesPosition(reel);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      reel.position = Math.round(target) % SYMBOLS_LEN;
      updateReelSpritesPosition(reel);
      onComplete?.();
    }
  }
  requestAnimationFrame(step);
}

export default function SlotReels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const { spinResult, isSpinning, setIsTweening } = useGame();
  const isSpinningRef = useRef(isSpinning);
  const [reels, setReels] = useState<ReelState[]>([]);
  const reelsStoppedCount = useRef(0);

  // logical base dimensions (don’t change on resize)
  const BASE_WIDTH = REEL_WIDTH * NUMBER_OF_REELS + REEL_SPACING * (NUMBER_OF_REELS + 1);
  const BASE_HEIGHT = SYMBOL_SIZE * 3;

  useEffect(() => { isSpinningRef.current = isSpinning; }, [isSpinning]);

  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      await Assets.load(symbols);
      if (destroyed) return;

      const app = new Application();
      await app.init({
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        backgroundColor: 0x000000,
        antialias: true,
        autoDensity: true,
        resolution: Math.max(window.devicePixelRatio, 1),
      });

      appRef.current = app;

      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(app.canvas);

      // Build reels in logical space
      const reelsArr: ReelState[] = [];
      for (let i = 0; i < NUMBER_OF_REELS; i++) {
        const reelContainer = new Container();
        reelContainer.x = i * (REEL_WIDTH + REEL_SPACING) + REEL_SPACING;
        app.stage.addChild(reelContainer);

        const reel: ReelState = { container: reelContainer, symbols: [], position: 0 };

        for (let j = 0; j < symbols.length; j++) {
          const texture = Assets.get(symbols[j]);
          const sprite = new Sprite(texture);
          sprite.y = j * SYMBOL_SIZE;

          // Scale to logical cell size once; later we scale the whole stage.
          sprite.scale.set(
            REEL_WIDTH / sprite.width,
            SYMBOL_SIZE / sprite.height
          );

          reelContainer.addChild(sprite);
          reel.symbols.push(sprite);
        }
        reelsArr.push(reel);
      }
      setReels(reelsArr);

      // Mask and win line in logical coordinates
      const outerMask = new Graphics().rect(0, SYMBOL_SIZE / 2, BASE_WIDTH, SYMBOL_SIZE * 2).fill(0x000000);
      app.stage.addChild(outerMask);
      app.stage.mask = outerMask;

      const winLine = new Graphics()
        .moveTo(0, SYMBOL_SIZE * 1.5)
        .lineTo(BASE_WIDTH, SYMBOL_SIZE * 1.5)
        .stroke({ width: 1, color: 0xff0000 });
      app.stage.addChild(winLine);

      // Ticker uses logical units; scaling only affects rendering
      app.ticker.add(() => {
        if (!isSpinningRef.current) return;
        for (const reel of reelsArr) {
          reel.position += SPIN_SPEED;
          updateReelSpritesPosition(reel);
        }
      });

      // Resize handling
      const resize = () => {
        if (!containerRef.current || !appRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;

        // If container has no height, maintain base aspect by deriving height
        const targetW = clientWidth || BASE_WIDTH;
        const aspect = BASE_WIDTH / BASE_HEIGHT;
        const targetH = clientHeight || Math.round(targetW / aspect);

        // Fit stage with letterboxing
        const scale = Math.min(targetW / BASE_WIDTH, targetH / BASE_HEIGHT);
        app.renderer.resize(targetW, targetH);
        app.stage.scale.set(scale, scale);

        // Center within the canvas
        const offsetX = (targetW - BASE_WIDTH * scale) / 2;
        const offsetY = (targetH - BASE_HEIGHT * scale) / 2;
        app.stage.position.set(offsetX, offsetY);
      };

      // Observe container size
      const ro = new ResizeObserver(() => {
        // rAF to collapse rapid size changes
        requestAnimationFrame(resize);
      });
      ro.observe(containerRef.current);
      resizeObserverRef.current = ro;

      // Also react to DPR changes (zoom)
      const onWindowResize = () => {
        if (!appRef.current) return;
        appRef.current.renderer.resolution = Math.max(window.devicePixelRatio, 1);
        requestAnimationFrame(resize);
      };
      window.addEventListener('resize', onWindowResize);

      // Initial fit
      resize();

      // Cleanup bindings on unmount
      return () => {
        window.removeEventListener('resize', onWindowResize);
      };
    };

    init();

    return () => {
      destroyed = true;
      resizeObserverRef.current?.disconnect();
      appRef.current?.destroy(true, true);
      appRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isSpinning && spinResult && reels.length > 0) {
      const loops = 2;
      const middleRowIndex = 1;

      reelsStoppedCount.current = 0;

      for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        const stopIndex = spinResult[i];
        const currentPos = reel.position;

        const currentMod = mod(currentPos, SYMBOLS_LEN);
        const desiredMod = mod(middleRowIndex - stopIndex, SYMBOLS_LEN);

        let deltaMod = mod(desiredMod - currentMod, SYMBOLS_LEN);
        if (deltaMod === 0) deltaMod = SYMBOLS_LEN;

        const delta = deltaMod + loops * SYMBOLS_LEN;
        const targetPos = currentPos + delta;

        tweenTo(reel, targetPos, 1500 + (i * 400) / SPIN_SPEED, () => {
          reelsStoppedCount.current += 1;
          if (reelsStoppedCount.current === reels.length) {
            setIsTweening(false);
          }
        });
      }
    }
  }, [isSpinning, spinResult, reels, setIsTweening]);

  // Make sure the container can actually size the canvas
  // e.g., via CSS: .slotCanvas { width: 100%; height: 100%; }
  return <div ref={containerRef} className="slotCanvas" style={{ width: '100%', height: '100%' }} />;
}
