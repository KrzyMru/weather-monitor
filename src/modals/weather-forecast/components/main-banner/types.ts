import type { LocationGeocodingData } from "../../../../api/types";
import type { HourlyWeatherData } from "../../types";

interface MainBannerProps {
    weatherData: HourlyWeatherData,
    temperature_2m_unit: string,
    apparent_temperature_unit: string,
    precipitation_probability_unit: string,
    geocodingData: LocationGeocodingData,
    onLocationFavouriteClick: (location: LocationGeocodingData) => void,
}

export type { MainBannerProps }