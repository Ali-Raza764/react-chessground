import React, { useState, useEffect } from "react";
import Chessground from "@react-chess/chessground";
import { Chess } from "chess.js";
import "../chess.css";

const BasicChessBoard = () => {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState(null);

  useEffect(() => {
    // Update the board when the component mounts
    setFen(chess.fen());
  }, [chess]);

  const onMove = (from, to) => {
    try {
      const move = chess.move({ from, to, promotion: "q" }); // 'q' for auto-queen promotion
      if (move) {
        setFen(chess.fen());
        setLastMove([from, to]);
        return true;
      }
    } catch (error) {
      console.error("Invalid move:", error);
    }
    return false;
  };

  return (
    <Chessground
      width={500}
      height={500}
      fen={fen}
      turnColor={chess.turn() === "w" ? "white" : "black"}
      movable={{
        free: false,
        color: chess.turn() === "w" ? "white" : "black",
        // dests: getDests(chess),
        events: {
          after: onMove,
        },
      }}
      lastMove={lastMove}
    />
  );
};

export default BasicChessBoard;
