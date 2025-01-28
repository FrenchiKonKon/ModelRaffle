import { useEffect, useState } from 'react';

const App = () => {
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [deadline, setDeadline] = useState(new Date('2025-01-31T23:00:00Z').getTime());
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetch('participants.txt')
      .then((response) => response.text())
      .then((data) => {
        const parsedParticipants = data.split('\n').map((name) => name.trim());
        setParticipants(parsedParticipants.filter((name) => name));
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = deadline - now;

      if (remaining > 0) {
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('¡Raffle ENDS!');
        clearInterval(interval);

        if (participants.length > 0 && !winner) {
          const randomIndex = Math.floor(Math.random() * participants.length);
          setWinner(participants[randomIndex]);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, participants, winner]);

  return (
    <div>
      <header className="fixed-header">
        <h1>¡Vtuber model Raflle !</h1>
        <h3 className="timer">{timeLeft}</h3>
        <h1>until raffle ends</h1>
        {winner && (
          <div className="winner-box">🎉 wiiner: {winner} 🎉</div>
        )}
      </header>
      
      <div className="main">
        <h2>participants  ({participants.length}):</h2>
        <div className="participants-grid">
          {participants.map((participant, index) => (
            <div key={index} className="participant-card">
              {participant}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;