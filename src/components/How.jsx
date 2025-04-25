import React from 'react';
import '../styles/style.css';

function HowToPlay() {
  return (
    <>
    <section className="how-to-play-section">
      <h2>🎮 How to Play</h2>
      <ol className="how-to-play-list">
        <li>Click "Play" to start a new game. A random number between 1 and 100 is generated.</li>
        <li>Enter your guess in the input box and hit "Guess".</li>
        <li>You’ll receive feedback based on how close your guess is:</li>
          <li><span className="hot">Hot</span>: You’re closer to the answer.</li>
          <li><span className="cold">Cold</span>: You're faraway from the answer.</li>
        <li>Keep guessing until you find the right number.</li>
        <li>Your score is based on the number of attempts and the time taken.</li>
        <li>Try to make it to the top of the <strong>Leaderboard</strong>! 🏆</li>
      </ol>
      
    </section>
    <p>Check out my GitHub profile for more projects: <a href="https://github.com/anonymousecode" target="_blank" rel="noopener noreferrer">GitHub Profile</a></p>
    </>
    
  );
}

export default HowToPlay;
