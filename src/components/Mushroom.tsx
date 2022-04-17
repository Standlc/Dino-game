import React, { useContext, useEffect, useRef, useState } from "react";
import { GameStatusContext } from "../App";

const Mushroom = ({
  setShowMushroom,
}: {
  setShowMushroom: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mushroom = require("../assests/mushroom.png");
  const [right, setRight] = useState(-50);
  const VELOCITY = 20;
  const mushroomRef = useRef<HTMLDivElement | null>(null);
  const { startGame, gameOver, dinosaurRef, superPowers, setSuperPowers } =
    useContext(GameStatusContext);
  const mushroomHasPassedScreen = right >= window.innerWidth;

  useEffect(() => {
    if (mushroomHasPassedScreen) setShowMushroom(false);
  }, [mushroomHasPassedScreen]);

  useEffect(() => {
    if (!startGame || gameOver) return;
    const interval = setInterval(() => {
      setRight(right + VELOCITY);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [right, startGame, gameOver]);

  useEffect(() => {
    const dinosaurRefCurrent = dinosaurRef.current;
    const objectRefCurrent = mushroomRef.current;
    if (!dinosaurRefCurrent || !objectRefCurrent) return;

    const objectPassedDino =
      objectRefCurrent.getBoundingClientRect().left <=
      dinosaurRefCurrent.getBoundingClientRect().right;
    const objectIsWithinDinoWidth =
      objectRefCurrent.getBoundingClientRect().right >=
      dinosaurRefCurrent.getBoundingClientRect().left;
    const objectIsWithinDinoHeight =
      objectRefCurrent.getBoundingClientRect().top <=
      dinosaurRefCurrent.getBoundingClientRect().bottom;
    const dinoIsUnder =
      objectRefCurrent.getBoundingClientRect().bottom <=
      dinosaurRefCurrent.getBoundingClientRect().top;

    if (
      objectPassedDino &&
      objectIsWithinDinoWidth &&
      objectIsWithinDinoHeight &&
      !dinoIsUnder
    )
      setSuperPowers(true);
  }, [
    mushroomRef?.current?.getBoundingClientRect(),
    mushroomRef?.current?.getBoundingClientRect(),
    superPowers,
    setSuperPowers,
  ]);

  useEffect(() => {
    if (!gameOver) {
      setRight(-50);
    }
  }, [gameOver]);

  return (
    <div ref={mushroomRef} className="mushroom-body" style={{ right }}>
      <img className="mushroom-image" src={mushroom} alt="" />
    </div>
  );
};

export default Mushroom;
