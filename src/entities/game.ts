import { Board } from "./board";
import type { Card } from "./card";
import { Player, type PlayerProps } from "./player";

export type GameStatus = "init" | "waiting" | "playing" | "finished";

export type GameProps = {
  id: string;
  roomId: string;
  code?: string;
  playersOrder: string[];
  players: Record<string, Player>;
  turn: string;
  ownerId: string;
  status: GameStatus;
  board: Board;
};

export class Game {
  private constructor(private readonly props: GameProps) {}

  get turn() {
    return this.props.turn;
  }
  get players() {
    return this.props.players;
  }
  get status() {
    return this.props.status;
  }
  get cards() {
    return this.props.board.cards;
  }
  get roomId() {
    return this.props.roomId;
  }
  get ownerId() {
    return this.props.ownerId;
  }
  get board() {
    return this.props.board;
  }
  get playersOrder() {
    return this.props.playersOrder;
  }
  get code() {
    return this.props.code;
  }
  static create(roomId: string, player: Player, code?: string) {
    return new Game({
      id: roomId,
      roomId,
      playersOrder: [player.id],
      players: {
        [player.id]: player,
      },
      turn: player.id,
      ownerId: player.id,
      status: "init",
      board: Board.empty(),
      code,
    });
  }
  static instance(game: GameProps) {
    return new Game({
      ...game,
      board:
        game.board && Board.instance(game.board.cards, game.board.selectedIds),
      players: Object.fromEntries(
        Object.entries(game.players).map(([id, player]) => [
          id,
          Player.instance(player as unknown as PlayerProps),
        ]),
      ),
    });
  }

  addPlayer(player: Player) {
    if (this.props.players[player.id]) return this;

    if (Object.keys(this.props.players).length >= 2) {
      throw new Error("Sala cheia");
    }
    const playersOrder = [...this.props.playersOrder, player.id];
    return new Game({
      ...this.props,
      playersOrder,
      status: playersOrder.length >= 2 ? "waiting" : this.props.status,
      players: {
        ...this.props.players,
        [player.id]: player,
      },
    });
  }

  start(cards: Card[]) {
    if (this.props.status !== "waiting") {
      throw new Error("Game is not ready to start");
    }

    return new Game({
      ...this.props,
      status: "playing",
      board: Board.start(cards),
      turn: this.props.playersOrder[0],
    });
  }

  canPlay(playerId: string) {
    return this.props.status === "playing" && this.props.turn === playerId;
  }

  play(playerId: string, cardId: string) {
    if (!this.canPlay(playerId)) {
      throw new Error("Not your turn");
    }
    const isLocked = this.props.board.selectedIds.length === 2;
    if (isLocked) return this;
    const boardAfterFlip = this.props.board.flip(cardId);

    return new Game({
      ...this.props,
      board: boardAfterFlip,
    });
  }
  resolveTurn(playerId: string) {
    const board = this.props.board;

    if (board.selectedIds.length !== 2) {
      return this;
    }

    const [a, b] = board.selectedIds;
    const cardA = board.cards.find((c) => c.id === a)!;
    const cardB = board.cards.find((c) => c.id === b)!;

    const isMatch = cardA.value === cardB.value;
    const resolvedBoard = board.resolve();

    const currentPlayer = this.props.players[playerId];
    const updatedPlayer = isMatch
      ? currentPlayer.onMatch()
      : currentPlayer.onMiss();

    const isFinished = resolvedBoard.isFinished();

    return new Game({
      ...this.props,
      board: resolvedBoard,
      players: {
        ...this.props.players,
        [playerId]: updatedPlayer,
      },
      status: isFinished ? "finished" : this.props.status,
      turn: isMatch && !isFinished ? this.props.turn : this.nextPlayer(),
    });
  }

  private nextPlayer() {
    const idx = this.props.playersOrder.indexOf(this.props.turn);
    return this.props.playersOrder[(idx + 1) % this.props.playersOrder.length];
  }

  toJSON() {
    console.log("GAME JSON CHMOU");

    return {
      ...this.props,
      board: this.props.board ? this.props.board.toJSON() : Board.empty(),
      players: Object.fromEntries(
        Object.entries(this.players).map(([id, player]) => [
          id,
          player.toJSON(),
        ]),
      ),
    };
  }
}
