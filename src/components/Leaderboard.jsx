import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import '../styles/style.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(
        collection(db, "scores"),
        orderBy("score", "asc"),
        orderBy("time", "asc"),
        limit(15)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setLeaderboard(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <section className="leaderboard-section">
      <h2>🏅 Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            <div className="leaderboard-entry">
              <div className="rank-label">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
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
  );
}

export default Leaderboard;
