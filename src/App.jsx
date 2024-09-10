import { useState } from "react";
import Chessboard from "./components/Chessboard";
import { Chess } from "chess.js";
import useChessSounds from "./lib/useSound";

function App() {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const { handleMoveSounds } = useChessSounds(chess);
  const [customArrows, setCustomArrows] = useState([]);

  const handleMove = (move) => {
    handleMoveSounds(move);
    // We can use somthing like this when the opponnent moves or when the game starts or you solve one move of the puzzle and the next move happpens by itself
    // setTimeout(() => {
    //   try {
    //     const move = chess.move({ from: "e7", to: "e5" });
    //     handleMoveSounds(move);
    //     setFen(chess.fen());
    //   } catch (error) {}
    // }, 1000);
  };

  const showCustommArrows = () => {
    setCustomArrows([
      {
        orig: "a2",
        dest: "a6",
        brush: "blue",
        modifiers: {
          lineWidth: "12",
        },
      },
    ]);
  };
  return (
    <div className="App">
      <Chessboard
        initialFen={fen}
        chess={chess}
        orientation="white"
        onMove={handleMove}
        allowMoveOpponentPieces={false}
        customArrows={customArrows}
      />
      <button onClick={showCustommArrows}>Show Hints Arrows</button>
    </div>
  );
}

export default App;
