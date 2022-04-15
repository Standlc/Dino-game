import React, { useContext, useEffect } from "react";
import "./game.css";
import Object from "./Object";
import "../assests/elon.png";
import { GameStatusContext, INITIAL_OBJECTS, ObjectsContext } from "../App";

export type ObjectData = {
  heigth: number;
  src: string;
};

const Objects = () => {
  const { objects, setObjects } = useContext(ObjectsContext);
  const { gameOver } = useContext(GameStatusContext);

  const resetObjects = () => {
    setObjects(INITIAL_OBJECTS());
  };

  useEffect(() => {
    if (!gameOver) resetObjects();
  }, [gameOver]);

  return (
    <>
      {objects.map((object, i) => {
        return <Object key={i} object={object} index={i} />;
      })}
    </>
  );
};

export default Objects;
