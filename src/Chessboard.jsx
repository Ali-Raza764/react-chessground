import React, { useEffect, useRef, useState } from "react";
import { Chessground as NativeChessground } from "chessground";
import { Chess } from "chess.js";
import "~/chessground/assets/chessground.base.css";
import "~/chessground/assets/chessground.brown.css";
import "~/chessground/assets/chessground.cburnett.css";
import useSound from "./useSound";

const Chessboard = ({ initialFen, orientation, onMove }) => {
  const chessgroundRef = useRef(null);
  const apiRef = useRef(null);
  const [chess] = useState(new Chess(initialFen));
  const playSound = useSound();

  const handleSelected = (key) => {
    const dests = new Map();
    const moves = chess.moves({ square: key, verbose: true });
    const targetSquares = moves.map((move) => move.to);
    dests.set(key, targetSquares);
    if (apiRef.current) {
      apiRef.current.set({
        movable: {
          dests: dests,
        },
      });
    }
  };
  useEffect(() => {
    if (chessgroundRef.current && !apiRef.current) {
      apiRef.current = NativeChessground(chessgroundRef.current, {
        fen: initialFen,
        orientation,
        coordinates: false,
        events: {
          move: handleMove,
          select: handleSelected,
        },
        movable: {
          showDests: true,
        },
        highlight: {
          lastMove: true,
          check: true,
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
  }, []);

  function handleMove(orig, dest, piece) {
    try {
      const move = chess.move({ from: orig, to: dest, promotion: "q" });
      const side = chess.turn() === "w" ? "white" : "black";

      if (move) {
        apiRef.current.set({
          fen: chess.fen(),
          turnColor: side,
          check: chess.isCheck() && side,
          movable: {
            color: side,
          },
          // lastMove: chess.history().slice(-1), //!Unstable
        });
        // Determine which sound to play
        if (move.captured) {
          // Check if the move results in a check
          const isCheckAfterMove = chess.isCheck();
          if (isCheckAfterMove) {
            playSound("check"); // Play check sound
          } else {
            playSound("capturePiece"); // Play capture sound
          }
        } else if (move.san.includes("+")) {
          playSound("check");
        } else if (chess.isGameOver()) {
          playSound("gameEnd");
        } else if (move.san === "O-O" || move.san === "O-O-O") {
          playSound("castle");
        } else {
          playSound("movePiece");
        }
        onMove(move.from, move.to, chess.fen());
      }
    } catch (error) {
      apiRef.current.set({
        fen: chess.fen(),
        turnColor: chess.turn() === "w" ? "white" : "black",
        movable: {
          color: chess.turn() === "w" ? "white" : "black",
        },
        // lastMove: chess.history().slice(-1),
      });
    }
  }

  return (
    <div ref={chessgroundRef} style={{ width: "400px", height: "400px" }} />
  );
};

export default Chessboard;
