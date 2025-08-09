import React from "react";
import Modal from "../base-modal/base-modal";
import { weatherCodeData, type WeatherForecastProps } from "./types";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import { useTranslation } from "react-i18next";
import { MainBanner } from "./components/main-banner";
import { WeatherChart } from "./components/weather-chart";
import ListHours from "./components/list-hours/list-hours";
import ListDays from "./components/list-days/list-days";
import('dayjs/locale/pl');
dayjs.extend(utc);
dayjs.extend(weekday);

const WeatherForecast = (props: WeatherForecastProps) => {
    const { open, onClose, weatherData, geocodingData, onLocationFavouriteClick } = { ...props }
    const { i18n } = useTranslation();
    dayjs.locale(i18n.language);

    const [selectedTime, setSelectedTime] = React.useState<dayjs.Dayjs>(dayjs());

    const hourlyWeather = React.useMemo(() => 
        weatherData.hourly.time.map(
            (time, index) => ({
                time: dayjs(time), 
                temperature_2m: weatherData.hourly.temperature_2m[index],
                apparent_temperature: weatherData.hourly.apparent_temperature[index],
                precipitation_probability: weatherData.hourly.precipitation_probability[index],
                weather_code_data: weatherCodeData[weatherData.hourly.weather_code[index]],
                is_day: weatherData.hourly.is_day[index],
            })
        )
    , [weatherData]);
    const dailyWeather = React.useMemo(() => 
        weatherData.daily.time.map(
            (time, index) => ({
                time: dayjs(time), 
                temperature_2m_min: weatherData.daily.temperature_2m_min[index],
                temperature_2m_max: weatherData.daily.temperature_2m_max[index],
                precipitation_probability_max: weatherData.daily.precipitation_probability_max[index],
                weather_icon: weatherCodeData[weatherData.daily.weather_code[index]].icon[1], // Day version of icon
            })
        )
    , [weatherData]);

    const temperature_2m_unit = weatherData.hourly_units.temperature_2m;
    const temperature_2m_unit_min = weatherData.daily_units.temperature_2m_min;
    const temperature_2m_unit_max = weatherData.daily_units.temperature_2m_max;
    const precipitation_probability_unit = weatherData.hourly_units.precipitation_probability;
    const precipitation_probability_unit_max = weatherData.daily_units.precipitation_probability_max;
    
    const selectedTimeIndex = hourlyWeather.findIndex(data => data.time.isSame(selectedTime.startOf('hour')));
    const selectedTimeWeatherData = hourlyWeather[selectedTimeIndex];

    const selectedDayBeginIndex = hourlyWeather.findIndex(data => data.time.isSame(selectedTime.startOf('day')));
    const selectedDayEndIndex = selectedDayBeginIndex + 24;
    const selectedDayHourlyWeather = hourlyWeather.slice(selectedDayBeginIndex, selectedDayEndIndex);

    const chartHourlyWeather = React.useMemo(() =>
        selectedDayHourlyWeather.map(data => ({
            timeAxis: data.time.format("HH:mm"),
            temperatureAxis: data.temperature_2m,
            time: data.time,
            temperature: data.temperature_2m,
            precipitation_probability: data.precipitation_probability,
            weather_code_data: data.weather_code_data,
            is_day: data.is_day,
        }))
    , [selectedTime]);

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="flex flex-col justify-center">
                <MainBanner
                    weatherData={selectedTimeWeatherData}
                    geocodingData={geocodingData}
                    onLocationFavouriteClick={onLocationFavouriteClick}
                    apparent_temperature_unit={weatherData.hourly_units.apparent_temperature}
                    precipitation_probability_unit={weatherData.hourly_units.precipitation_probability}
                    temperature_2m_unit={weatherData.hourly_units.temperature_2m}
                />
                <WeatherChart 
                    weatherData={chartHourlyWeather}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    selectedTimeTemperature={selectedTimeWeatherData.temperature_2m}
                    precipitation_probability_unit={precipitation_probability_unit}
                    temperature_2m_unit={temperature_2m_unit}
                />
                <ListHours 
                    weatherData={selectedDayHourlyWeather}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    precipitation_probability_unit={precipitation_probability_unit}
                    temperature_2m_unit={temperature_2m_unit}
                />
                <ListDays 
                    weatherData={dailyWeather}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    precipitation_probability_unit_max={precipitation_probability_unit_max}
                    temperature_2m_unit_min={temperature_2m_unit_min}
                    temperature_2m_unit_max={temperature_2m_unit_max}
                />
            </div>
        </Modal>
    );
};

export default WeatherForecast;