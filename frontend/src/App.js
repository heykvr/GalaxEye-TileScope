import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import axios from "axios";

const App = () => {
  const [interSectedTiles, setInterSectedTiles] = useState(null);

  const onCreated = async (e) => {
    try {
      const layer = e.layer;
      const geoJson = layer.toGeoJSON();
      const coordinates = geoJson.geometry.coordinates[0];
      const aoi = {
        aoi: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      };

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      console.log("API_URL", API_URL);

      const { data } = await axios.post(`${API_URL}/api/tiles/intersect`, aoi);

      const geoJsonData = {
        type: "FeatureCollection",
        features: data.map((tile) => ({
          type: "Feature",
          geometry: tile.geometry,
          properties: tile.properties || {},
        })),
      };

      console.log("GeoJSON Data:", geoJsonData);
      setInterSectedTiles(geoJsonData); 
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Draw an AOI and See Intersecting Tiles</h1>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

         {interSectedTiles && (
          <GeoJSON
            key={JSON.stringify(interSectedTiles)}  
            data={interSectedTiles}
            style={{ color: "red", weight: 2 }}
          />
        )}

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default App;
