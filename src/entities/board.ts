import { Card, type CardProps, CARDS_VALUES } from "./card";

export class Board {
  private constructor(readonly cards: Card[], readonly selectedIds: string[]) {}

  static empty() {
    return new Board([], []);
  }

  static start(cards: Card[]) {
    return new Board(cards, []);
  }
  static instance(cards: CardProps[], selectedIds: string[]) {
    return new Board(
      cards.map((card) => Card.instance(card)),
      selectedIds || [],
    );
  }
  toJSON() {
    console.log("Board JSON CHMOU");
    return {
      cards: this.cards.map((card) => card.toJSON()),
      selectedIds: this.selectedIds || [],
    };
  }

  flip(cardId: string) {
    if (this.selectedIds.includes(cardId)) return this;

    const cards = this.cards.map((card) =>
      card.id === cardId ? card.flip() : card,
    );

    const selectedIds = [...this.selectedIds, cardId];
    return new Board(cards, selectedIds);
  }

  resolve() {
    if (this.selectedIds.length !== 2) return this;

    const [a, b] = this.selectedIds;
    const cardA = this.cards.find((c) => c.id === a)!;
    const cardB = this.cards.find((c) => c.id === b)!;

    if (cardA.value === cardB.value) {
      return new Board(
        this.cards.map((c) => (c.id === a || c.id === b ? c.match() : c)),
        [],
      );
    }

    return new Board(
      this.cards.map((c) =>
        c.id === a || c.id === b ? Card.create(c.id, c.value) : c,
      ),
      [],
    );
  }
  isFinished() {
    return this.cards.every((c) => c.matched);
  }

  static generateCards(size?: number): Card[] {
    const totalCards = size ? CARDS_VALUES.slice(0, size) : CARDS_VALUES;
    const cards = [...totalCards, ...totalCards].map((value) =>
      Card.create(crypto.randomUUID(), value),
    );

    return cards.sort(() => Math.random() - 0.5);
  }
}
