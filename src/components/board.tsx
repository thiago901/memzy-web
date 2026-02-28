import type { MemoryCard } from "../types/types";

type BoardProps = {
  cards: MemoryCard[];
  flipCard: (id: string) => void;
};
import { useLayoutEffect, useRef, useState } from "react";
import { Card } from "./card";

export function Board({ cards, flipCard }: BoardProps) {
  // Exemplo simples (pode melhorar depois)
  const getGrid = (total: number) => {
    if (total <= 12) return { cols: 3, rows: 4 };
    if (total <= 16) return { cols: 4, rows: 4 };
    if (total <= 20) return { cols: 4, rows: 5 };
    if (total <= 24) return { cols: 4, rows: 6 };
    if (total <= 30) return { cols: 5, rows: 6 };
    return { cols: 6, rows: 7 };
  };
  const ref = useRef<HTMLDivElement>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  const { cols, rows } = getGrid(cards.length);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const gap = 8; // px
  const cardWidth = (width - gap * (cols - 1)) / cols;
  const cardHeight = (height - gap * (rows - 1)) / rows;

  // 🔥 regra de ouro
  const cardSize = Math.min(cardWidth, cardHeight);

  return (
    <div ref={ref} className="h-full w-full flex items-center justify-center">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cardSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cardSize}px)`,
          gap,
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            flipped={card.flipped}
            value={card.value}
            handleFlipCard={() => flipCard(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
