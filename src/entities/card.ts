export type CardProps = {
  id: string;
  value: string;
  flipped: boolean;
  matched: boolean;
};
export const CARDS_VALUES = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍒",
  "🍍",
  "🥝",
  "🍑",
  "🍉",
  "🥑",
  "🍕",
  "🌭",
  "🍘",
  "🍥",
  "🍩",
  "🐷",
  "🐓",
  "🦊",
  "🐵",
  "🐨",
  "🐳",
  "🦂",
  "🐞",
  "🐜",
  "🐝",
  "🦐",
  "🐫",
  "🐘",
  "🦁",
  "🐶",
];
export class Card {
  private constructor(private readonly props: CardProps) {}

  static create(id: string, value: string) {
    return new Card({ id, value, flipped: false, matched: false });
  }
  static instance(card: CardProps) {
    return new Card(card);
  }

  get id() {
    return this.props.id;
  }

  get value() {
    return this.props.value;
  }

  get flipped() {
    return this.props.flipped;
  }

  get matched() {
    return this.props.matched;
  }

  flip() {
    if (this.flipped || this.matched) return this;
    return new Card({ ...this.props, flipped: true });
  }

  match() {
    return new Card({ ...this.props, matched: true });
  }

  toJSON() {
    return this.props;
  }
}
