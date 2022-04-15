import React, { useContext, useEffect, useState } from "react";
import { GameStatusContext } from "../App";
import "./game.css";

const Dinosaur = ({
  spaceBarDown,
  setSpaceBarDown,
}: {
  spaceBarDown: boolean;
  setSpaceBarDown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const elon = require("../assests/elon.png");
  const GRAVITATIONAL_FORCE = 1.2;
  const INITIAL_ACCELERATION = 20;
  const [dinosaurBottom, setDinosaurBottom] = useState(0);
  const [backFlipRotation, setBackFlipRotation] = useState(0);
  const [acceleration, setAcceleration] = useState(INITIAL_ACCELERATION);
  const dinosaurHasLanded = dinosaurBottom < 0;
  const [secondJump, setSecondJump] = useState(false);
  const { startGame, gameOver, dinosaurRef } = useContext(GameStatusContext);

  useEffect(() => {
    if (!gameOver) resetJump();
  }, [gameOver]);

  useEffect(() => {
    if (!spaceBarDown || !startGame || gameOver) return;
    const interval = setInterval(() => {
      handleJump();
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [
    spaceBarDown,
    dinosaurBottom,
    acceleration,
    gameOver,
    startGame,
    dinosaurRef,
  ]);

  const handleJump = () => {
    if (dinosaurHasLanded) return resetJump();
    makeDinoJump();
  };

  const makeDinoJump = () => {
    addStyle(dinosaurBottom);
    setDinosaurBottom(dinosaurBottom + acceleration);
    setAcceleration(acceleration - GRAVITATIONAL_FORCE);
  };

  const addStyle = (bottom: number) => {
    const dinosaurRefCurrent = dinosaurRef.current;
    if (!dinosaurRefCurrent) return;
    dinosaurRefCurrent.style.bottom = `${bottom}px`;
  };

  const resetJump = () => {
    addStyle(0);
    setAcceleration(INITIAL_ACCELERATION);
    setDinosaurBottom(0);
    setSpaceBarDown(false);
    setSecondJump(false);
    setBackFlipRotation(0);

    const dinosaurRefCurrent = dinosaurRef.current;
    if (!dinosaurRefCurrent) return;
    dinosaurRefCurrent.style.transform = "rotate(0deg)";
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [spaceBarDown, acceleration]);

  useEffect(()=>{
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  },[spaceBarDown, gameOver]);

  const handleClick = () => {
    if(gameOver) return;

    setSpaceBarDown(true);
    if (spaceBarDown) {
      setSecondJump(true);
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " && spaceBarDown) {
      setSecondJump(true);
    }
  };

  useEffect(() => {
    if (!secondJump || gameOver) return;
    const interval = setInterval(() => {
      doBackFlip();
    }, 1000 / 300);

    return () => clearInterval(interval);
  }, [secondJump, backFlipRotation, dinosaurRef]);

  const addBackFlipStyle = () => {
    const dinoRefCurrent = dinosaurRef.current;
    if (!dinoRefCurrent) return;
    if (secondJump)
      dinoRefCurrent.style.transform = `rotate(${backFlipRotation}deg)`;
  };

  useEffect(() => {
    if (secondJump) setAcceleration(INITIAL_ACCELERATION);
  }, [secondJump]);

  const doBackFlip = () => {
    addBackFlipStyle();
    setBackFlipRotation(backFlipRotation + 5);
  };

  return (
    <div ref={dinosaurRef} className="dinosaur-wrapper">
      <img className="dinosaur-image" src={elon} alt="" />
    </div>
  );
};

export default Dinosaur;
