import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { formatDate } from "../utils/formatDate";
import { useCities } from "../contexts/CitiesContext";

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, countryFlag, date, id, position } = city;

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(city);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.countryFlag}>{countryFlag}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
