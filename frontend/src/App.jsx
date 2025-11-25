import { useState } from 'react'
import Sender from './components/Sender.jsx';
import Receiver from './components/Receiver.jsx';


export default function App() {
  const [view, setView] = useState('sender');

  return (
    <div>
      <div style={{ backgroundColor: '#333', color: 'white', padding: '15px' }}>
        <h1 style={{ margin: 0 }}>GPS Tracker Demo</h1>
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => setView('sender')}
            style={{ 
              marginRight: '10px', 
              padding: '8px 16px',
              backgroundColor: view === 'sender' ? '#4CAF50' : '#666',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sender (Phone)
          </button>
          <button 
            onClick={() => setView('receiver')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: view === 'receiver' ? '#4CAF50' : '#666',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Receiver (Laptop)
          </button>
        </div>
      </div>

      {view === 'sender' ? <Sender /> : <Receiver />}
    </div>
  );
}