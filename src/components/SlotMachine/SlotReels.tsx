import { useEffect, useRef, useState } from 'react';
import { Application, Assets, Container, Sprite, Graphics, GraphicsContext } from 'pixi.js';
import { useGame } from '../../context/GameContext';

const REEL_WIDTH = 80;
const SYMBOL_SIZE = 80;
const SPIN_SPEED = 0.5;
const symbols = Array.from({ length: 9 }, (_, i) => `/images/symbol_${i}.webp`);
const SYMBOLS_LEN = symbols.length;
const BOUNCE_EFFECT = 0.12;
const REEL_SPACING = 10;

type ReelState = {
  container: Container;
  symbols: Sprite[];
  position: number;
};

// helper: always positive modulo
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

// Easing-funktion för en "bounce"-effekt vid stopp
function easeOutElastic(t: number): number {
  const p = BOUNCE_EFFECT;
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
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
      reel.position = Math.round(target);
      updateReelSpritesPosition(reel);
      onComplete?.();
    }
  }
  requestAnimationFrame(step);
}

function updateReelSpritesPosition(reel: any) {
  for (let j = 0; j < reel.symbols.length; j++) {
    const sprite = reel.symbols[j];

    sprite.y = ((j + reel.position) % SYMBOLS_LEN) * SYMBOL_SIZE;

    if (sprite.y >= 4 * SYMBOL_SIZE) {
      sprite.y -= SYMBOLS_LEN * SYMBOL_SIZE;
    }
  }
}

export default function SlotReels() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { spinResult, isSpinning, setIsTweening } = useGame();
  const isSpinningRef = useRef(isSpinning);
  const [reels, setReels] = useState<ReelState[]>([]);
  const appRef = useRef<Application | null>(null);

  // Sync ref for ticker use
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    const init = async () => {
      await Assets.load(symbols);

      const app = new Application();
      await app.init({
        width: REEL_WIDTH * 3 + REEL_SPACING * 4,
        height: SYMBOL_SIZE * 3,
        backgroundColor: 0x000000,
        antialias: true,
      });

      appRef.current = app;
      canvasRef.current!.innerHTML = '';
      canvasRef.current?.appendChild(app.canvas);

      const reelsArr: ReelState[] = [];

      for (let i = 0; i < 3; i++) {
        const reelContainer = new Container();
        reelContainer.x = i * (REEL_WIDTH + REEL_SPACING) + REEL_SPACING;
        app.stage.addChild(reelContainer);

        const reel: ReelState = {
          container: reelContainer,
          symbols: [],
          position: 0,
        };

        for (let j = 0; j < symbols.length; j++) {
          const texture = Assets.get(symbols[j]);
          const sprite = new Sprite(texture);
          sprite.y = j * SYMBOL_SIZE;
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


      const outerMask = new Graphics().rect(0, SYMBOL_SIZE / 2, SYMBOL_SIZE * 3 + REEL_SPACING * 4, SYMBOL_SIZE * 2).fill('blue');
      app.stage.mask = outerMask;
      const winLine = new Graphics()
        .moveTo(0, SYMBOL_SIZE * 1.5)
        .lineTo(SYMBOL_SIZE * 3 + REEL_SPACING * 4, SYMBOL_SIZE * 1.5)
        .stroke({
          width: 1,
          color: 0xff0000
        }); 
      app.stage.addChild(winLine);


      app.ticker.add(() => {
        if (!isSpinningRef.current) return;
        for (const reel of reelsArr) {
          reel.position += SPIN_SPEED;
          updateReelSpritesPosition(reel);
        }
      });
    };

    init();

    return () => {
      appRef.current?.destroy(true, true);
    };
  }, []);

  const reelsStoppedCount = useRef(0);

  useEffect(() => {
    if (!isSpinning && spinResult && reels.length === 3) {

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

        tweenTo(reel, targetPos, 1500 + i * 400 / SPIN_SPEED,
        () => {
          reelsStoppedCount.current += 1;
          if (reelsStoppedCount.current === reels.length -1) { // -1 because we wait for the second last reel to finish
            setIsTweening(false);
          }
        }
        );
        console.log(`reel ${i} final pos=${reel.position} visibleIndex=${mod(Math.floor(reel.position), SYMBOLS_LEN)}`);

      }
    }
  }, [isSpinning, spinResult, reels]);

  return <div ref={canvasRef} />;
}
