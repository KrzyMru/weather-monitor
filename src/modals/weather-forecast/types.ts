import type { LocationWeatherData } from "../../api/types";
import type { ModalProps } from "../types";

interface WeatherForecastProps extends ModalProps {
    weatherData: LocationWeatherData;
}

export type { WeatherForecastProps }