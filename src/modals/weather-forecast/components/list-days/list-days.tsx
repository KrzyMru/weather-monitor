import { useTranslation } from "react-i18next";
import { precipitationIconData } from "../../types";
import type { ListDaysProps } from "./types";

const ListDays = (props: ListDaysProps) => {
    const { 
        weatherData, selectedTime, setSelectedTime,
        precipitation_probability_unit_max, temperature_2m_unit_max, temperature_2m_unit_min
    } = { ...props }
    const { t } = useTranslation();

    return (
        <ul className="space-y-1 lg:space-y-2 2xl:space-y-3 mt-5 p-4 bg-gray-200 rounded-xl dark:bg-gray-700">
            {weatherData.map((day, index) => {
                const PrecipitationProbabilityIcon = precipitationIconData.find(({ min }) => day.precipitation_probability_max >= min)!.icon;
                return (
                    <li key={index}>
                        <button 
                            className="w-full flex flex-col xs:flex-row justify-between items-center p-2 mb-2 bg-slate-50 shadow-md outline-none dark:bg-gray-600 dark:hover:bg-slate-700 dark:active:bg-slate-800 dark:disabled:bg-slate-800 hover:cursor-pointer hover:bg-sky-50 active:bg-sky-100 disabled:bg-sky-100 disabled:cursor-default focus-visible:inset-ring-3 focus-visible:inset-ring-slate-500"
                            onClick={() => setSelectedTime(day.time.hour(selectedTime.hour()))}
                            disabled={selectedTime.startOf('day').isSame(day.time)}
                            title={t('weatherForecast.dayButtonTitle') + ': ' + day.time.format("dddd")}
                            type="button"
                        >
                            <p className="w-full text-lg first-letter:uppercase font-semibold [transition:width_350ms] xs:w-[130px] xs:text-left xs:text-base dark:text-white">{day.time.format('dddd')}</p>
                            <div className="flex flex-col-reverse justify-around w-full [transition:width_350ms] items-center my-2 xs:flex-row xs:justify-between xs:w-[130px] xs:space-x-8">
                                <div className="flex justify-center items-center pr-2 xs:pr-0">
                                    <PrecipitationProbabilityIcon className="size-[46px] xs:size-[28px] [transition:width_350ms,height_350ms] shrink-0"/>
                                    <p className="text-gray-600 text-sm dark:text-gray-300">{day.precipitation_probability_max}</p>
                                    <p className="text-gray-600 text-sm dark:text-gray-300">{precipitation_probability_unit_max}</p>
                                </div>
                                <day.weather_icon className="size-[58px] m-1 [transition:width_350ms,height_350ms,margin_350ms] bg-white rounded-full shrink-0 xs:size-[32px] xs:m-0 dark:bg-gray-500"/>
                            </div>
                            <div className="flex justify-center xs:justify-end w-[150px]">
                                <div className="flex justify-center">
                                    <p className="font-semibold text-base dark:text-white">{day.temperature_2m_max}</p>
                                    <p className="font-semibold text-sm dark:text-white">{temperature_2m_unit_max}</p>
                                </div>
                                <p className="font-semibold text-base indent-1 text-gray-600 dark:text-gray-300">/</p>
                                <div className="flex justify-center">
                                    <p className="font-semibold text-base indent-1 dark:text-white">{day.temperature_2m_min}</p>
                                    <p className="font-semibold text-sm dark:text-white">{temperature_2m_unit_min}</p>
                                </div> 
                            </div>
                        </button>
                    </li>
                )
            })}
        </ul>
    );
}

export default ListDays;