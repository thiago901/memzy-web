export type SoloMatch = {
  id: string;
  date: number;
  errors: number;
  duration: number; // ms
  moves: number;
};

export type SoloStats = {
  totalMatches: number;
  totalTime: number;
};

type StatusVsMatch = "WINNER" | "DEFEAT" | "DRAW";
export type VsMatch = {
  id: string;
  player1: {
    name: string;
    points: number;
    winner: StatusVsMatch;
  };
  player2: {
    name: string;
    points: number;
    winner: StatusVsMatch;
  };
  duration: number;
};
