import type { LocationGeocodingData, GetCircleWeatherDataApiProps, GetGeocodingDataByNameApiProps, GetGeocodingDataByCoordsApiProps, LocationWeatherData } from "./types";

const getCircleWeatherData = async (props: GetCircleWeatherDataApiProps): Promise<LocationWeatherData> => {
    const { latitude, longitude } = { ...props }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?model=ecmwf&latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,is_day&daily=weather_code,precipitation_probability_max,temperature_2m_max,temperature_2m_min`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok)
        throw new Error(data?.reason);
    return data;
}

const getGeocodingDataByName = async (props: GetGeocodingDataByNameApiProps): Promise<LocationGeocodingData[]> => {
    const { name } = { ...props }
    const response = await fetch(`http://nominatim.openstreetmap.org/search?q=${name}&addressdetails=1&featureType=city&format=json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok)
        throw new Error(data?.reason);
    return data;
}

const getGeocodingDataByCoords = async (props: GetGeocodingDataByCoordsApiProps): Promise<LocationGeocodingData> => {
    const { coords } = { ...props }
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1&zoom=10&format=json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok)
        throw new Error(data?.reason);
    return data;
}

export { getCircleWeatherData, getGeocodingDataByName, getGeocodingDataByCoords }
