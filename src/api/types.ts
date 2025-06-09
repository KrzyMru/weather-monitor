interface GetCircleWeatherDataApiProps  {
    latitude: number,
    longitude: number
}

interface GetGeocodingDataApiProps  {
    name: string,
}

interface LocationWeatherData {
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
    },
    hourly: {
        time: string[],
        temperature_2m: number[],
    },
}

interface LocationGeocodingData {
    name: string,
    display_name: string,
    addresstype: string,
    lat: number,
    lon: number,
    address: {
        county?: string,
        state?: string,
        country: string,
    }
}

export type {
    GetCircleWeatherDataApiProps, GetGeocodingDataApiProps,
    LocationWeatherData, LocationGeocodingData
}