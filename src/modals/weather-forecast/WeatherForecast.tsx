import React, { useMemo } from "react";
import { 
    InfoOutline, Raindrop, 
    ClearDay, PartlyCloudyDay, OvercastDay, FogDay, DrizzleLightDay, RainLightDay, SnowLightDay, SleetDay, ThunderstormDay, ThunderstormRainDay,
    ClearNight, PartlyCloudyNight, OvercastNight, FogNight, DrizzleLightNight, RainLightNight, SnowLightNight, SleetNight, ThunderstormNight, ThunderstormRainNight,
} from "../../assets/icons";
import Modal from "../Modal";
import type { WeatherForecastProps } from "./types";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(utc);
dayjs.extend(weekday);

const WeatherDayIcon: Record<number, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
    // Icons with comments use replacements 
    0: ClearDay,
    1: ClearDay,   // Mainly clear
    2: PartlyCloudyDay,
    3: OvercastDay,
    45: FogDay,
    48: FogDay,  // Depositing rime fog
    51: DrizzleLightDay,  
    53: DrizzleLightDay,  // Drizzle: Moderate intensity
    55: DrizzleLightDay,  // Drizzle: Dense intensity
    56: DrizzleLightDay,  // Freezing Drizzle: Light intensity
    57: DrizzleLightDay,  // Freezing Drizzle: Dense intensity
    61: RainLightDay,
    63: RainLightDay,  // Rain: Moderate intensity
    65: RainLightDay,  // Rain: Heavy intensity
    66: RainLightDay,  // Freezing Rain: Light intensity
    67: RainLightDay,  // Freezing Rain: Heavy intensity
    71: SnowLightDay,
    73: SnowLightDay,  // Snow fall: Moderate intensity
    75: SnowLightDay,  // Snow fall: Heavy intensity
    77: SleetDay,  // Snow grains (using sleet)
    80: RainLightDay,  // Rain showers: Slight
    81: RainLightDay,  // Rain showers: Moderate
    82: RainLightDay,  // Rain showers: Violent
    85: SnowLightDay,  // Snow showers: Slight
    86: SnowLightDay,  // Snow showers: Heavy
    95: ThunderstormDay,
    96: ThunderstormRainDay,
    99: ThunderstormRainDay,  // Thunderstorm with heavy hail
};

const WeatherNightIcon: Record<number, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
    // Icons with comments use replacements 
    0: ClearNight,
    1: ClearNight,   // Mainly clear
    2: PartlyCloudyNight,
    3: OvercastNight,
    45: FogNight,
    48: FogNight,  // Depositing rime fog
    51: DrizzleLightNight,  
    53: DrizzleLightNight,  // Drizzle: Moderate intensity
    55: DrizzleLightNight,  // Drizzle: Dense intensity
    56: DrizzleLightNight,  // Freezing Drizzle: Light intensity
    57: DrizzleLightNight,  // Freezing Drizzle: Dense intensity
    61: RainLightNight,
    63: RainLightNight,  // Rain: Moderate intensity
    65: RainLightNight,  // Rain: Heavy intensity
    66: RainLightNight,  // Freezing Rain: Light intensity
    67: RainLightNight,  // Freezing Rain: Heavy intensity
    71: SnowLightNight,
    73: SnowLightNight,  // Snow fall: Moderate intensity
    75: SnowLightNight,  // Snow fall: Heavy intensity
    77: SleetNight,  // Snow grains (using sleet)
    80: RainLightNight,  // Rain showers: Slight
    81: RainLightNight,  // Rain showers: Moderate
    82: RainLightNight,  // Rain showers: Violent
    85: SnowLightNight,  // Snow showers: Slight
    86: SnowLightNight,  // Snow showers: Heavy
    95: ThunderstormNight,
    96: ThunderstormRainNight,
    99: ThunderstormRainNight,  // Thunderstorm with heavy hail
};

