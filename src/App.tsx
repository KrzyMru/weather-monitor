import { Circle, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useContext } from "react";
import type { LatLngTuple, PathOptions } from "leaflet";
import type { MapRef } from "react-leaflet/MapContainer";
import { getCircleWeatherData, getGeocodingDataByCoords, getGeocodingDataByName } from "./api";
import type { LocationGeocodingData, LocationWeatherData } from "./api/types";
import { SettingsContext } from "./contexts";
import { Settings } from "./modals";
import { ChooseLocation } from "./modals/choose-location";
import { WeatherForecast } from "./modals/weather-forecast";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const App = () => {
  const mapRef = React.useRef<MapRef>(null);
  const [mapCenterPosition, setMapCenterPosition] = React.useState<LatLngTuple>([52.237049, 21.017532]);
  const [circlePosition, setCirclePosition] = React.useState<LatLngTuple|null>(null);
  const [userChosenLocationGeocodingData, setUserChosenLocationGeocodingData] = React.useState<LocationGeocodingData|null>(null);
  const [locationSearchText, setLocationSearchText] = React.useState<string>("");
  const [userChosenLocationWeatherData, setUserChosenLocationWeatherData] = React.useState<LocationWeatherData|null>(null);
  const [locationSearchGeocodingData, setLocationSearchGeocodingData] = React.useState<LocationGeocodingData[]>([]);
  const [locatingUserPosition, setLocatingUserPosition] = React.useState<boolean>(false);
  const [loadingGeocodingDataByName, setLoadingGeocodingDataByName] = React.useState<boolean>(false);
  const [loadingGeocodingDataByCoords, setLoadingGeocodingDataByCoords] = React.useState<boolean>(false);
  const [loadingLocationWeatherData, setLoadingLocationWeatherData] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [openWeatherForecast, setOpenWeatherForecast] = React.useState<boolean>(false);
  const [openFavouriteLocations, setOpenFavouriteLocations] = React.useState<boolean>(false);
  const { darkMode, chooseLocationOnClick } = useContext(SettingsContext);
  // Timers for api cooldown
  const geocodingTimer = React.useRef<number|undefined>(undefined);
  const locationTimer = React.useRef<number|undefined>(undefined);
  const { t, i18n } = useTranslation();
  const [favouriteLocations, setFavouriteLocations] = React.useState<LocationGeocodingData[]>(
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

  const circleOptions: PathOptions = { color: (loadingLocationWeatherData || loadingGeocodingDataByCoords) ? '#ffbf28' : '#38aeff'}
  const circleRadius = 4500;

  const handleLocateUserPosition = () => {
    setLocatingUserPosition(true);
    navigator.geolocation.getCurrentPosition(position => {
        // Found user position
        const { latitude, longitude } = position.coords;
        setMapCenterPosition([latitude, longitude]);
        handleUserMapClick([latitude, longitude])
        setLocatingUserPosition(false);
      }, () => {
        // Error
        setLocatingUserPosition(false)
      }, 
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}
    );
  }
  const handleUserChooseLocation = async (location: LocationGeocodingData) => {
    const locationCoords: LatLngTuple = [location.lat, location.lon];
    setMapCenterPosition(locationCoords);
    setCirclePosition(locationCoords);
    setUserChosenLocationGeocodingData(location);
    // Wait for forecast data to correctly sync opening modal
    await loadLocationWeatherData(locationCoords);
    setOpenWeatherForecast(true);
  }
  const handleAddRemoveLocationFavourites = (location: LocationGeocodingData) => {
    if(favouriteLocations.find(loc => loc.osm_id === location.osm_id) === undefined)
      setFavouriteLocations(prevLocations => [...prevLocations, {...location, is_favourite: true}]);
    else
      setFavouriteLocations(prevLocations => prevLocations.filter(loc => loc.osm_id !== location.osm_id));
  }
  const handleUserMapClick = (locationCoords: LatLngTuple) => {
    setCirclePosition(locationCoords);   
    setUserChosenLocationGeocodingData(null);  
    setUserChosenLocationWeatherData(null);  
  }

  const loadLocationWeatherData = async (locationCoords: LatLngTuple) => {
    const startTime = Date.now();
    try {
      setLoadingLocationWeatherData(true);
      const startDate = dayjs().startOf('day');
      const response = await getCircleWeatherData({ 
        latitude: locationCoords[0], longitude: locationCoords[1],
        startDate: startDate.format("YYYY-MM-DD"), endDate: startDate.add(6, 'days').format("YYYY-MM-DD"),
      });
      setUserChosenLocationWeatherData(response);
    } catch (e) { }
    finally {
      const minDelay = 600;
      const delay = Date.now() - startTime;
      if (locationTimer.current !== undefined)
          clearTimeout(locationTimer.current)
      locationTimer.current = setTimeout(() => setLoadingLocationWeatherData(false), minDelay - delay);
    }
  }
  const loadLocationGeocodingDataByName = async (locationName: string) => {
    const startTime = Date.now();
    try {
      setLoadingGeocodingDataByName(true);
      const response = await getGeocodingDataByName({ name: locationName, language: i18n.language });
      // Mark locations as favourite
      const favouriteIds = new Set(favouriteLocations.map(loc => loc.osm_id));
      const responseWithFavourites: LocationGeocodingData[] = response.map((location) => ({
        ...location, is_favourite: favouriteIds.has(location.osm_id)
      }));
      setLocationSearchGeocodingData(responseWithFavourites);
    } catch (e) { }
    finally {
      const minDelay = 600;
      const delay = Date.now() - startTime;
      if (geocodingTimer.current !== undefined)
          clearTimeout(geocodingTimer.current)
      geocodingTimer.current = setTimeout(() => setLoadingGeocodingDataByName(false), minDelay - delay);
    }
  }
  const loadLocationGeocodingDataByCoords = async (locationCoords: LatLngTuple) => {
    const startTime = Date.now();
    try {
      setLoadingGeocodingDataByCoords(true);
      const response = await getGeocodingDataByCoords({ coords: locationCoords, language: i18n.language });
      // Mark locations as favourite
      const favouriteIds = new Set(favouriteLocations.map(loc => loc.osm_id));
      const responseWithFavourites: LocationGeocodingData = {...response, is_favourite: favouriteIds.has(response.osm_id)};
      setUserChosenLocationGeocodingData(responseWithFavourites);
    } catch (e) { 
      // Things to display in forecast when location not found
      const errorDisplayName = t('geolocationErrorDisplayName');
      setUserChosenLocationGeocodingData({
        osm_id: -1,
        lat: locationCoords[0],
        lon: locationCoords[1],
        name: errorDisplayName.split(',')[0],
        display_name: errorDisplayName,
        is_favourite: false,
      });
    }
    finally {
      const minDelay = 600;
      const delay = Date.now() - startTime;
      if (geocodingTimer.current !== undefined)
          clearTimeout(geocodingTimer.current)
      geocodingTimer.current = setTimeout(() => setLoadingGeocodingDataByCoords(false), minDelay - delay);
    }
  }

  React.useEffect(() => {
    if(mapRef.current)
      mapRef.current.setView(mapCenterPosition, 10);
  }, [mapCenterPosition]);

  React.useEffect(() => {
    return () => {
      if (geocodingTimer.current !== undefined)
        clearTimeout(geocodingTimer.current);
      if (locationTimer.current !== undefined)
        clearTimeout(locationTimer.current);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("favouriteLocations", JSON.stringify(favouriteLocations));
    // Update search results and forecast data
    const favouriteIds = new Set(favouriteLocations.map(loc => loc.osm_id));
    setLocationSearchGeocodingData(prevLocations =>
      prevLocations.map(prevLoc => ({
        ...prevLoc,
        is_favourite: favouriteIds.has(prevLoc.osm_id),
      }))
    );
    setUserChosenLocationGeocodingData(prevLocation => {
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
        if(chooseLocationOnClick && !loadingGeocodingDataByCoords && 
          !loadingGeocodingDataByName && !loadingLocationWeatherData
        ) {          
          handleUserMapClick([e.latlng.lat, e.latlng.lng]);
        }    
      }        
    });

    return (
        circlePosition ? 
            <Circle 
              className={loadingLocationWeatherData ? 'animate-pulse' : ''}
              center={circlePosition} 
              pathOptions={circleOptions} 
              radius={circleRadius} 
              interactive={true}
              bubblingMouseEvents={false}
              eventHandlers={{ 
                click: () => {
                  if(userChosenLocationWeatherData === null)
                    loadLocationWeatherData(circlePosition);
                  if(userChosenLocationGeocodingData === null)
                    loadLocationGeocodingDataByCoords(circlePosition);
                  setOpenWeatherForecast(true);
                },
              }}
            />
        : null
    );     
  }

  const modals = 
  <React.Fragment>
    {openSettings &&
      <Settings
          open={openSettings}
          onClose={() => setOpenSettings(false)}
      />
    }
    {locationSearchGeocodingData.length !== 0 &&
      <ChooseLocation
          open={locationSearchGeocodingData.length !== 0}
          onClose={() => setLocationSearchGeocodingData([])}
          locations={locationSearchGeocodingData}
          onLocationClick={handleUserChooseLocation}
          onLocationFavouriteClick={handleAddRemoveLocationFavourites}
      />
    }
    {openFavouriteLocations &&
      <ChooseLocation
          open={openFavouriteLocations}
          onClose={() => setOpenFavouriteLocations(false)}
          locations={favouriteLocations}
          onLocationClick={handleUserChooseLocation}
          onLocationFavouriteClick={handleAddRemoveLocationFavourites}
      />
    }
    {openWeatherForecast && userChosenLocationWeatherData !== null && userChosenLocationGeocodingData !== null &&
      <WeatherForecast
          open={openWeatherForecast && userChosenLocationWeatherData !== null && userChosenLocationGeocodingData !== null}
          onClose={() => setOpenWeatherForecast(false)}
          weatherData={userChosenLocationWeatherData}
          geocodingData={userChosenLocationGeocodingData}
          onLocationFavouriteClick={handleAddRemoveLocationFavourites}
      />
    }
  </React.Fragment>

  return (
    <div className={`h-screen w-screen relative ${darkMode ? 'dark' : ''}`}>

      {/* Dark mode prefix (dark:) doesn't work well with this custom utility, so this conditional expression is necessary */}
      <div className={`w-full h-full ${darkMode ? 'leaflet-dark-mode' : ''}`}> 
        <MapContainer 
          ref={mapRef}
          center={mapCenterPosition} 
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

      {/* Settings control */}
      <div className="absolute bottom-4 left-4 lg:bottom-auto lg:top-4 z-999">
        <button 
          className="bg-slate-100 border-1 border-gray-300 rounded-full shadow-xl p-2 transition-[background-color] duration-350 hover:duration-0 hover:cursor-pointer hover:bg-slate-200 active:bg-slate-300 focus-visible:duration-0 focus-visible:outline-3 focus-visible:outline-sky-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:active:bg-gray-400 dark:focus-visible:outline-sky-300"
          title={t('settingsButtonTitle')}
          type="button"
          onClick={() => setOpenSettings(true)}
        >
          {/* Settings svg */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            className="size-[32px] shrink-0 transition-[fill] duration-350 fill-gray-900 dark:fill-white"
          >
            <path d="m9.25 22l-.4-3.2q-.325-.125-.613-.3t-.562-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.337v-.674q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2h-5.5Zm2.8-6.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.012 2.475T12.05 15.5Z"/>
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div className="absolute top-4 right-4 left-4 xs:right-20 lg:inset-x-24 z-999 transition-[left_right] duration-350">
          <div className="flex rounded-xl shadow-xl border-1 border-gray-300 transition-[background-color] duration-350 bg-slate-100 dark:bg-gray-600">
            <input
              className="flex-1 bg-transparent rounded-l-xl p-2 transition-[color] duration-350 disabled:pointer-events-none disabled:cursor-default disabled:text-gray-300 dark:disabled:text-gray-500 dark:text-white dark:focus-visible:outline-sky-300 focus-visible:duration-0 focus-visible:outline-3 focus-visible:outline-sky-600"
              type="text"
              placeholder={t('searchBarPlaceholder')}
              autoComplete="off"
              autoFocus={true}
              value={locationSearchText}
              disabled={loadingGeocodingDataByName}
              onChange={(e) => setLocationSearchText(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') 
                  loadLocationGeocodingDataByName(locationSearchText)
              }}
            />
            <button 
              className="relative ml-[3px] bg-slate-200 rounded-r-xl border-l-1 border-gray-300 p-2 transition-[background-color_border-color] duration-350 disabled:bg-slate-300 disabled:pointer-events-none disabled:cursor-default hover:duration-0 hover:cursor-pointer hover:bg-slate-300 active:bg-slate-400 focus-visible:duration-0 focus-visible:outline-3 focus-visible:outline-sky-600 dark:disabled:bg-slate-700 dark:bg-slate-500 dark:border-gray-400 dark:hover:bg-slate-700 dark:active:bg-slate-800 dark:focus-visible:outline-sky-300"
              title={t('favouritesButtonTitle')}
              type="button"
              disabled={loadingGeocodingDataByName}
              onClick={() => setOpenFavouriteLocations(true)}
            >
              {/* Favourite svg */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                className={`size-[32px] fill-rose-400 shrink-0 transition-[opacity] duration-350 ${loadingGeocodingDataByName ? 'opacity-0' : 'opacity-100'}`}
              >
                <path d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Z"/>
              </svg>
              {/* Loading circle svg */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                className={`absolute inset-0 fill-rose-400 animate-spin transition-[opacity] duration-350 ${loadingGeocodingDataByName ? 'opacity-100' : 'opacity-0'}`}
              >
                <path d="M12 22q-2.05 0-3.875-.788t-3.188-2.15q-1.362-1.362-2.15-3.187T2 12q0-2.075.788-3.888t2.15-3.174Q6.3 3.575 8.124 2.788T12 2q.425 0 .713.288T13 3q0 .425-.288.713T12 4Q8.675 4 6.337 6.337T4 12q0 3.325 2.337 5.663T12 20q3.325 0 5.663-2.337T20 12q0-.425.288-.713T21 11q.425 0 .713.288T22 12q0 2.05-.788 3.875t-2.15 3.188q-1.362 1.362-3.175 2.15T12 22Z"/>
              </svg>
            </button>
          </div>
      </div>
      
      {/* Location control */}
      <div className="absolute bottom-4 right-4 xs:bottom-auto xs:top-4 z-999">
        <button 
          className="relative bg-slate-100 border-1 border-gray-300 rounded-full shadow-xl p-2 transition-[background-color] duration-350 hover:duration-0 hover:cursor-pointer hover:bg-slate-200 active:bg-slate-300 disabled:cursor-default disabled:pointer-events-none focus-visible:duration-0 focus-visible:outline-3 focus-visible:outline-sky-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:active:bg-gray-400 dark:focus-visible:outline-sky-300"
          title={t('locationButtonTitle')}
          type="button"
          onClick={handleLocateUserPosition}
          disabled={locatingUserPosition}
        >
          {/* Location svg */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            className={`size-[32px] shrink-0 transition-[fill] duration-350 ${locatingUserPosition ? 'fill-gray-300 dark:fill-gray-700' : 'fill-gray-900 dark:fill-white'}`}
          >
            <path d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2h-2ZM12 19q2.9 0 4.95-2.05T19 12q0-2.9-2.05-4.95T12 5Q9.1 5 7.05 7.05T5 12q0 2.9 2.05 4.95T12 19Zm0-3q-1.65 0-2.825-1.175T8 12q0-1.65 1.175-2.825T12 8q1.65 0 2.825 1.175T16 12q0 1.65-1.175 2.825T12 16Z"/>
          </svg>
          {/* Loading circle svg */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            className={`absolute inset-0 fill-gray-500 animate-spin transition-[opacity_fill] duration-350 ${locatingUserPosition ? 'opacity-100' : 'opacity-0'} dark:fill-gray-400`}
          >
            <path d="M12 22q-2.05 0-3.875-.788t-3.188-2.15q-1.362-1.362-2.15-3.187T2 12q0-2.075.788-3.888t2.15-3.174Q6.3 3.575 8.124 2.788T12 2q.425 0 .713.288T13 3q0 .425-.288.713T12 4Q8.675 4 6.337 6.337T4 12q0 3.325 2.337 5.663T12 20q3.325 0 5.663-2.337T20 12q0-.425.288-.713T21 11q.425 0 .713.288T22 12q0 2.05-.788 3.875t-2.15 3.188q-1.362 1.362-3.175 2.15T12 22Z"/>
          </svg>
        </button>
      </div>

      {modals}
    </div>
  )
}

export default App;
