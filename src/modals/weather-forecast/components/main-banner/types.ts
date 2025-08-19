import type { GeolocationDataWithFavourite } from "../../../../components/search-bar/api/types";
import type { HourlyWeatherData } from "../../types";

interface MainBannerProps {
    weatherData: HourlyWeatherData,
    temperature_2m_unit: string,
    apparent_temperature_unit: string,
    precipitation_probability_unit: string,
    geolocationData: GeolocationDataWithFavourite,
    onLocationFavouriteClick: (location: GeolocationDataWithFavourite) => void,
}

export type { MainBannerProps }