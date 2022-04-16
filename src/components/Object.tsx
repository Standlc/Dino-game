import React, { useContext, useEffect, useRef, useState } from "react";
import { GameStatusContext, ObjectsContext } from "../App";
import { ObjectData } from "./Objects";

const Object = ({ object, index }: { object: ObjectData; index: number }) => {
  const INTERVAL_BETWEEN_OBJECTS = 500;
  const INITIAL_VELOCITY = 8;
  const ACCELERATION = 0.005;
  const MAX_VELOCITY = 22;
  const objectRef = useRef<HTMLDivElement | null>(null);
  const [velocity, setVelocity] = useState(INITIAL_VELOCITY);
  const [objectRight, setObjectRight] = useState(
    -index * INTERVAL_BETWEEN_OBJECTS
  );
  const {
    gameOver,
    startGame,
    setGameOver,
    dinosaurRef,
    setScore,
    score,
    superPowers,
  } = useContext(GameStatusContext);
  const { setObjects, objects } = useContext(ObjectsContext);
  const objectPassedScreen = objectRight >= window.innerWidth;

  const isDinoTouchingObject = () => {
    if (superPowers) return;
    const objectRefCurrent = objectRef.current;
    const dinosaurRefCurrent = dinosaurRef.current;
    if (!objectRefCurrent || !dinosaurRefCurrent) return;
    const dinoClientRect = dinosaurRefCurrent.getBoundingClientRect();
    const objectClientRect = objectRefCurrent.getBoundingClientRect();

    const dinoRightObjectLeft = dinoClientRect.right <= objectClientRect.left;
    const dinoBottomObjectTop = dinoClientRect.bottom <= objectClientRect.top;
    const dinoLeftObjectRight = dinoClientRect.left >= objectClientRect.right;

    return !dinoRightObjectLeft && !dinoBottomObjectTop && !dinoLeftObjectRight;
  };

  const dinoPassedObject = () => {
    const objectRefCurrent = objectRef.current;
    const dinosaurRefCurrent = dinosaurRef.current;
    if (!objectRefCurrent || !dinosaurRefCurrent) return;
    return (
      dinosaurRefCurrent.getBoundingClientRect().left >
      objectRefCurrent.getBoundingClientRect().right
    );
  };

  const stopMoving = !startGame || gameOver || isDinoTouchingObject();

  useEffect(() => {
    if (dinoPassedObject()) setScore(score + 1);
  }, [dinoPassedObject()]);

  useEffect(() => {
    if (!gameOver) resetObject();
  }, [gameOver]);

  useEffect(() => {
    if (isDinoTouchingObject()) setGameOver(true);
  }, [isDinoTouchingObject()]);

  useEffect(() => {
    if (stopMoving) return;
    const jumpInterval = setInterval(() => {
      move();
    }, 1000 / 60);
    return () => clearInterval(jumpInterval);
  }, [stopMoving, velocity, objectRight]);

  useEffect(() => {
    if (objectPassedScreen) moveObjectToRight();
  }, [objectPassedScreen]);

  const move = () => {
    addStyle(objectRight);
    setObjectRight(objectRight + velocity);
    setVelocity(
      velocity >= MAX_VELOCITY ? MAX_VELOCITY : velocity + ACCELERATION
    );
  };

  const addStyle = (right: number) => {
    const objectRefCurrent = objectRef.current;
    if (!objectRefCurrent) return;
    objectRefCurrent.style.right = `${right}px`;
  };

  const moveObjectToRight = () => {
    setObjectRight(-(objectRef.current?.clientWidth ?? 0));
    changeObjectType();
  };

  const resetObject = () => {
    addStyle(-index * INTERVAL_BETWEEN_OBJECTS);
    setObjectRight(-index * INTERVAL_BETWEEN_OBJECTS);
    setVelocity(INITIAL_VELOCITY);
  };

  const changeObjectType = () => {
    const objecsCopy = [...objects];
    const objectCopy = objecsCopy.find((o) => o === object);
    if (!objectCopy) return;
    objectCopy.heigth = Math.random() * 45 + 50;
    setObjects(objecsCopy);
  };

  return (
    <div
      ref={objectRef}
      className="object-wrapper"
      style={{
        height: `${object.heigth}px`,
      }}
    >
      <img className="object-image" src={object.src} alt="" />
    </div>
  );
};

export default Object;
