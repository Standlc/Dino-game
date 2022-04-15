import Dinosaur from "./components/Dinosaur";
import Objects, { ObjectData } from "./components/Objects";
import "./components/game.css";
import React, { createContext, useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";

function App() {
  const dinosaurRef = useRef<HTMLDivElement | null>(null);
  const [spaceBarDown, setSpaceBarDown] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [objects, setObjects] = useState(INITIAL_OBJECTS());
  const [score, setScore] = useState(0);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") setSpaceBarDown(true);
  };

  return (
    <GameStatusContext.Provider
      value={{
        gameOver,
        setGameOver,
        dinosaurRef,
        startGame,
        setStartGame,
        score,
        setScore,
      }}
    >
      <ObjectsContext.Provider value={{ objects, setObjects }}>
        <div className="canvas">
          <Menu />
          <Dinosaur
            spaceBarDown={spaceBarDown}
            setSpaceBarDown={setSpaceBarDown}
          />
          <Objects />
        </div>
      </ObjectsContext.Provider>
    </GameStatusContext.Provider>
  );
}

export default App;

export const INITIAL_OBJECTS = () => {
  const mark = require("./assests/mark.png");
  const jeff = require("./assests/jeff.png");
  return [
    {
      heigth: Math.random() * 45 + 50,
      src: mark,
    },
    {
      heigth: Math.random() * 45 + 60,
      src: jeff,
    },
    {
      heigth: Math.random() * 45 + 60,
      src: mark,
    },
  ];
};

type GameStatusType = {
  gameOver: boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  startGame: boolean;
  setStartGame: React.Dispatch<React.SetStateAction<boolean>>;
  dinosaurRef: React.MutableRefObject<HTMLDivElement | null>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
};

export const GameStatusContext = createContext<GameStatusType>(
  undefined as unknown as GameStatusType
);

export const ObjectsContext = createContext<{
  objects: ObjectData[];
  setObjects: React.Dispatch<React.SetStateAction<ObjectData[]>>;
}>(
  undefined as unknown as {
    objects: ObjectData[];
    setObjects: React.Dispatch<React.SetStateAction<ObjectData[]>>;
  }
);
