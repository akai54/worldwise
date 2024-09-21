import { createContext, useEffect, useState } from "react";

const citiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://akai54.github.io/worldwise/data/cities.json"
        );
        const data = await res.json();

        console.log(data);
        setCities(data.cities);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  return (
    <citiesContext.Provider value={{ cities, isLoading }}>
      {children}
    </citiesContext.Provider>
  );
}

export { CitiesProvider };
