import { useCallback, useEffect, useState } from "react";
import puzzlesData from "./puzzles";
import { Chess } from "chess.js";
import Chessboard from "../components/Chessboard";
import useChessSounds from "../lib/useSound";

const Puzzles = () => {
  const [puzzles, setPuzzles] = useState(puzzlesData);
  const [fen, setFen] = useState(puzzles[0].FEN);
  const [chess, setChess] = useState(new Chess(puzzles[0].FEN));
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [moveNumber, setMoveNumber] = useState(0);
  const [arrows, setArrows] = useState([]);
  const [puzzleEnd, setPuzzleEnd] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updateFlag, setUpdateFlag] = useState(0); // New state to trigger rerender

  const { handleMoveSounds } = useChessSounds(chess);

  useEffect(() => {
    const firstMove = puzzles[currentPuzzle].Moves.split(" ")[0];
    setTimeout(() => {
      try {
        const from = firstMove.slice(0, 2);
        const to = firstMove.slice(2);
        const move = chess.move({
          from,
          to,
        });
        handleMoveSounds(move);
        setFen(chess.fen());
        setMoveNumber(1);
      } catch (error) {}
    }, 1000);
  }, [currentPuzzle, puzzles]);

  const verifyMove = useCallback(
    (move) => {
      const moves = puzzles[currentPuzzle]?.Moves.split(" ") || [];
      if (move.lan === moves[moveNumber]) {
        if (moveNumber + 1 < moves.length) {
          const nextMove = moves[moveNumber + 1];
          setTimeout(() => {
            const move = chess.move({
              from: nextMove.slice(0, 2),
              to: nextMove.slice(2),
              promotion: "q",
            });
            handleMoveSounds(move, chess);
            setFen(chess.fen());
            setMoveNumber((prev) => prev + 2);
          }, 500);
        } else {
          setPuzzleEnd(true);
          setMessage("Puzzle completed!");
        }
        return true;
      }

      setError("Incorrect move");

      return false;
    },
    [currentPuzzle, chess, moveNumber, puzzles]
  );

  const handleMove = (move) => {
    setArrows([]);
    verifyMove(move);
    handleMoveSounds(move);
  };

  const loadNewPuzzle = () => {
    const nextPuzzleIndex = currentPuzzle + 1;
    const newChess = new Chess(puzzles[nextPuzzleIndex].FEN);

    // Reset all states for the new puzzle
    setCurrentPuzzle(nextPuzzleIndex);
    setChess(newChess);
    setFen(puzzles[nextPuzzleIndex].FEN);
    setMoveNumber(0);
    setPuzzleEnd(false);
    setMessage("");
    setError(""); // Clear error
    setArrows([]); // Reset any arrows drawn on the board
  };

  const retryMove = () => {
    chess.undo();
    setFen(chess.fen()); // Update the FEN to reflect the undo
    setUpdateFlag((prev) => prev + 1); // Force re-render by updating a flag
    setError("");
  };

  const getHint = () => {
    const moves = puzzles[currentPuzzle]?.Moves.split(" ") || [];
    const move = moves[moveNumber];
    const from = move.slice(0, 2);
    const to = move.slice(2);
    setArrows([
      {
        orig: from,
        dest: to,
        brush: "blue",
        modifiers: {
          lineWidth: "12",
        },
      },
    ]);
    setError("");
  };

  return (
    <main className="p-6 flex items-center justify-between">
      <Chessboard
        allowMoveOpponentPieces={true}
        chess={chess}
        customArrows={arrows}
        initialFen={fen}
        onMove={handleMove}
        orientation={
          puzzles[currentPuzzle].FEN.split(" ")[1] === "w" ? "black" : "white"
        }
        key={`${fen}-${updateFlag}`} // Use updateFlag to force rerender when FEN changes
      />
      {
        <div className="flex flex-col items-center justify-center">
          {puzzleEnd ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Puzzle Completed!</h2>
              <p className="text-lg">{message}</p>
              <button className="p-3 rounded-md border" onClick={loadNewPuzzle}>
                Next Puzzle
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Puzzle {currentPuzzle + 1}
              </h2>
              <button
                className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md w-32"
                onClick={getHint}
              >
                Hint
              </button>
              {error && <p className="text-red-500">{error}</p>}
              {error && (
                <button
                  className="p-3 rounded-md border bg-red-500"
                  onClick={retryMove}
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      }
    </main>
  );
};

export default Puzzles;
