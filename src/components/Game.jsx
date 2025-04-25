import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import '../styles/style.css';

function Game() {
  const [number, setNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [tries, setTries] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [averageAttempts, setAverageAttempts] = useState(0);
  const [prevDiff, setPrevDiff] = useState(null); // Store previous difference for "warmer" or "colder"

  console.log("Number to guess: ", number);
  console.log("Start time: ", startTime);

  const inputRef = useRef(null); // Reference to input field

  const handleGuess = (e) => {
    setGuess(e.target.value);

    // Start the timer only when the user starts typing the first guess
    if (startTime === null) {
      setStartTime(new Date().getTime());
    }
  };

  const submitGuess = () => {
    const currentGuess = parseInt(guess);
    const currentDiff = Math.abs(number - currentGuess);

    setTries((prev) => prev + 1);

    if (currentGuess === number) {
      const endTime = new Date().getTime();
      const time = ((endTime - startTime) / 1000).toFixed(2);
      setTimeTaken(time);
      setMessage(`🎉 You guessed it in ${tries + 1} tries and ${time} seconds!`);
      setGameOver(true);
      setGuess(0);
      setPrevDiff(null); // Reset for next game
      addScore(tries, time);
    } else {
      if (prevDiff === null) {
        setMessage(currentDiff <= 10 ? "Hot! 🔥" : "Cold! ❄️");
      } else {
        setMessage(
          currentDiff < prevDiff ? "Getting Warmer 🔥" : "Getting Colder 🧊"
        );
      }
      setPrevDiff(currentDiff);
    }
    setGuess(''); // Clear input after each guess
     // Focus on the input field after submitting
     inputRef.current.focus();
  };

  const addScore = async (tries, timeTaken) => {
    await addDoc(collection(db, "scores"), {
      score: tries + 1,
      time: timeTaken,
    });

    fetchLeaderboard();
  };

  // Fetch leaderboard from Firestore
  const fetchLeaderboard = async () => {
    const q = query(collection(db, "scores"), orderBy("score", "asc"), limit(5));
    const querySnapshot = await getDocs(q);
    const leaderboardData = querySnapshot.docs.map((doc) => doc.data());

    // Sort leaderboard first by score (attempts), then by time if score is the same
    leaderboardData.sort((a, b) => {
      if (a.score === b.score) {
        return a.time - b.time; // If attempts are the same, sort by time
      }
      return a.score - b.score; // Otherwise, sort by attempts
    });

    setLeaderboard(leaderboardData);

    if (leaderboardData.length > 0) {
      setBestScore(leaderboardData[0].score);
    }

    // Count total number of games
    const allGamesSnapshot = await getDocs(collection(db, "scores"));
    setGamesPlayed(allGamesSnapshot.size); // Add state for this
  };

  const startAgain = () => {
    setNumber(Math.floor(Math.random() * 100) + 1);
    setGuess(0);
    setTries(0);
    setStartTime(new Date().getTime());
    setMessage("");
    setGameOver(false);
    setTimeTaken(0);
    setPrevDiff(null); // Reset previous difference
  };

  // Start timer when game begins
  useEffect(() => {
    if (!startTime) setStartTime(new Date().getTime());
  }, [startTime]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (leaderboard.length > 0) {
      const totalAttempts = leaderboard.reduce((sum, entry) => sum + entry.score, 0);
      setAverageAttempts((totalAttempts / leaderboard.length).toFixed(0));
    }
  }, [leaderboard]);

  return (
    <>
      <header className="title-section">
        <h1><span className='hot'>Hot</span> or <span className='cold'>Cold</span></h1>
        <h3>Guess a number between 1 and 100</h3>
      </header>

      <div className="game-container">
        {gameOver ? (
          <div className="result-section">
            <div className="result-box">
              <h2>{message}</h2>
              <button onClick={startAgain}>Play Again</button>
            </div>
          </div>
        ) : (
          <div className="main-section">
            <h2 className={`message ${message.toLowerCase()}`}>{message}</h2>

            <div className="guess-box">
              <input
                type="number"
                value={guess}
                onChange={handleGuess}
                onKeyDown={(e) => e.key === "Enter" && submitGuess()}
                placeholder="Enter your guess"
                ref={inputRef} // Attach the ref to the input field
                disabled={gameOver}
              />
              <button
                onClick={submitGuess}
                disabled={gameOver}
                className={
                  message.toLowerCase().includes("hot")
                    ? "hot-button"
                    : message.toLowerCase().includes("cold")
                    ? "cold-button"
                    : ""
                }
              >
                Guess
              </button>
            </div>

            <p>Attempts: {tries}</p>
          </div>
        )}
      </div>

      <section className="stats-section">
        <h3>Stats</h3>
        <div className="stats-grid">
          <div>
            <h4>🏆 Best Score</h4>
            <p>{bestScore}</p>
          </div>
          <div>
            <h4>🎮 Games Played</h4>
            <p>{gamesPlayed}</p>
          </div>
          <div>
            <h4>📊 Average Score</h4>
            <p>{averageAttempts}</p>
          </div>
        </div>
      </section>

      <section className="leaderboard-section">
        <h2>🏅 Leaderboard</h2>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index}>
              <div className="leaderboard-entry">
                <div className="rank-label">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}
                </div>
                <div className="stats">
                  <div>Attempts: {entry.score}</div>
                  <div>Time: {entry.time}s</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Game;
