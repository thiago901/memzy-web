import { Game } from "./game";
import { Card } from "./card";
import { Player } from "./player";

function fixedCards(): Card[] {
  return [
    { id: "1", value: "🍎" },
    { id: "2", value: "🍎" },
    { id: "3", value: "🍌" },
    { id: "4", value: "🍌" },
    { id: "5", value: "Q" },
    { id: "6", value: "Q" },
  ].map((c) => Card.create(c.id, c.value));
}
const player1 = Player.create("player1", "Player 1");
const player2 = Player.create("player2", "Player 2");

function log(game: Game, label: string) {
  console.log(`\n=== ${label} ===`);
  console.log("Status:", game.status);
  console.log("Turn:", game.turn);
  console.log(
    "Players:",
    Object.entries(game.players).map(([id, p]) => ({
      id,
      score: p.score,
      combo: p.combo,
    })),
  );
}

// 🚀 fluxo completo
let game = Game.create("room-1", player1);
log(game, "Created");

game = game.addPlayer(player2);
log(game, "Second player joined");

game = game.start(fixedCards());
log(game, "Game started");

// p1 acerta 🍎
game = game.play("p1", "1");
game = game.play("p1", "2");
log(game, "p1 matched 🍎");

// p1 Erra
game = game.play("p1", "3");
game = game.play("p1", "6");
log(game, "p1 miss 🍌");

// p2 acerta 🍌
game = game.play("p2", "3");
game = game.play("p2", "4");
log(game, "p2 matched 🍌");

// p2 acerta
game = game.play("p2", "5");
game = game.play("p2", "6");
log(game, "p2 matched");

// aqui o board acabou → finished
log(game, "Game finished");
