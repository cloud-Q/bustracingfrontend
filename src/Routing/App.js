import React from 'react';
// In index.js or App.js
import 'leaflet/dist/leaflet.css';
import BusRouteMap from '../Components/BusRouteMap/BusRouteMap';

const App = () => {
  return (
    <div className="App">
      <h1>SVIT Bus Route Tracker</h1>
      <BusRouteMap/>
    </div>
  )
}

export default App