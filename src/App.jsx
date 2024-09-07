import { useState } from "react";
import Chessboard from "./Chessboard";

function App() {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [message, setMessage] = useState("");

  const handleMove = (from, to, newFen) => {
    console.log(`Move from ${from} to ${to}`);
    setFen(newFen);
    setMessage(`Move: ${from} to ${to}`);
  };

  const handleInvalidMove = (from, to) => {
    console.log(`Invalid move attempted from ${from} to ${to}`);
    setMessage(`Invalid move: ${from} to ${to}`);
  };

  return (
    <div className="App">
      <h1>My Chess App</h1>
      <Chessboard
        initialFen={fen}
        orientation="white"
        onMove={handleMove}
        onInvalidMove={handleInvalidMove}
      />
      <p>{message}</p>
    </div>
  );
}

export default App;
