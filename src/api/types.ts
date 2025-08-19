import type { LatLngTuple } from "leaflet";

interface WeatherData {
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    utc_offset_seconds: number,
    timezone: string,
    timezone_abbreviation: string,
    elevation: string,
    hourly_units: {
        time: string,
        temperature_2m: string,
        apparent_temperature: string,
        precipitation_probability: string,
        weather_code: string,
        is_day: string,
    },
    daily_units: {
        time: string,
        temperature_2m_min: string,
        temperature_2m_max: string,
        precipitation_probability_max: string,
        weather_code: string,
    },
    hourly: {
        time: string[],
        temperature_2m: number[],
        apparent_temperature: number[],
        precipitation_probability: number[],
        weather_code: number[],
        is_day: number[],
    },
    daily: {
        time: string[],
        temperature_2m_min: number[],
        temperature_2m_max: number[],
        precipitation_probability_max: number[],
        weather_code: number[],
    },
}

interface GeolocationData {
    osm_id: number,
    name: string,
    display_name: string,
    lat: number,
    lon: number,
}

interface GetWeatherDataProps {
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
}

interface GetGeolocationDataCoordsProps {
    coords: LatLngTuple,
    language: string,
}

export type { WeatherData, GeolocationData, GetWeatherDataProps, GetGeolocationDataCoordsProps }