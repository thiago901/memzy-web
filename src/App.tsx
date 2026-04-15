import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { onDisconnect, onValue, ref, set } from "firebase/database";
import { rtdb } from "./services/firebase";

import { ScoreCard } from "./components/score";
import { Game } from "./entities/game";
import { Board } from "./components/board";

export function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const guestId = uuidv4();
  const roomListenerRef = useRef<(() => void) | null>(null);

  // 1️⃣ Inicializa a sessão Guest baseada no ID de Ambiente
  useEffect(() => {
    const guestRef = ref(rtdb, `guestSessions/${guestId}`);

    // Payload inicial
    const payload = {
      status: "waiting",
      roomId: null,
      createdAt: Date.now(),
      // expiresAt é útil se você tiver um script de limpeza no back
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    // Cria/Reseta a sessão no RTDB
    set(guestRef, payload);

    // Limpa o registro se o navegador/aba fechar
    onDisconnect(guestRef).remove();
  }, []);

  // 2️⃣ Escuta mudanças na sessão (celular vinculando uma sala)
  useEffect(() => {
    if (!guestId) return;

    const guestRef = ref(rtdb, `guestSessions/${guestId}`);

    const unsub = onValue(guestRef, (snap) => {
      const data = snap.val();
      // Só atualiza se o roomId mudar e não for nulo
      if (data?.roomId && data.roomId !== roomId) {
        setRoomId(data.roomId);
      }
    });

    return () => unsub();
  }, [guestId, roomId]);

  // 3️⃣ Replica o jogo (Read-Only)
  useEffect(() => {
    if (!roomId) return;

    // Remove listener anterior se houver troca de sala
    if (roomListenerRef.current) roomListenerRef.current();

    const roomRef = ref(rtdb, `rooms/${roomId}/game`);

    const unsub = onValue(roomRef, (snap) => {
      if (!snap.exists()) return;
      setGame(Game.instance(snap.val()));
    });

    roomListenerRef.current = unsub;
    return () => unsub();
  }, [roomId]);

  // --- RENDERS ---

  if (!roomId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
        <h1 className="text-2xl font-bold">📺 Modo Espectador</h1>
        {guestId ? (
          <>
            <div className="p-4 bg-white rounded-xl">
              <QRCode value={guestId} size={240} />
            </div>
            <p className="text-gray-400 text-sm animate-pulse">
              Escaneie com o celular para espelhar a partida
            </p>
          </>
        ) : (
          <p>Configurando ID...</p>
        )}
      </div>
    );
  }

  if (!game) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        Carregando partida...
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-center px-4 pt-4">
        <ScoreCard
          homeTeam={{
            id: game.players[game.playersOrder[0]].id,
            comboCount: game.players[game.playersOrder[0]].combo,
            logo: "",
            name: game.players[game.playersOrder[0]].name || "P1",
            score: game.players[game.playersOrder[0]].score,
          }}
          awayTeam={{
            id: game.players[game.playersOrder[1]].id,
            comboCount: game.players[game.playersOrder[1]].combo,
            logo: "",
            name: game.players[game.playersOrder[1]].name || "P2",
            score: game.players[game.playersOrder[1]].score,
          }}
          turn={game.turn}
        />
      </div>

      <div className="flex-1 px-4 py-3 overflow-hidden">
        <Board cards={game.cards} flipCard={() => {}} />
      </div>
    </div>
  );
}
