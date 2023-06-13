import React, { useEffect, useRef } from 'react';

// Class for the Letter object and it's visuals
const Letter = ({ letter, fallingSpeed, gameHeight }) => {
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
        animationDuration: `${1 / fallingSpeed}s`,
      }}
      ref={letterRef}
    >
      {letter.value}
    </div>
  );
};

export default Letter;
