import { Circle, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useContext } from "react";
import type { LatLngTuple, PathOptions } from "leaflet";
import type { MapRef } from "react-leaflet/MapContainer";
import { SettingsContext } from "./contexts";
import { Settings } from "./modals";
import { WeatherForecast } from "./modals/weather-forecast";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import LocationControl from "./components/location-control/location-control";
import type { GeolocationDataWithFavourite } from "./components/search-bar/api/types";
import type { WeatherData } from "./api/types";
import SearchBar from "./components/search-bar/search-bar";
import SettingsControl from "./components/settings-control/settings-control";
import getWeatherData from "./api/get-weather-data";
import getGeolocationDataCoords from "./api/get-geolocation-data-coords";

const App = () => {
  const mapRef = React.useRef<MapRef>(null);
  const [mapCenter, setMapCenter] = React.useState<LatLngTuple>([52.237049, 21.017532]); // Warsaw

  const [weatherData, setWeatherData] = React.useState<WeatherData|null>(null);
  const [geolocationData, setGeolocationData] = React.useState<GeolocationDataWithFavourite|null>(null);

  const [loadingWeatherData, setLoadingWeatherData] = React.useState<boolean>(false);
  const [loadingGeolocationData, setLoadingGeolocationData] = React.useState<boolean>(false);
  const [locatingUserPosition, setLocatingUserPosition] = React.useState<boolean>(false);

  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [openWeatherForecast, setOpenWeatherForecast] = React.useState<boolean>(false);
  const { darkMode, chooseLocationOnClick } = useContext(SettingsContext);
  const { t, i18n } = useTranslation();

  const [circlePosition, setCirclePosition] = React.useState<LatLngTuple|null>(null);
  const circleOptions: PathOptions = { color: (loadingWeatherData || loadingGeolocationData) ? '#ffbf28' : '#38aeff'}
  const circleRadius = 4500;

  const [favouriteLocations, setFavouriteLocations] = React.useState<GeolocationDataWithFavourite[]>(
      () => {
          try {
              const item = localStorage.getItem("favouriteLocations");
              if (item === undefined || item === null)
                  throw new Error();
              return JSON.parse(item);
          } catch (e: unknown) {
              return [];
          }
      }
  );

  const handleUserMapClick = (locationCoords: LatLngTuple) => {
    setCirclePosition(locationCoords);   
    setGeolocationData(null);  
    setWeatherData(null);  
  }

  const handleLocateUserPosition = () => {
    setLocatingUserPosition(true);
    navigator.geolocation.getCurrentPosition(position => {
        // Found user position
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        handleUserMapClick([latitude, longitude])
        setLocatingUserPosition(false);
      }, () => {
        // Error
        setLocatingUserPosition(false)
      }, 
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}
    );
  }

  const handleUserChooseLocation = async (location: GeolocationDataWithFavourite) => {
    const locationCoords: LatLngTuple = [location.lat, location.lon];
    setMapCenter(locationCoords);
    setCirclePosition(locationCoords);
    setGeolocationData(location);
    // Wait for forecast data to correctly sync opening modal
    await loadWeatherData(locationCoords);
    setOpenWeatherForecast(true);
  }

  const handleUpdateFavourite = (location: GeolocationDataWithFavourite) => {
    if(favouriteLocations.find(loc => loc.osm_id === location.osm_id) === undefined)
      setFavouriteLocations(prevLocations => [...prevLocations, {...location, is_favourite: true}]);
    else
      setFavouriteLocations(prevLocations => prevLocations.filter(loc => loc.osm_id !== location.osm_id));
  }

  const loadWeatherData = async (locationCoords: LatLngTuple) => {
    const startTime = Date.now();
    try {
      setLoadingWeatherData(true);
      const startDate = dayjs().startOf('day');
      const response = await getWeatherData({ 
        latitude: locationCoords[0], longitude: locationCoords[1],
        startDate: startDate.format("YYYY-MM-DD"), endDate: startDate.add(6, 'days').format("YYYY-MM-DD"),
      });
      setWeatherData(response);
    } catch (e) { }
    finally {
      const delay = Math.max(0, 600 - (Date.now() - startTime));
      setTimeout(() => setLoadingWeatherData(false), delay);
    }
  }

  const loadGeolocationData = async (locationCoords: LatLngTuple) => {
    const startTime = Date.now();
    try {
      setLoadingGeolocationData(true);
      const response = await getGeolocationDataCoords({ coords: locationCoords, language: i18n.language });
      // Mark locations as favourite
      const favouriteIds = new Set(favouriteLocations.map(loc => loc.osm_id));
      const responseWithFavourites: GeolocationDataWithFavourite = {...response, is_favourite: favouriteIds.has(response.osm_id)};
      setGeolocationData(responseWithFavourites);
    } catch (e) { 
      // Things to display in forecast when location not found
      const errorDisplayName = t('geolocationErrorDisplayName');
      setGeolocationData({
        osm_id: -1,
        lat: locationCoords[0],
        lon: locationCoords[1],
        name: errorDisplayName.split(',')[0],
        display_name: errorDisplayName,
        is_favourite: false,
      });
    }
    finally {
      const delay = Math.max(0, 600 - (Date.now() - startTime));
      setTimeout(() => setLoadingGeolocationData(false), delay);
    }
  }

  React.useEffect(() => {
    if(mapRef.current)
      mapRef.current.setView(mapCenter, 10);
  }, [mapCenter]);

  React.useEffect(() => {
    localStorage.setItem("favouriteLocations", JSON.stringify(favouriteLocations));
    // Update the geolocation data used in weather forecast
    const favouriteIds = new Set(favouriteLocations.map(loc => loc.osm_id));
    setGeolocationData(prevLocation => {
      if (prevLocation === null) return prevLocation;
      return {
        ...prevLocation,
        is_favourite: favouriteIds.has(prevLocation.osm_id),
      };
    });
  }, [favouriteLocations]);

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {  
        // Triggers only when clicking outside existing circle         
        if(chooseLocationOnClick && !loadingGeolocationData && !loadingWeatherData) {          
          handleUserMapClick([e.latlng.lat, e.latlng.lng]);
        }    
      }        
    });

    return (
      circlePosition ? 
          <Circle 
            className={loadingWeatherData ? 'animate-pulse' : ''}
            center={circlePosition} 
            pathOptions={circleOptions} 
            radius={circleRadius} 
            interactive={true}
            bubblingMouseEvents={false}
            eventHandlers={{ 
              click: () => {
                if(weatherData === null)
                  loadWeatherData(circlePosition);
                if(geolocationData === null)
                  loadGeolocationData(circlePosition);
                setOpenWeatherForecast(true);
              },
            }}
          />
      : null
    );     
  }

  const modals = 
  <>
    {openSettings &&
      <Settings
          open={openSettings}
          onClose={() => setOpenSettings(false)}
      />
    }
    {openWeatherForecast && weatherData !== null && geolocationData !== null &&
      <WeatherForecast
          open={openWeatherForecast && weatherData !== null && geolocationData !== null}
          onClose={() => setOpenWeatherForecast(false)}
          weatherData={weatherData}
          geolocationData={geolocationData}
          onLocationFavouriteClick={handleUpdateFavourite}
      />
    }
  </>

  return (
    <div className={`h-dvh w-dvw relative ${darkMode ? 'dark' : ''}`} id="mainDiv">

      {/* Dark mode prefix (dark:) doesn't work well with this custom utility, so this conditional expression is necessary */}
      <div className={`w-full h-full ${darkMode ? 'leaflet-dark-mode' : ''}`}> 
        <MapContainer 
          ref={mapRef}
          center={mapCenter} 
          zoom={5} minZoom={5} 
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
        </MapContainer>
      </div>

      <SearchBar 
        onLocationClick={handleUserChooseLocation}
        onLocationFavouriteClick={handleUpdateFavourite}
        favouriteLocations={favouriteLocations}
      />
      <LocationControl 
        onClick={handleLocateUserPosition}
        disabled={locatingUserPosition}
        loading={locatingUserPosition}
      />
      <SettingsControl 
        onClick={() => setOpenSettings(true)}
      />

      {modals}
    </div>
  )
}

export default App;
