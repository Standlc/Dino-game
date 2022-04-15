import React, { useContext, useEffect, useRef, useState } from "react";
import { GameStatusContext, ObjectsContext } from "../App";
import { ObjectData } from "./Objects";

const Object = ({ object, index }: { object: ObjectData; index: number }) => {
  const INTERVAL_BETWEEN_OBJECTS = 500;
  const INITIAL_ACCELERATION = 8;
  const ACCELERATION = 0.005;
  const MAX_ACCELERATION = 20;
  const [acceleration, setAcceleration] = useState(INITIAL_ACCELERATION);
  const [objectRight, setObjectRight] = useState(
    -index * INTERVAL_BETWEEN_OBJECTS
  );
  const objectRef = useRef<HTMLDivElement | null>(null);
  const { gameOver, startGame, setGameOver, dinosaurRef, setScore, score } =
    useContext(GameStatusContext);
  const [objectHasPassedDino, setObjectHasPassedDino] = useState(false);
  const { setObjects, objects } = useContext(ObjectsContext);

  useEffect(() => {
    if (objectHasPassedDino) setScore(score + 1);
  }, [objectHasPassedDino]);

  const resetObject = () => {
    setObjectRight(-index * INTERVAL_BETWEEN_OBJECTS);
    setAcceleration(INITIAL_ACCELERATION);
  };

  useEffect(() => {
    if (!gameOver) resetObject();
  }, [gameOver]);

  useEffect(() => {
    const handleMoveObject = () => {
      if (gameOver || !startGame) return;
      setObjectRight(objectRight + acceleration);

      if (acceleration < MAX_ACCELERATION)
        return setAcceleration(acceleration + ACCELERATION);
      setAcceleration(MAX_ACCELERATION);
    };

    const interval = setInterval(handleMoveObject, 1000 / 60);
    return () => clearInterval(interval);
  }, [objectRight, gameOver, startGame]);

  useEffect(() => {
    const dinosaurRefCurrent = dinosaurRef.current;
    const objectRefCurrent = objectRef.current;
    if (!dinosaurRefCurrent || !objectRefCurrent) return;

    setObjectHasPassedDino(
      objectRefCurrent.getBoundingClientRect().right <=
        dinosaurRefCurrent.getBoundingClientRect().left
    );

    const objectPassedDino =
      objectRefCurrent.getBoundingClientRect().left <=
      dinosaurRefCurrent.getBoundingClientRect().right;
    const objectIsWithinDinoWidth =
      objectRefCurrent.getBoundingClientRect().right >=
      dinosaurRefCurrent.getBoundingClientRect().left;
    const objectIsWithinDinoHeight =
      objectRefCurrent.getBoundingClientRect().top <=
      dinosaurRefCurrent.getBoundingClientRect().bottom;

    if (objectPassedDino && objectIsWithinDinoWidth && objectIsWithinDinoHeight)
      setGameOver(true);
  }, [dinosaurRef, objectRight]);

  useEffect(() => {
    if (objectRight >= window.innerWidth) handleObjectPassedScreen();
  }, [objectRight, objectRef]);

  const handleObjectPassedScreen = () => {
    const objectRefCurrent = objectRef.current;
    if (!objectRefCurrent) return;
    setObjectRight(-objectRefCurrent.getBoundingClientRect().width);
    const objecstCopy = [...objects];
    const objectCopy = objecstCopy.find((o) => o.heigth === object.heigth);
    if (objectCopy) {
      objectCopy.heigth = Math.random() * 45 + 50;
    }
    setObjects(objecstCopy);
  };

  return (
    <div
      ref={objectRef}
      className="object-wrapper"
      style={{
        height: `${object.heigth}px`,
        right: `${objectRight}px`,
      }}
    >
      <img className="object-image" src={object.src} alt="" />
    </div>
  );
};

export default Object;
