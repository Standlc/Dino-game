import React, { useContext, useEffect, useState } from "react";
import { GameStatusContext } from "../App";
import "./game.css";

const Dinosaur = () => {
  const { startGame, gameOver, dinosaurRef, superPowers, setSuperPowers } =
    useContext(GameStatusContext);
  const elon = require("../assests/elon.png");
  const elonThug = require("../assests/elonThug.jpeg");
  const FLOOR_LEVEL = 40;
  const GRAVITATIONAL_FORCE = 1.2;
  const INITIAL_VELOCITY = superPowers ? 27 : 20;
  const [dinosaurBottom, setDinosaurBottom] = useState(FLOOR_LEVEL);
  const [backFlipRotation, setBackFlipRotation] = useState(0);
  const BACKFLIP_VELOCITY = 5;
  const [velocity, setVelocity] = useState(INITIAL_VELOCITY);
  const [firstJump, setFirstJump] = useState(false);
  const [secondJump, setSecondJump] = useState(false);
  const dinosaurHasLanded = dinosaurBottom <= FLOOR_LEVEL && velocity <= 0;
  const stopMoving = !startGame || gameOver || !firstJump;
  const noBackFlip = stopMoving || !secondJump || !superPowers;

  useEffect(() => {
    if (!superPowers) return;
    setTimeout(() => setSuperPowers(false), 5000);
  }, [superPowers]);

  useEffect(() => {
    if (!gameOver) resetJump();
  }, [gameOver]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [firstJump, secondJump]);

  useEffect(() => {
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [firstJump, secondJump]);

  const handleClick = () => {
    setFirstJump(true);
    if (firstJump) setSecondJump(true);
  };

  useEffect(() => {
    if (dinosaurHasLanded) return resetJump();
    if (stopMoving) return;
    const jumpInterval = setInterval(() => jump(), 1000 / 60);
    return () => clearInterval(jumpInterval);
  }, [dinosaurBottom, velocity, firstJump, dinosaurHasLanded, stopMoving]);

  useEffect(() => {
    if (secondJump) setVelocity(INITIAL_VELOCITY);
  }, [secondJump]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== " ") return;
    setFirstJump(true);
    if (firstJump) setSecondJump(true);
  };

  const resetJump = () => {
    addJumpStyle(FLOOR_LEVEL);
    setFirstJump(false);
    setSecondJump(false);
    setDinosaurBottom(FLOOR_LEVEL);
    setVelocity(INITIAL_VELOCITY);
    resetBackFlip();
  };

  const jump = () => {
    addJumpStyle(dinosaurBottom);
    setDinosaurBottom(dinosaurBottom + velocity);
    setVelocity(velocity - GRAVITATIONAL_FORCE);
  };

  const addJumpStyle = (bottom: number) => {
    const dinosaurRefCurrent = dinosaurRef.current;
    if (!dinosaurRefCurrent) return;
    dinosaurRefCurrent.style.bottom = `${bottom}px`;
  };

  //BACKFLIP
  useEffect(() => {
    if (dinosaurHasLanded) return resetBackFlip();
    if (noBackFlip) return resetBackFlip();
    const jumpInterval = setInterval(() => {
      doBackFlip();
    }, 1000 / 300);
    return () => clearInterval(jumpInterval);
  }, [dinosaurHasLanded, stopMoving, backFlipRotation, secondJump]);

  const doBackFlip = () => {
    addBackFlipStyle(backFlipRotation);
    setBackFlipRotation(backFlipRotation + BACKFLIP_VELOCITY);
  };

  const resetBackFlip = () => {
    addBackFlipStyle(0);
    setBackFlipRotation(0);
  };

  const addBackFlipStyle = (bottom: number) => {
    const dinosaurRefCurrent = dinosaurRef.current;
    if (!dinosaurRefCurrent) return;
    dinosaurRefCurrent.style.transform = `rotate(${bottom}deg)`;
  };

  return (
    <div
      ref={dinosaurRef}
      className={
        superPowers ? "dinosaur-wrapper super-powers" : "dinosaur-wrapper"
      }
    >
      <img
        className="dinosaur-image"
        src={superPowers ? elonThug : elon}
        alt=""
      />
    </div>
  );
};

export default Dinosaur;
