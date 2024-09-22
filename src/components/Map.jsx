import { useEffect, useState } from "react";
import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPos, setMapPos] = useState([40, 0]);
  const {
    position: geoLocPos,
    isLoading: isLoadingPos,
    getPosition: getGeoPos,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPos([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLocPos) setMapPos([geoLocPos.lat, geoLocPos.lng]);
  }, [geoLocPos]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocPos && (
        <Button type="position" onClick={getGeoPos}>
          {isLoadingPos ? "Locating..." : "Locate me"}
        </Button>
      )}

      <MapContainer
        center={mapPos}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.countryFlag}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <CenterCurLoc position={mapPos} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function CenterCurLoc({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
