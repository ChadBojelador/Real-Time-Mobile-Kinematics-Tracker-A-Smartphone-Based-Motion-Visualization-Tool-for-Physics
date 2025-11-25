import { useState, useEffect } from 'react';

function Sender() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Ready to track');
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const API_URL = 'http://192.168.1.163:3001';

  const sendLocation = async (position) => {
    const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };

    setLocation(data);
    
    try {
      const response = await fetch(`${API_URL}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setStatus('Location sent successfully at ' + new Date().toLocaleTimeString());
      } else {
        setError('Failed to send location');
      }
    } catch (err) {
      setError('Failed to send location: ' + err.message);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    setError(null);
    setStatus('Tracking started...');

    const id = navigator.geolocation.watchPosition(
      sendLocation,
      (err) => {
        setError('Error getting location: ' + err.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setStatus('Tracking stopped');
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>GPS Sender (Phone)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={startTracking} 
          disabled={isTracking}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Start Tracking
        </button>
        <button 
          onClick={stopTracking} 
          disabled={!isTracking}
          style={{ padding: '10px 20px' }}
        >
          Stop Tracking
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {status}
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {location && (
        <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px' }}>
          <h3>Current Location</h3>
          <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
          <p><strong>Speed:</strong> {location.speed ? `${location.speed.toFixed(2)} m/s` : 'N/A'}</p>
          <p><strong>Timestamp:</strong> {new Date(location.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default Sender;