import { useState, useEffect } from 'react';

function Receiver() {
  const [location, setLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const API_URL = 'http://192.168.1.163:3001';

  // Haversine formula to calculate distance between two GPS coordinates
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const calculateStats = (current, previous) => {
    if (!previous) return null;

    const distance = haversineDistance(
      previous.latitude,
      previous.longitude,
      current.latitude,
      current.longitude
    );

    const timeDiff = (current.timestamp - previous.timestamp) / 1000; // seconds
    const speed = timeDiff > 0 ? distance / timeDiff : 0;

    // Calculate velocity components (degrees per second)
    const latVelocity = timeDiff > 0 ? (current.latitude - previous.latitude) / timeDiff : 0;
    const lonVelocity = timeDiff > 0 ? (current.longitude - previous.longitude) / timeDiff : 0;

    return {
      distance: distance.toFixed(2),
      speed: speed.toFixed(2),
      timeDiff: timeDiff.toFixed(2),
      velocity: {
        lat: latVelocity.toFixed(8),
        lon: lonVelocity.toFixed(8)
      }
    };
  };

  const fetchLocation = async () => {
    try {
      const response = await fetch(`${API_URL}/location`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No location data available yet. Start the sender first.');
        } else {
          throw new Error('Failed to fetch location');
        }
        return;
      }
      
      const data = await response.json();
      
      if (data && data.latitude) {
        setError(null);
        
        // If we have a previous location, calculate stats
        if (location && location.timestamp !== data.timestamp) {
          const calculatedStats = calculateStats(data, location);
          setStats(calculatedStats);
          setPreviousLocation(location);
        }
        
        setLocation(data);
      }
    } catch (err) {
      setError('Failed to fetch location: ' + err.message);
    }
  };

  const startPolling = () => {
    setIsPolling(true);
    fetchLocation();
  };

  const stopPolling = () => {
    setIsPolling(false);
  };

  useEffect(() => {
    let interval;
    if (isPolling) {
      interval = setInterval(fetchLocation, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isPolling, location]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>GPS Receiver (Laptop)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={startPolling} 
          disabled={isPolling}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Start Receiving
        </button>
        <button 
          onClick={stopPolling} 
          disabled={!isPolling}
          style={{ padding: '10px 20px' }}
        >
          Stop Receiving
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {location && (
        <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3>Latest Location</h3>
          <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
          <p><strong>Speed (from GPS):</strong> {location.speed ? `${location.speed.toFixed(2)} m/s` : 'N/A'}</p>
          <p><strong>Timestamp:</strong> {new Date(location.timestamp).toLocaleString()}</p>
          <p><strong>Received at server:</strong> {new Date(location.receivedAt).toLocaleString()}</p>
        </div>
      )}

      {stats && (
        <div style={{ backgroundColor: '#e8f8f0', padding: '15px', borderRadius: '5px' }}>
          <h3>Calculated Statistics</h3>
          <p><strong>Distance from last point:</strong> {stats.distance} meters ({(stats.distance / 1000).toFixed(3)} km)</p>
          <p><strong>Calculated Speed:</strong> {stats.speed} m/s ({(stats.speed * 3.6).toFixed(2)} km/h)</p>
          <p><strong>Time between updates:</strong> {stats.timeDiff} seconds</p>
          <p><strong>Velocity (latitude):</strong> {stats.velocity.lat} °/s</p>
          <p><strong>Velocity (longitude):</strong> {stats.velocity.lon} °/s</p>
        </div>
      )}
    </div>
  );
}

export default Receiver;