import { useCallback } from "react";

// Define your sound files here
const sounds = {
  movePiece: new Audio("./sounds/move-self.mp3"),
  capturePiece: new Audio("./sounds/capture.mp3"),
  check: new Audio("./sounds/move-check.mp3"),
  castle: new Audio("./sounds/castle.mp3"),
  promote: new Audio("./sounds/promote.mp3"),
  gameStart: new Audio("./sounds/notify.mp3"),
  gameEnd: new Audio("./sounds/checkmate.mp3"),
};

const useSound = () => {
  // Play sound by name
  const playSound = useCallback((soundName) => {
    const sound = sounds[soundName];
    if (sound) {
      sound
        .play()
        .catch((error) =>
          console.error(`Error playing sound "${soundName}":`, error)
        );
    } else {
      console.error(`Sound "${soundName}" not found.`);
    }
  }, []);

  return playSound;
};

export default useSound;
