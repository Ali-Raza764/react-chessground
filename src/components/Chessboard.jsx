import React, { useEffect, useRef, useState } from "react";
import { Chessground as NativeChessground } from "chessground";
import "../assets/board/chess.css";
import "../assets/board/theme.css";
import PromotionDialog from "./PromotionDialog";

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
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);

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
          color: !allowMoveOpponentPieces ? orientation : "both",
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

  const handleMove = (orig, dest, capturedPiece) => {
    const piece = chess.get(orig);
    const isPromotion =
      piece && piece.type === "p" && (dest[1] === "8" || dest[1] === "1");

    if (isPromotion) {
      setPendingMove({ from: orig, to: dest });
      setPromotionDialogOpen(true);
    } else {
      makeMove(orig, dest);
    }
  };

  const makeMove = (from, to, promotion) => {
    try {
      const move = chess.move({ from, to, promotion: promotion || "q" });
      if (move) {
        updateChessboardState(move);
        onMove(move);
      }
    } catch (error) {
      resetChessboardState();
    }
  };

  const handlePromotion = (promotionPiece) => {
    console.log(promotionPiece);

    if (pendingMove) {
      makeMove(pendingMove.from, pendingMove.to, promotionPiece);
    }
    setPromotionDialogOpen(false);
    setPendingMove(null);
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
      <button onClick={toggleTheme} className="theme-toggle-button p-2 border rounded-md m-4">
        Toggle Theme
      </button>
      <PromotionDialog
        isOpen={promotionDialogOpen}
        onClose={() => {
          setPromotionDialogOpen(false);
          resetChessboardState();
        }}
        onPromote={handlePromotion}
        color={chess.turn()}
      />
    </div>
  );
};

export default Chessboard;
