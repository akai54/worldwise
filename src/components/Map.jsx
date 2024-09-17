import { useState } from "react";
import styles from "./Map.module.css";
import { useSearchParams } from "react-router-dom";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams?.get("lat");
  const lng = searchParams?.get("lng");

  return (
    <div className={styles.mapContainer}>
      <h1>Map</h1>
      <p>Latitude: {lat}</p>
      <p>Longitude: {lng}</p>

      <button
        onClick={() => {
          setSearchParams({ lat: 0, lng: 0 });
        }}
      >
        change pos
      </button>
    </div>
  );
}

export default Map;
