'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationState {
  city: string;
  setCity: (city: string) => void;
  radius: number; // in km
  setRadius: (radius: number) => void;
  coordinates: { lat: number; lng: number } | null;
  detectLocation: () => void;
}

const LocationContext = createContext<LocationState | undefined>(undefined);

// Default coordinates for New York
const DEFAULT_COORDS = { lat: 40.7128, lng: -74.0060 };

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState('New York, USA');
  const [radius, setRadius] = useState(25);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Attempt to parse city and set rough coordinates, or just default to Dhaka for mock.
    if (city.toLowerCase().includes('new york')) {
      setCoordinates(DEFAULT_COORDS);
    } else if (city.toLowerCase().includes('chattogram')) {
      setCoordinates({ lat: 22.3569, lng: 91.7832 });
    } else {
      setCoordinates(DEFAULT_COORDS); // fallback
    }
  }, [city]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setCity('Current Location'); // In a real app we would reverse-geocode this
        },
        (error) => {
          console.error('Error detecting location:', error);
          // Fallback
          setCity('New York, USA');
        }
      );
    }
  };

  return (
    <LocationContext.Provider value={{ city, setCity, radius, setRadius, coordinates, detectLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
