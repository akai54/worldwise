import { createContext, useContext, useEffect, useState } from "react";

const citiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://akai54.github.io/worldwise/data/cities.json"
        );
        const data = await res.json();

        setCities(data.cities);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  function getCity(id) {
    try {
      setIsLoading(true);
      const city = cities.find((city) => city.id == id);
      if (!city) {
        throw new Error(`City with id ${id} not found`);
      }
      setCurrentCity(city);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }

  function addCity(city) {
    try {
      setIsLoading(true);
      setCities([...cities, city]);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }

  return (
    <citiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity }}
    >
      {children}
    </citiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(citiesContext);
  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
