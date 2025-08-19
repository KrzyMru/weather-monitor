import type { GetWeatherDataProps, WeatherData } from "./types";

const getWeatherData = async (props: GetWeatherDataProps): Promise<WeatherData> => {
    const { latitude, longitude, startDate, endDate } = { ...props }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?models=best_match&latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,is_day&daily=weather_code,precipitation_probability_max,temperature_2m_max,temperature_2m_min`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok)
        throw new Error(data?.reason);
    return data;
}

export default getWeatherData;