import React, { useContext, useEffect, useRef, useState } from "react";
import { GameStatusContext, ObjectsContext } from "../App";
import { ObjectData } from "./Objects";

const Object = ({ object, index }: { object: ObjectData; index: number }) => {
  const INTERVAL_BETWEEN_OBJECTS = window.innerWidth / 3;
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
  const objectPassedScreen = objectRight >= window.innerWidth + 50;
  const FLIP_ROTATION_VELOCITY = 5;
  const BOTTOM_VELOCITY = 7;
  const [objectIsFlying, setObjectIsFlying] = useState(false);
  const [flipRotation, setFlipRotation] = useState(0);
  const [objectBottom, setObjectBottom] = useState(0);

  const isDinoTouchingObject = () => {
    const objectRefCurrent = objectRef.current;
    const dinosaurRefCurrent = dinosaurRef.current;
    if (!objectRefCurrent || !dinosaurRefCurrent) return;

    const dinoRightObjectLeft =
      dinosaurRefCurrent.getBoundingClientRect().right <=
      objectRefCurrent.getBoundingClientRect().left;
    const dinoBottomObjectTop =
      dinosaurRefCurrent.getBoundingClientRect().bottom <=
      objectRefCurrent.getBoundingClientRect().top;
    const dinoLeftObjectRight =
      dinosaurRefCurrent.getBoundingClientRect().left >=
      objectRefCurrent.getBoundingClientRect().right;
    const dinoTopObjectBottom =
      dinosaurRefCurrent.getBoundingClientRect().top >=
      objectRefCurrent.getBoundingClientRect().bottom;

    return (
      !dinoRightObjectLeft &&
      !dinoBottomObjectTop &&
      !dinoLeftObjectRight &&
      !dinoTopObjectBottom
    );
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

  const stopMoving =
    !startGame || gameOver || (isDinoTouchingObject() && !superPowers);

  useEffect(() => {
    if (dinoPassedObject()) setScore(score + 1);
  }, [dinoPassedObject()]);

  useEffect(() => {
    if (!gameOver) return resetObject();
  }, [gameOver]);

  useEffect(() => {
    if (isDinoTouchingObject() && superPowers && !objectIsFlying)
      return setObjectIsFlying(true);
    if (isDinoTouchingObject() && !superPowers) setGameOver(true);
  }, [isDinoTouchingObject(), superPowers, objectIsFlying]);

  useEffect(() => {
    if (stopMoving) return;
    if (!objectIsFlying) return;
    const flipInterval = setInterval(() => {
      flipObject();
    }, 1000 / 300);
    return () => clearInterval(flipInterval);
  }, [, superPowers, flipRotation, objectIsFlying]);

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

  const flipObject = () => {
    addFlipStyle({ rotation: flipRotation, bottom: objectBottom });
    setFlipRotation(flipRotation + FLIP_ROTATION_VELOCITY);
    setObjectBottom(objectBottom + BOTTOM_VELOCITY);
  };
  const addFlipStyle = ({
    rotation,
    bottom,
  }: {
    rotation: number;
    bottom: number;
  }) => {
    const objectRefCurrent = objectRef.current;
    if (!objectRefCurrent) return;
    objectRefCurrent.style.transform = `rotate(${rotation}deg)`;
    objectRefCurrent.style.bottom = `${bottom}px`;
  };

  const addStyle = (right: number) => {
    const objectRefCurrent = objectRef.current;
    if (!objectRefCurrent) return;
    objectRefCurrent.style.right = `${right}px`;
  };

  const moveObjectToRight = () => {
    setObjectRight(-(objectRef.current?.clientWidth ?? 0));
    changeObjectType();
    addFlipStyle({ rotation: 0, bottom: 0 });
    setFlipRotation(0);
    setObjectBottom(0);
    setObjectIsFlying(false);
  };

  const resetObject = () => {
    addStyle(-index * INTERVAL_BETWEEN_OBJECTS);
    setObjectRight(-index * INTERVAL_BETWEEN_OBJECTS);
    setVelocity(INITIAL_VELOCITY);
    addFlipStyle({ rotation: 0, bottom: 0 });
    setFlipRotation(0);
    setObjectBottom(0);
    setObjectIsFlying(false);
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
