import React from "react";
import { FaChessKnight, FaChessQueen, FaChessRook } from "react-icons/fa";
import { FaRegChessBishop } from "react-icons/fa6";

const PromotionDialog = ({ isOpen, onClose, onPromote, color }) => {
  if (!isOpen) return null;

  const pieces = [
    { name: "q", icon: <FaChessQueen size={32} className="text-black" /> },
    { name: "r", icon: <FaChessRook size={32} className="text-black" /> },
    { name: "n", icon: <FaChessKnight size={32} className="text-black" /> },
    { name: "b", icon: <FaRegChessBishop size={32} className="text-black" /> },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-4 bg-gray-200 rounded-lg flex items-center justify-center flex-col">
        <div className="flex space-x-4">
          {pieces.map((piece) => (
            <button
              key={piece.name}
              className="w-16 h-16 rounded-full border flex items-center justify-center bg-white"
              onClick={() => onPromote(piece.name)}
            >
              {piece.icon}
            </button>
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PromotionDialog;
