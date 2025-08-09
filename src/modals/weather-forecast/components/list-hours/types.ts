import type dayjs from "dayjs"
import type { HourlyWeatherData } from "../../types"

interface ListHourProps {
    weatherData: HourlyWeatherData[],
    selectedTime: dayjs.Dayjs,
    setSelectedTime: (newTime: dayjs.Dayjs) => void,
    temperature_2m_unit: string,
    precipitation_probability_unit: string,
}

export type { ListHourProps }