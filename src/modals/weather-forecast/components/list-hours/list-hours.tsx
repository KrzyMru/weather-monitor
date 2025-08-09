import React from "react";
import { precipitationIconData } from "../../types";
import type { ListHourProps } from "./types";
import { useTranslation } from "react-i18next";

const ListHours = (props: ListHourProps) => {
    const { 
        weatherData, selectedTime, setSelectedTime, 
        precipitation_probability_unit, temperature_2m_unit 
    } = { ...props }
    const { t } = useTranslation();

    const selectedTimeRef = React.useRef<HTMLButtonElement|null>(null);

    // Center view on chosen hour if possible
    React.useEffect(() => {
        selectedTimeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "end" });
    }, [selectedTime]);

    return (
        <ul className="flex flex-nowrap mt-5 overflow-x-scroll space-x-1 2xl:space-x-2 p-2 bg-gray-200 rounded-xl dark:bg-gray-700 focus-visible:outline-3 focus-visible:outline-slate-500">
            {weatherData.map((data, index) => {
                const WeatherIcon = data.weather_code_data.icon[data.is_day];
                const PrecipitationProbabilityIcon = precipitationIconData.find(({ min }) => data.precipitation_probability >= min)!.icon;
                const isSelected = selectedTime.startOf('hour').isSame(data.time);
                return (
                    <li key={index} className="inline-block">
                        <button 
                            className="flex flex-col items-center p-2 bg-slate-50 rounded-lg shadow-md outline-none dark:bg-gray-600 dark:hover:bg-slate-700 dark:active:bg-slate-800 dark:disabled:bg-slate-800 hover:cursor-pointer hover:bg-sky-50 active:bg-sky-100 disabled:bg-sky-100 disabled:cursor-default focus-visible:inset-ring-3 focus-visible:inset-ring-slate-500"
                            onClick={() => setSelectedTime(data.time)}
                            disabled={isSelected}
                            title={t('weatherForecast.hourButtonTitle') + ': ' + data.time.format("HH:mm")}
                            ref={isSelected ? selectedTimeRef : undefined}
                            type="button"
                        >
                            <p className="text-gray-600 font-mono text-center text-sm dark:text-gray-300">{data.time.format('HH:mm')}</p>
                            <WeatherIcon className="size-[48px] bg-white rounded-full shrink-0 dark:bg-gray-500"/>
                            <div className="flex justify-center">
                                <p className="font-semibold text-sm dark:text-white">{data.temperature_2m}</p>
                                <p className="font-semibold text-xs dark:text-white">{temperature_2m_unit}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <PrecipitationProbabilityIcon className="size-[28px] -ml-1 shrink-0"/>
                                <div className="flex justify-center">
                                    <p className="text-gray-600 text-xs w-[4ch] text-right dark:text-gray-300">{data.precipitation_probability}</p>
                                    <p className="text-gray-600 text-xs dark:text-gray-300">{precipitation_probability_unit}</p>
                                </div>
                            </div>
                        </button>
                    </li>
                )
            })}
        </ul>
    );
}

export default ListHours;