import type { LocationGeocodingData, GetCircleWeatherDataApiProps, GetGeocodingDataApiProps, LocationWeatherData } from "./types";

const getCircleWeatherData = async (props: GetCircleWeatherDataApiProps): Promise<LocationWeatherData> => {
    const { latitude, longitude } = { ...props }
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?model=ecmwf&latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`, {
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

const getGeocodingData = async (props: GetGeocodingDataApiProps): Promise<LocationGeocodingData[]> => {
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

export { getCircleWeatherData, getGeocodingData }
