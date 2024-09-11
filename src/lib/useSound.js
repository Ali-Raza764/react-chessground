import { useCallback } from "react";

// Define your sound files in a single object
const sounds = {
  movePiece: new Audio("./sounds/move-self.mp3"),
  capturePiece: new Audio("./sounds/capture.mp3"),
  check: new Audio("./sounds/move-check.mp3"),
  castle: new Audio("./sounds/castle.mp3"),
  promote: new Audio("./sounds/promote.mp3"),
  gameStart: new Audio("./sounds/notify.mp3"),
  gameEnd: new Audio("./sounds/checkmate.mp3"),
};

const useChessSounds = (chess) => {
  // Play sound by name
  const playSound = useCallback((soundName) => {
    const sound = sounds[soundName];
    if (sound) {
      sound.play().catch((error) => {
        console.error(`Error playing sound "${soundName}":`, error);
      });
    } else {
      console.error(`Sound "${soundName}" not found.`);
    }
  }, []);

  // Handle chess move sounds
  const handleMoveSounds = useCallback(
    (move) => {
      if (move.captured && !move.promotion && !chess.isGameOver()) {
        const isCheckAfterMove = chess.isCheck();
        playSound(isCheckAfterMove ? "check" : "capturePiece");
      } else if (move.san.includes("+")) {
        playSound("check");
      } else if (chess.isGameOver()) {
        playSound("gameEnd");
      } else if (move.san === "O-O" || move.san === "O-O-O") {
        playSound("castle");
      } else if (move.promotion) {
        playSound("promote");
      } else {
        playSound("movePiece");
      }
    },
    [chess, playSound]
  );

  return { playSound, handleMoveSounds };
};

export default useChessSounds;
