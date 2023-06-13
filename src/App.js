import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [letters, setLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [stoppedCount, setStoppedCount] = useState(0);
  const gameHeight = 750;
  const gameWidth = 350;

  //Object and visual component of the letters
  const Letter = ({ letter }) => {
    const letterRef = useRef();

    useEffect(() => {
      if (!letter.falling) {
        letterRef.current.style.animation = 'none';
      }
    }, [letter.falling]);

    return (
      <div
        className={`letter ${letter.falling ? 'falling' : 'stopped'}`}
        style={{
          fontSize: letter.size,
          backgroundColor: letter.color,
          top: letter.position,
          left: letter.left,
        }}
        ref={letterRef}
      >
        {letter.value}
      </div>
    );
  };

  useEffect(() => {
    //Function for creating/spawning new letters
    const spawnLetter = () => {
      if (letters.length < 100 && !gameOver) {
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 5));
        const randomSize = Math.floor(Math.random() * 30) + 15;
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const letter = {
          value: randomLetter,
          size: randomSize,
          color: randomColor,
          position: 0,
          falling: true,
          left: Math.floor(Math.random() * (gameWidth - 50)),
        };
        setLetters((prevLetters) => [...prevLetters, letter]);
      }
    };

    //interval frequency of letters spawning
    const intervalId = setInterval(spawnLetter, 50);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameOver, letters]);

  useEffect(() => {
    //Function for moving and updating position of letters
    const moveLetters = () => {
      setLetters((prevLetters) =>
        prevLetters.map((letter) => {
          if (letter.position >= gameHeight - letter.size && letter.falling) {
            if (stoppedCount >= 20) {
              clearInterval(intervalId);
              setGameOver(true)
              return letter;
            }
            setStoppedCount((prevCount) => prevCount + 1);
            return { ...letter, falling: false, position: gameHeight - letter.size };
          }
          if (letter.falling) {
            const newPosition = letter.position + 5;
            return { ...letter, position: newPosition };
          }
          return letter;
        })
      );
    };

    //Function for handling key presses made by the user, and act accordingly
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
          setScore((prevScore) => prevScore + scoreIncrement);
          return filteredLetters;
        });
      }
    };
   
    //Interval for updating letter positions
    const intervalId = setInterval(moveLetters, 50);

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameOver, letters, stoppedCount]);

  //The rendered components
  return (
    <div className="container">
      {!gameOver && <h1>Falling Letters Game</h1>}
      {gameOver && <h1 className="game-over">Game Over</h1>}
      <div className="score">Score: {score}</div>
      <div className="game-area">
        {letters.map((letter, index) => (
          <Letter key={index} letter={letter} />
        ))}
      </div>
      <div className="score">Stopped letters: {stoppedCount}</div>
    </div>
  );
};

export default App;
