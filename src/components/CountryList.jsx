import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add the first city you visited !" />;

  const countries = [];
  const countrySet = new Set();

  cities.forEach((city) => {
    if (!countrySet.has(city.country)) {
      countrySet.add(city.country);
      countries.push({ country: city.country, emoji: city.emoji });
    }
  });

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country} />
      ))}
    </ul>
  );
}

export default CountryList;
