import type { LocationGeocodingData, LocationWeatherData } from "../../api/types";
import type { ModalProps } from "../types";

interface WeatherForecastProps extends ModalProps {
    weatherData: LocationWeatherData;
    geocodingData: LocationGeocodingData;
    onLocationFavouriteClick: (location: LocationGeocodingData) => void;
}

export type { WeatherForecastProps }