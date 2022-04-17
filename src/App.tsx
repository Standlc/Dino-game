import Dinosaur from "./components/Dinosaur";
import Objects, { ObjectData } from "./components/Objects";
import "./components/game.css";
import React, { createContext, useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import Mushroom from "./components/Mushroom";

function App() {
  const dinosaurRef = useRef<HTMLDivElement | null>(null);
  const [spaceBarDown, setSpaceBarDown] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [objects, setObjects] = useState(INITIAL_OBJECTS());
  const [score, setScore] = useState(0);
  const [superPowers, setSuperPowers] = useState(false);
  const [showMushroom, setShowMushroom] = useState(false);

  useEffect(() => {
    if (showMushroom || superPowers) return;
    const timeOut = setTimeout(() => {
      setShowMushroom(true);
    }, 5000);
    return () => clearTimeout(timeOut);
  }, [showMushroom, superPowers]);

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
        superPowers,
        setSuperPowers,
      }}
    >
      <ObjectsContext.Provider value={{ objects, setObjects }}>
        <div className="canvas">
          <Menu />
          <Dinosaur />
          <Objects />
          {showMushroom && <Mushroom setShowMushroom={setShowMushroom} />}
        </div>
      </ObjectsContext.Provider>
    </GameStatusContext.Provider>
  );
}

export default App;

export const INITIAL_OBJECTS = () => {
  const mark = require("./assests/mark.png");
  const jeff = require("./assests/jeff.png");
  const jackMa = require("./assests/jackMa.jpeg");
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
      src: jackMa,
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
  superPowers: boolean;
  setSuperPowers: React.Dispatch<React.SetStateAction<boolean>>;
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
