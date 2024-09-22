import { useEffect, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";

import { getCountryFlag } from "../utils/getCountryFlag";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCode, setIsLoadingGeoCode] = useState(false);
  const [countryFlag, setCountryFlag] = useState("");
  const [geoErr, setGeoErr] = useState("");

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeoCode(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode) {
          throw new Error("No country code found");
        }

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setCountryFlag(getCountryFlag(data.countryCode));
      } catch (error) {
        setGeoErr(error.message);
      } finally {
        setIsLoadingGeoCode(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  if (isLoadingGeoCode) return <Spinner />;

  if (!lat || !lng) return <Message message="No location data found" />;

  if (geoErr) return <Message message={geoErr} />;

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {<span className={styles.flag}>{countryFlag}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
