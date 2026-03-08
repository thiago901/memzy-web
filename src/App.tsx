import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { onDisconnect, onValue, ref, set } from "firebase/database";
import { auth, rtdb } from "./services/firebase";

import { ScoreCard } from "./components/score";
import { Game } from "./entities/game";
import { Board } from "./components/board";
import { signInAnonymously } from "firebase/auth";

export function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const guestIdRef = useRef<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const roomListenerRef = useRef<(() => void) | null>(null);

  // 1️⃣ Cria sessão guest

  useEffect(() => {
    if (guestIdRef.current) {
      console.log("ja tenho um guest");

      return;
    }
    console.log("Não tenho um guest");
    // Faz o login silencioso
    signInAnonymously(auth)
      .then(() => {
        console.log("Autenticado anonimamente!");

        // Só depois de autenticar, você executa a lógica de criar a sessão
        const id = uuidv4();
        guestIdRef.current = id;
        setGuestId(id);

        const guestRef = ref(rtdb, `guestSessions/${id}`);
        const payload = {
          status: "waiting",
          roomId: null,
          createdAt: Date.now(),
          expiresAt: Date.now() + 5 * 60 * 1000,
        };

        set(guestRef, payload);

        onDisconnect(guestRef).remove();
      })
      .catch((error) => {
        console.error("Erro ao autenticar:", error);
      });
  }, []);

  // 2️⃣ Escuta quando o celular conectar uma sala
  useEffect(() => {
    if (!guestId) return;

    const guestRef = ref(rtdb, `guestSessions/${guestId}`);

    return onValue(guestRef, (snap) => {
      const data = snap.val();
      if (!data?.roomId) return;

      if (data.roomId !== roomId) {
        setRoomId(data.roomId);
      }
    });
  }, [roomId, guestId]);

  // 3️⃣ Replica o jogo (read-only)
  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(rtdb, `privateRooms/rooms/${roomId}`);

    if (roomListenerRef.current) {
      roomListenerRef.current();
    }

    const unsub = onValue(roomRef, (snap) => {
      if (!snap.exists()) return;
      setGame(Game.instance(snap.val()));
    });

    roomListenerRef.current = unsub;

    return () => unsub();
  }, [roomId]);

  console.log("roomId", roomId);

  // 🎨 UI
  if (!roomId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
        <h1 className="text-2xl font-bold">📺 Modo Espectador</h1>

        {guestId && (
          <>
            <QRCode value={guestId} size={240} bgColor="#000" fgColor="#fff" />
            <p className="text-gray-400 text-sm">
              Escaneie com o celular para espelhar a partida
            </p>
          </>
        )}
      </div>
    );
  }

  if (!game) {
    return <div className="text-white text-center">Carregando partida...</div>;
  }

  return (
    <div className="h-dvh flex flex-col bg-zinc-900 overflow-hidden">
      {/* TOP BAR */}
      <div className="flex items-center justify-center px-4 pt-4">
        <div className="flex justify-center">
          <ScoreCard
            homeTeam={{
              id: game.players[game.playersOrder[0]].id,
              comboCount: game.players[game.playersOrder[0]].combo,
              logo: "",
              name: game.players[game.playersOrder[0]].name || "",
              score: game.players[game.playersOrder[0]].score,
            }}
            awayTeam={{
              id: game.players[game.playersOrder[1]].id,
              comboCount: game.players[game.playersOrder[1]].combo,
              logo: "",
              name: game.players[game.playersOrder[1]].name || "",
              score: game.players[game.playersOrder[1]].score,
            }}
            turn={game.turn}
          />
        </div>
      </div>

      {/* BOARD */}
      <div className="flex-1 px-4 py-3 overflow-hidden">
        <Board cards={game.cards} flipCard={() => {}} />
      </div>
    </div>
  );
}
