import { createContext, useContext, useEffect, useReducer } from "react";

const citiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function CitiesProvider({ children }) {
  const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const { cities, isLoading, currentCity, error } = state;

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const sotredCities = localStorage.getItem("cities");

        if (sotredCities) {
          dispatch({
            type: "cities/loaded",
            payload: JSON.parse(sotredCities),
          });
        } else {
          const res = await fetch(
            "https://akai54.github.io/worldwise/data/cities.json"
          );
          const data = await res.json();

          dispatch({ type: "cities/loaded", payload: data });
        }
      } catch (error) {
        dispatch({ type: "rejected", payload: error.message });
      }
    }
    fetchCities();
  }, []);

  /* Save cities to local storage */
  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const city = cities.find((city) => city.id == id);
      if (!city) {
        throw new Error(`City with id ${id} not found`);
      }
      dispatch({ type: "city/loaded", payload: city });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  function addCity(city) {
    dispatch({ type: "loading" });
    try {
      dispatch({ type: "city/added", payload: city });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  function deleteCity(city) {
    dispatch({ type: "loading" });
    try {
      dispatch({ type: "city/deleted", payload: city.id });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  return (
    <citiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addCity,
        deleteCity,
        error,
      }}
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
