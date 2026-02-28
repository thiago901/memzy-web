export type PlayerProps = {
  id: string;
  name: string | null;
  score: number;
  combo: number;
  avatar?: string;
};

export class Player {
  private static readonly BASE_POINTS = 1;
  private static readonly MAX_COMBO = 4;

  private constructor(private readonly props: PlayerProps) {}

  static create(id: string, name: string | null, avatar?: string) {
    return new Player({
      id,
      name,
      score: 0,
      combo: 0,
      avatar,
    });
  }
  static instance(player: PlayerProps) {
    return new Player(player);
  }

  get id() {
    return this.props.id;
  }

  get score() {
    return this.props.score;
  }
  get combo() {
    return this.props.combo;
  }
  get name() {
    return this.props.name;
  }
  get avatar() {
    return this.props.avatar;
  }

  onMatch(): Player {
    const combo = Math.min(this.props.combo + 1, Player.MAX_COMBO);

    return new Player({
      ...this.props,
      combo,
      score: this.props.score + Player.BASE_POINTS * combo,
    });
  }

  onMiss(): Player {
    return new Player({
      ...this.props,
      combo: 0,
    });
  }
  toJSON() {
    console.log("PLAYER JSON CHMOU");
    return this.props;
  }
}
