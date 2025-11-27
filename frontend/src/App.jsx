import { useState } from 'react';
import Sender from './components/Sender.jsx';
import Receiver from './components/Receiver.jsx';
import './index.css';

export default function App() {
  const [view, setView] = useState('sender');

  return (
    <div className="app">
      <div className="panel-left">
        <div>
          <h1 className="brand-title">Physics Motion Tracker</h1>
          <p className="lead">Measure distance, velocity, acceleration, and time through any cell-smart phone.</p>

          <div className="controls">
            <button
              onClick={() => setView('sender')}
              className={"btn " + (view === 'sender' ? 'btn-primary' : 'btn-secondary')}
            >
              Sender (Phone)
            </button>
            <button
              onClick={() => setView('receiver')}
              className={"btn " + (view === 'receiver' ? 'btn-primary' : 'btn-secondary')}
            >
              Receiver (Laptop)
            </button>
          </div>
        </div>
      </div>

      <div className="panel-right">
        {view === 'sender' ? <Sender /> : <Receiver />}
      </div>
    </div>
  );
}
