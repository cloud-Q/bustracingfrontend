// src/components/BusRouteMap.jsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import polyline from 'polyline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define your bus stops data with precise coordinates
const busStops = [
  { name: "Soma Talav, Vadodara", coords: [22.27938, 73.23025] },
  { name: "Krishna Park, Vadodara", coords: [22.3030, 73.2340] },
  { name: "Vrundavan, Vadodara", coords: [22.3150, 73.1900] },
  { name: "Sama Savli Road, Vadodara", coords: [22.3405, 73.2026] },
  { name: "Dumad Chowkdi, Vadodara", coords: [22.3671, 73.1894] },
  { name: "SVIT (Final Destination, Vasad)", coords: [22.5678, 72.9510] },
];

// Create a custom icon for the final destination (SVIT)
const svitIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Replace with a custom image URL if desired
  iconSize: [35, 50], // Increase size for emphasis
  iconAnchor: [17, 50],
  popupAnchor: [0, -50],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const BusRouteMap = () => {
  const [routeCoords, setRouteCoords] = useState([]);
  // Center the map at the first bus stop.
  const mapCenter = busStops[0].coords;

  // Build the OSRM API URL using the bus stops.
  // OSRM expects coordinates in "longitude,latitude" order separated by semicolons.
  const getOsrmUrl = () => {
    const coordsString = busStops
      .map(stop => `${stop.coords[1]},${stop.coords[0]}`) // swap to lon,lat
      .join(';');
    return `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=polyline`;
  };

  useEffect(() => {
    // Fetch the route from OSRM API
    fetch(getOsrmUrl())
      .then(response => response.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          // Decode the polyline (returns an array of [lat, lon] pairs)
          const decoded = polyline.decode(data.routes[0].geometry);
          setRouteCoords(decoded);
        }
      })
      .catch(error => console.error('Error fetching route:', error));
  }, []);

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render the route polyline (if available) */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}

      {/* Render markers for each bus stop */}
      {busStops.map((stop, idx) => {
        // Use the custom icon for the final destination (SVIT)
        const isSVIT = stop.name.includes("SVIT");
        return (
          <Marker key={idx} position={stop.coords} icon={isSVIT ? svitIcon : undefined}>
            <Popup>{stop.name}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default BusRouteMap;
