import React, { useState, useEffect } from 'react';
import './App.css';
import Letter from './Components/Letter';

const App = () => {
  const [letters, setLetters] = useState([]); // Array of letters in play
  const [score, setScore] = useState(0); // Score count
  const [gameOver, setGameOver] = useState(false); // Game over state boolean
  const [stoppedCount, setStoppedCount] = useState(0); // Amount of stopped letters
  const [fallingSpeed, setFallingSpeed] = useState(2); // Initial falling speed
  const gameHeight = 750; // Height value of game area
  const gameWidth = 350; // Width value of game area

  useEffect(() => {
    // Function for creating/spawning new letters
    const spawnLetter = () => {
      if (letters.length < 100 && !gameOver) {
        //Randomize Values
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 5));
        const randomSize = Math.floor(Math.random() * 50) + 20;
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        //Create object with values
        const letter = {
          value: randomLetter,
          size: randomSize,
          color: randomColor,
          position: 0,
          falling: true,
          left: Math.floor(Math.random() * (gameWidth - 50)),
        };
        //Add newly created object to letter array
        setLetters((prevLetters) => [...prevLetters, letter]);
      }
    };

    // Random frequency of letters spawning
    const intervalId = setInterval(spawnLetter, Math.floor(Math.random() * 250) + 0);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameOver, letters]);

  useEffect(() => {
    // Function for moving and updating position of letters
    const moveLetters = () => {
      setLetters((prevLetters) =>
        prevLetters.map((letter) => {
          if (letter.position >= gameHeight - letter.size && letter.falling) {
            if (stoppedCount >= 20) { // Checks if 20 letters have hit bottom
              clearInterval(intervalId);
              setGameOver(true); // Ends the game
              return letter;
            }
            setStoppedCount((prevCount) => prevCount + 1); // adds the stopped letter to the counter
            return { ...letter, falling: false, position: gameHeight - letter.size };
          }
          if (letter.falling) {
            const newPosition = letter.position + fallingSpeed; // Get new position of letter
            return { ...letter, position: newPosition }; // Returns letter with updated position
          }
          return letter;
        })
      );
    };

    // Function for handling key presses made by the user and acting accordingly
    const handleKeyPress = (event) => {
      if (!gameOver) {
        const pressedLetter = event.key.toUpperCase();
        setLetters((prevLetters) => {
          let scoreIncrement = 0;
          const filteredLetters = prevLetters.filter((letter) => {
            if (letter.value === pressedLetter && letter.falling) {
              scoreIncrement++;
              return false; // Exclude the matching letter from the filtered array
            }
            return true; // Include all other letters in the filtered array
          });
          setScore((prevScore) => prevScore + scoreIncrement); // update score with amount of letters removed
          return filteredLetters;
        });
      }
    };

    // Interval for updating letter positions
    const intervalId = setInterval(moveLetters, 50);

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameOver, letters, stoppedCount, fallingSpeed]);

  useEffect(() => {
    // Function for checking and updating the falling speed based on the score
    if (score % 100 === 0 && score > 0) {
      setFallingSpeed((prevSpeed) => prevSpeed * 2);
    }
  }, [score]);

  // The rendered components
  return (
    <div className="container">
      {!gameOver && <h2>Falling Letters Game</h2>}
      {gameOver && <h1 className="game-over">Game Over</h1>}
      <div className="score">Score: {score}</div>
      {!gameOver && <div className="speed">Speed: {fallingSpeed / 2}</div>}
      <div className="game-area">
        {letters.map((letter, index) => (
          <Letter key={index} letter={letter} fallingSpeed={fallingSpeed} gameHeight={gameHeight} />
        ))}
      </div>
      <div className="score">Stopped letters: {stoppedCount}</div>
    </div>
  );
};

export default App;
