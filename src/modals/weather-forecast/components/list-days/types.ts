import type dayjs from "dayjs";
import type { DailyWeatherData } from "../../types";

interface ListDaysProps {
    weatherData: DailyWeatherData[],
    selectedTime: dayjs.Dayjs,
    setSelectedTime: (newTime: dayjs.Dayjs) => void,
    temperature_2m_unit_min: string,
    temperature_2m_unit_max: string,
    precipitation_probability_unit_max: string,
}

export type { ListDaysProps }