import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game';
import How from './components/How';  
import Leaderboard from './components/Leaderboard';  
import './styles/style.css';

function App() {  
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Router>
      <nav className="navbar">
        <div className="logo ">hot or cold</div>
        <button className="hamburger" onClick={() => setShowMenu(!showMenu)}>
          ☰
        </button>
        <ul className={`nav-links ${showMenu ? "active" : ""}`}>
          {/* Nav links */}
          <li><a href="/">Home</a></li>
          <li><a href="/how">How to Play</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Game />} />  {/* Home route */}
        <Route path="/how" element={<How />} />  {/* Game route */}
        <Route path="/leaderboard" element={<Leaderboard />} />  {/* About route */}
      </Routes>
    </Router>
  );
}

export default App;