const WeatherForecast = (props: WeatherForecastProps) => {
    const { open, onClose, weatherData, geocodingData } = { ...props }

    const now = dayjs();
    const temperature_2m_unit = weatherData.hourly_units.temperature_2m;
    const temperature_2m_unit_min = weatherData.daily_units.temperature_2m_min;
    const temperature_2m_unit_max = weatherData.daily_units.temperature_2m_max;
    const apparent_temperature_unit = weatherData.hourly_units.apparent_temperature;
    const precipitation_probability_unit = weatherData.hourly_units.precipitation_probability;
    const precipitation_probability_unit_max = weatherData.daily_units.precipitation_probability_max;

    //const utc_offset_minutes = weatherData.utc_offset_seconds / 60;
    const weatherDataHourlyArray = React.useMemo(() => 
        weatherData.hourly.time.map(
            (time, index) => ({
                time: dayjs(time), 
                temperature_2m: weatherData.hourly.temperature_2m[index],
                apparent_temperature: weatherData.hourly.apparent_temperature[index],
                precipitation_probability: weatherData.hourly.precipitation_probability[index],
                weather_icon: weatherData.hourly.is_day[index] ? 
                    WeatherDayIcon[weatherData.hourly.weather_code[index]] : WeatherNightIcon[weatherData.hourly.weather_code[index]],
                is_day: weatherData.hourly.is_day[index]
            })
        )
    , [weatherData]);
    const weatherDataDailyArray = React.useMemo(() => 
        weatherData.daily.time.map(
            (time, index) => ({
                time: dayjs(time), 
                temperature_2m_min: weatherData.daily.temperature_2m_min[index],
                temperature_2m_max: weatherData.daily.temperature_2m_max[index],
                precipitation_probability_max: weatherData.daily.precipitation_probability_max[index],
                weather_icon: WeatherDayIcon[weatherData.daily.weather_code[index]],
            })
        )
    , [weatherData]);
    

    const [selectedTime, setSelectedTime] = React.useState<dayjs.Dayjs>(now);
    const [openGeolocationInfo, setOpenGeolocationInfo] = React.useState<boolean>(false);
    const selectedTimeStartOfHour = selectedTime.startOf('hour');
    const selectedTimeIndex = weatherDataHourlyArray.findIndex(data => data.time.isSame(selectedTimeStartOfHour));
    const selectedTimeData = weatherDataHourlyArray[selectedTimeIndex];
    const selectedTimeStartOfDay = selectedTime.startOf('day');
    const selectedTimeDayBeginIndex = weatherDataHourlyArray.findIndex(data => data.time.isSame(selectedTimeStartOfDay));
    const selectedTimeDayEndIndex = selectedTimeDayBeginIndex + 24;
    const SelectedTimeIcon = selectedTimeData.weather_icon;
    const SelectedTimeDayWeatherDataArray = weatherDataHourlyArray.slice(selectedTimeDayBeginIndex, selectedTimeDayEndIndex);

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="flex flex-col justify-center">

                {/* Main banner */}
                <div className="mb-8">
                    <div className="flex justify-center items-center">
                        <SelectedTimeIcon className="size-[108px] shrink-0" />
                        <div className="items-center">
                            <div className="flex">
                                <p className="font-bold text-5xl w-[100px]">{selectedTimeData.temperature_2m}</p>
                                <p className="font-semibold text-2xl">{temperature_2m_unit}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">{"Apparent:"}</p>
                                <div className="flex">
                                    <p className="font-semibold text-sm indent-1">{selectedTimeData.apparent_temperature}</p>
                                    <p className="font-semibold text-xs">{apparent_temperature_unit}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">{"Rain chance:"}</p>
                                <div className="flex items-center">
                                    <p className="font-semibold text-sm indent-1">{selectedTimeData.precipitation_probability}</p>
                                    <p className="font-semibold text-sm">{precipitation_probability_unit}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-end">
                        <p className="text-center font-semibold text-lg">{geocodingData.name}</p> 
                        <button 
                            className="rounded-full m-1 group transition-[background-color] duration-100 hover:cursor-pointer focus-visible:outline-3 focus-visible:outline-slate-500"
                            onClick={() => setOpenGeolocationInfo(!openGeolocationInfo)}
                        >
                            <InfoOutline className="size-[16px] bg-white rounded-full shrink-0 group-hover:fill-gray-100 group-active:fill-gray-200"/>
                        </button> 
                    </div>
                    <div className={`flex flex-col items-center overflow-hidden transition-[max-height] duration-500 ease-in-out ${openGeolocationInfo ? 'max-h-100' : 'max-h-0'}`}>
                        <p className="text-base font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{geocodingData.addresstype + ', ' + (geocodingData.address.county ? geocodingData.address.county + ', ' : '') + geocodingData.address.state}</p>
                        <p className="text-sm font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{'Lat: ' + geocodingData.lat}</p>
                        <p className="text-sm font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{'Lon: ' + geocodingData.lon}</p>
                        <p className="text-base font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{geocodingData.address.country}</p>
                    </div>
                    <div className="flex justify-around">
                        <p className="font-mono text-base indent-1">{selectedTime.format('dddd, D MMMM HH:mm')}</p>     
                    </div>
                </div>

                {/* Hour list */}
                <ul className="flex flex-nowrap overflow-x-scroll space-x-1 p-2 bg-gray-50 rounded-xl">
                    {SelectedTimeDayWeatherDataArray.map((data, index) => (
                        <li className="inline-block" key={index}>
                            <button 
                                className="p-2 mb-2 bg-white rounded-lg shadow-md outline-none transition-[background-color] duration-100 hover:cursor-pointer hover:bg-sky-50 active:bg-sky-100 disabled:bg-sky-100 disabled:cursor-default focus-visible:inset-ring-3 focus-visible:inset-ring-slate-500"
                                onClick={() => setSelectedTime(data.time)}
                                disabled={selectedTimeStartOfHour.isSame(data.time)}
                            >
                                <p className="text-gray-600 font-mono text-center text-sm">{data.time.format('HH:mm')}</p>
                                <data.weather_icon className="size-[42px] bg-white rounded-full shrink-0"/>
                                <div className="flex justify-center">
                                    <p className="font-semibold text-sm">{data.temperature_2m}</p>
                                    <p className="font-semibold text-xs">{temperature_2m_unit}</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Raindrop className="size-[18px] shrink-0"/>
                                    <p className="text-gray-600 text-xs">{data.precipitation_probability}</p>
                                    <p className="text-gray-600 text-xs">{precipitation_probability_unit}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Day list */}
                <ul className="space-y-1 mt-5 p-4 bg-gray-50 rounded-xl">
                    {weatherDataDailyArray.map((day, index) => (
                        <li key={index}>
                            <button 
                                className="w-full flex justify-between items-center p-2 mb-2 bg-white shadow-md outline-none transition-[background-color] duration-100 hover:cursor-pointer hover:bg-sky-50 active:bg-sky-100 disabled:bg-sky-100 disabled:cursor-default focus-visible:inset-ring-3 focus-visible:inset-ring-slate-500"
                                onClick={() => setSelectedTime(day.time.hour(12))}
                                disabled={selectedTimeStartOfDay.isSame(day.time)}
                            >
                                <p className="text-left font-semibold text-base line-clamp-1 w-[150px]">{day.time.format('dddd')}</p>
                                <div className="flex justify-between w-[90px]">
                                    <div className="flex justify-center items-center">
                                        <Raindrop className="size-[18px] shrink-0"/>
                                        <p className="text-gray-600 text-xs">{day.precipitation_probability_max}</p>
                                        <p className="text-gray-600 text-xs">{precipitation_probability_unit_max}</p>
                                    </div>
                                    <day.weather_icon className="size-[32px] bg-white rounded-full shrink-0"/>
                                </div>
                                <div className="flex justify-end w-[150px]">
                                    <div className="flex justify-center">
                                        <p className="font-semibold text-sm">{day.temperature_2m_max}</p>
                                        <p className="font-semibold text-xs">{temperature_2m_unit_max}</p>
                                    </div>
                                    <p className="font-semibold text-sm indent-1">/</p>
                                    <div className="flex justify-center">
                                        <p className="font-semibold text-sm indent-1">{day.temperature_2m_min}</p>
                                        <p className="font-semibold text-xs">{temperature_2m_unit_min}</p>
                                    </div> 
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>

            </div>
        </Modal>
    );
};

export default WeatherForecast;