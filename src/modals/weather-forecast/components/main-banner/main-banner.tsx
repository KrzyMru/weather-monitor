import { useTranslation } from "react-i18next";
import type { MainBannerProps } from "./types";
import { Heart, HeartBroken, InfoOutline } from "../../../../assets/icons";
import React from "react";

const MainBanner = (props: MainBannerProps) => {
    const { 
        weatherData, temperature_2m_unit, apparent_temperature_unit, precipitation_probability_unit,
        geocodingData, onLocationFavouriteClick
    } = { ...props };
    const { t } = useTranslation();
    const [openGeolocationInfo, setOpenGeolocationInfo] = React.useState<boolean>(false);

    const WeatherIcon = weatherData.weather_code_data.icon[weatherData.is_day];
    const FavouriteIcon = geocodingData.is_favourite ? HeartBroken : Heart;
    const weatherName = t('weatherForecast.weatherNames.'+weatherData.weather_code_data.nameString);
    const geolocationLabels = geocodingData.display_name.split(',').slice(1);

    return (
        <div className="mb-8">
            <div className="flex flex-col xs:flex-row justify-center items-center mb-2">
                <WeatherIcon className="size-[108px] shrink-0" />
                <div className="items-center w-[160px]">
                    <div className="flex justify-center xs:justify-start">
                        <p className="font-bold text-5xl dark:text-white">{weatherData.temperature_2m}</p>
                        <p className="font-semibold text-2xl dark:text-white">{temperature_2m_unit}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm dark:text-white">{t('weatherForecast.temperatureApparent')+':'}</p>
                        <div className="flex">
                            <p className="font-semibold text-sm dark:text-white">{weatherData.apparent_temperature}</p>
                            <p className="font-semibold text-xs dark:text-white">{apparent_temperature_unit}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm dark:text-white">{t('weatherForecast.rainChance')+':'}</p>
                        <div className="flex items-center">
                            <p className="font-semibold text-sm dark:text-white">{weatherData.precipitation_probability}</p>
                            <p className="font-semibold text-sm dark:text-white">{precipitation_probability_unit}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center xs:text-left dark:text-gray-300">{weatherName}</p>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button 
                    className="rounded-full p-1 mr-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer active:bg-slate-400 disabled:bg-slate-50 disabled:cursor-default disabled:pointer-events-none focus-visible:outline-3 focus-visible:outline-slate-500 dark:bg-slate-500 dark:focus-visible:outline-slate-300 dark:hover:bg-slate-600 dark:active:bg-slate-700 dark:active:shadow-none dark:disabled:bg-slate-700"
                    title={geocodingData.is_favourite ? t('unfavouriteButtonTitle') : t('favouriteButtonTitle')}
                    type="button"
                    onClick={() => onLocationFavouriteClick(geocodingData)}
                    disabled={geocodingData.osm_id === -1} // Can't favourite error location
                >
                    <FavouriteIcon className={`size-[22px] shrink-0 ${geocodingData.osm_id === -1 ? 'dark:fill-slate-600 fill-slate-200' : 'fill-rose-400'}`} />
                </button>
                <p className="text-center font-semibold text-lg dark:text-white">{geocodingData.name}</p> 
                <button 
                    className="rounded-full ml-1 group hover:cursor-pointer focus-visible:outline-3 focus-visible:outline-slate-500 dark:focus-visible:outline-slate-300"
                    onClick={() => setOpenGeolocationInfo(!openGeolocationInfo)}
                    title={t('weatherForecast.geolocationInfoButtonTitle')}
                    role="button"
                >
                    <InfoOutline className="size-[18px] bg-white fill-white rounded-full shrink-0 dark:bg-gray-600 group-hover:fill-gray-100 group-active:fill-gray-200"/>
                </button> 
            </div>
            <div className={`flex flex-col items-center overflow-hidden transition-[max-height] duration-350 ease-in-out ${openGeolocationInfo ? 'max-h-100' : 'max-h-0'}`}>
                {geolocationLabels.map((label, index) => (
                    <p key={index} className="text-gray-600 text-base font-mono first-letter:uppercase dark:text-gray-300">{label}</p>
                ))}
                <p className="text-gray-600 text-sm font-mono first-letter:uppercase dark:text-gray-300">{'Lat: ' + geocodingData.lat}</p>
                <p className="text-gray-600 text-sm font-mono first-letter:uppercase dark:text-gray-300">{'Lon: ' + geocodingData.lon}</p>
            </div>
            <div className="flex justify-around">
                <p className="font-mono first-letter:uppercase text-base indent-1 text-center xs:text-left dark:text-white">{weatherData.time.format('dddd, D MMMM HH:mm')}</p>     
            </div>
        </div>
    );
}

export default MainBanner;