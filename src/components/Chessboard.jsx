import React, { useEffect, useRef, useState } from "react";
import { Chessground as NativeChessground } from "chessground";
import "../assets/board/chess.css";
import "../assets/board/theme.css";

const Chessboard = ({
  initialFen,
  orientation,
  onMove,
  chess,
  allowMoveOpponentPieces,
  customArrows,
}) => {
  const chessgroundRef = useRef(null);
  const apiRef = useRef(null);
  const [theme, setTheme] = useState("theme-green");

  useEffect(() => {
    //! Initialize Chessground Configration
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
          color: !allowMoveOpponentPieces
            ? orientation === "white" && "white"
            : "both",
          showDests: true,
        },
        highlight: {
          lastMove: true,
          check: true,
        },
        drawable: {
          autoShapes: [],
        },
      });
    }

    //* Update the board state when the initialFen or the custom arrows change
    apiRef.current.set({
      fen: initialFen,
    });

    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
  }, [initialFen]);

  useEffect(() => {
    apiRef.current.set({
      drawable: {
        autoShapes: customArrows,
      },
    });
  }, [customArrows]);

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

  const handleMove = (orig, dest, piece) => {
    try {
      const move = chess.move({
        from: orig,
        to: dest,
        promotion: "q",
      });
      if (move) {
        updateChessboardState(move);
        onMove(move);
      }
    } catch (error) {
      resetChessboardState();
    }
  };

  const updateChessboardState = (move) => {
    const isCheck = chess.isCheck();
    const side = chess.turn() === "w" ? "white" : "black";

    apiRef.current.set({
      fen: chess.fen(),
      turnColor: side,
      check: isCheck ? side : false,
    });
  };

  const resetChessboardState = () => {
    const side = chess.turn() === "w" ? "white" : "black";
    apiRef.current.set({
      fen: chess.fen(),
      turnColor: side,
    });
  };

  const toggleTheme = () => {
    if (theme === "theme-green") {
      setTheme("theme-blue");
    } else if (theme === "theme-blue") {
      setTheme("theme-red");
    } else if (theme === "theme-red") {
      setTheme("theme-brown");
    } else {
      setTheme("theme-green");
    }
  };

  return (
    <div className={`chessboard-container ${theme}`}>
      <div ref={chessgroundRef} style={{ width: "500px", height: "500px" }} />
      <button onClick={toggleTheme} className="theme-toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

export default Chessboard;
