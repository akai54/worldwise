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
        const sotredCities = localStorage.getItem("cities");
        if (sotredCities) {
          setCities(JSON.parse(sotredCities));
        } else {
          const res = await fetch(
            "https://akai54.github.io/worldwise/data/cities.json"
          );
          const data = await res.json();

          setCities(data.cities);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

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

  function deleteCity(city) {
    try {
      setIsLoading(true);
      const newCities = cities.filter((c) => c.id !== city.id);
      setCities(newCities);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }

  return (
    <citiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
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
