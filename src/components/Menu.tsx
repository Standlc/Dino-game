import React, { useContext, useEffect, useState } from "react";
import { GameStatusContext } from "../App";

const Menu = () => {
  const { startGame, setStartGame, gameOver, setGameOver, score, setScore } =
    useContext(GameStatusContext);
  const [highestScore, setHighestScrore] = useState<number>(0);

  useEffect(() => {
    const storedHighestScore = localStorage.getItem("highestScore");
    if (!storedHighestScore) return;
    setHighestScrore(parseFloat(storedHighestScore));
  }, []);

  useEffect(() => {
    localStorage.setItem("highestScore", highestScore.toString());
  }, [highestScore]);

  useEffect(() => {
    if (!gameOver) if (score > highestScore) setHighestScrore(score);
  }, [score, highestScore, gameOver]);

  const handleClick = () => {
    if (!startGame) return setStartGame(true);

    setGameOver(false);
    setScore(0);
  };

  const GAME_TITLE = !startGame ? "Play" : "Play again";

  if (startGame && !gameOver) return null;

  return (
    <div className="menu-container">
      <h1 className="menu-title">Run Elon, Run</h1>
      <div className="menu-items-wrapper">
        <h2 className="menu-item">
          Score : <b>{score}</b>
        </h2>
        {highestScore > 0 && (
          <h2 className="menu-item">
            Highest score : <b>{highestScore}</b>
          </h2>
        )}
        <h2 className="menu-play-button" onClick={handleClick}>
          {GAME_TITLE}
        </h2>
      </div>
    </div>
  );
};

export default Menu;
