import React from "react";
import { 
    InfoOutline, Heart, HeartBroken,
    RaindropFull, RaindropThreeQuarter, RaindropHalf, RaindropQuarter, RaindropEmpty, 
    ClearDay, MainlyClearDay, PartlyCloudyDay, OvercastDay, FogDay, DrizzleLightDay, RainLightDay, SnowLightDay, SleetDay, ThunderstormDay, ThunderstormHailLightDay, ThunderstormHailDenseDay,
    ClearNight, MainlyClearNight, PartlyCloudyNight, OvercastNight, FogNight, DrizzleLightNight, RainLightNight, SnowLightNight, SleetNight, ThunderstormNight, ThunderstormHailLightNight, ThunderstormHailDenseNight,
} from "../../assets/icons";
import Modal from "../Modal";
import type { WeatherForecastProps } from "./types";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import { useTranslation } from "react-i18next";
import('dayjs/locale/pl')
dayjs.extend(utc);
dayjs.extend(weekday);

const WeatherCodeData: Record<number, {nameString: string, icon: Array<React.FunctionComponent<React.SVGProps<SVGSVGElement>>>}> = {
    // Icons with comments use replacements (missing exact icon)
    0: {
        nameString: "ClearSky",
        icon: [ClearNight, ClearDay]
    },
    1: {
        nameString: "MainlyClear", 
        icon: [MainlyClearNight, MainlyClearDay]
    },
    2: {
        nameString: "PartlyCloudy",
        icon: [PartlyCloudyNight, PartlyCloudyDay]
    },
    3: {
        nameString: "Overcast",
        icon: [OvercastNight, OvercastDay]
    },
    45: {
        nameString: "Fog",
        icon: [FogNight, FogDay]
    },
    48: {   //
        nameString: "DepositingRimeFog",
        icon: [FogNight, FogDay]
    },
    51: {
        nameString: "DrizzleLight",
        icon: [DrizzleLightNight, DrizzleLightDay]
    },
    53: {   //
        nameString: "DrizzleModerate",
        icon: [DrizzleLightNight, DrizzleLightDay]
    },
    55: {   //
        nameString: "DrizzleDense",
        icon: [DrizzleLightNight, DrizzleLightDay]
    },
    56: {   //
        nameString: "DrizzleFreezingLight",
        icon: [DrizzleLightNight, DrizzleLightDay]
    },
    57: {   //
        nameString: "DrizzleFreezingDense",
        icon: [DrizzleLightNight, DrizzleLightDay]
    },
    61: {
        nameString: "RainLight",
        icon: [RainLightNight, RainLightDay]
    },
    63: {   //
        nameString: "RainModerate",
        icon: [RainLightNight, RainLightDay]
    },
    65: {   //
        nameString: "RainDense",
        icon: [RainLightNight, RainLightDay]
    },
    66: {   //
        nameString: "RainFreezingLight",
        icon: [RainLightNight, RainLightDay]
    },
    67: {   //
        nameString: "RainFreezingDense",
        icon: [RainLightNight, RainLightDay]
    },
    71: {
        nameString: "SnowLight",
        icon: [SnowLightNight, SnowLightDay]
    },
    73: {   //
        nameString: "SnowModerate",
        icon: [SnowLightNight, SnowLightDay]
    },
    75: {   //
        nameString: "SnowDense",
        icon: [SnowLightNight, SnowLightDay]
    },
    77: {   //
        nameString: "SnowGrains",
        icon: [SleetNight, SleetDay]
    },
    80: {   //
        nameString: "RainShowerLight",
        icon: [RainLightNight, RainLightDay]
    },
    81: {   //
        nameString: "RainShowerModerate",
        icon: [RainLightNight, RainLightDay]
    },
    82: {   //
        nameString: "RainShowerDense",
        icon: [RainLightNight, RainLightDay]
    },
    85: {   //
        nameString: "SnowShowerLight",
        icon: [SnowLightNight, SnowLightDay]
    },
    86: {   //
        nameString: "SnowShowerDense",
        icon: [SnowLightNight, SnowLightDay]
    },
    95: {
        nameString: "ThunderstormLightModerate",
        icon: [ThunderstormNight, ThunderstormDay]
    },
    96: {
        nameString: "ThunderstormHailLight",
        icon: [ThunderstormHailLightNight, ThunderstormHailLightDay]
    },
    99: {
        nameString: "ThunderstormHailDense",
        icon: [ThunderstormHailDenseNight, ThunderstormHailDenseDay]
    },
};

const FavouriteIconData: Record<number, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
    0: Heart,
    1: HeartBroken,
};

const getPrecipitationIcon = (precipitation: number) => {
  if (precipitation >= 80) return RaindropFull;
  if (precipitation >= 60) return RaindropThreeQuarter;
  if (precipitation >= 40) return RaindropHalf;
  if (precipitation >= 20) return RaindropQuarter;
  return RaindropEmpty;
};

const WeatherForecast = (props: WeatherForecastProps) => {
    const { open, onClose, weatherData, geocodingData, onLocationFavouriteClick } = { ...props }
    const { t, i18n } = useTranslation();
    dayjs.locale(i18n.language);

    const now = dayjs();
    const geolocationLabels = geocodingData.display_name.split(',').slice(1);
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
                weather_code_data: WeatherCodeData[weatherData.hourly.weather_code[index]],
                is_day: weatherData.hourly.is_day[index],
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
                weather_icon: WeatherCodeData[weatherData.daily.weather_code[index]].icon[1], // Day version of icon
            })
        )
    , [weatherData]);
    
    const [selectedTime, setSelectedTime] = React.useState<dayjs.Dayjs>(now);
    const [openGeolocationInfo, setOpenGeolocationInfo] = React.useState<boolean>(false);
    const selectedTimeRef = React.useRef<HTMLButtonElement|null>(null);
    const selectedTimeStartOfHour = selectedTime.startOf('hour');
    const selectedTimeIndex = weatherDataHourlyArray.findIndex(data => data.time.isSame(selectedTimeStartOfHour));
    const selectedTimeData = weatherDataHourlyArray[selectedTimeIndex];
    const selectedTimeStartOfDay = selectedTime.startOf('day');
    const selectedTimeDayBeginIndex = weatherDataHourlyArray.findIndex(data => data.time.isSame(selectedTimeStartOfDay));
    const selectedTimeDayEndIndex = selectedTimeDayBeginIndex + 24;
    const SelectedTimeWeatherCodeIcon = selectedTimeData.weather_code_data.icon[selectedTimeData.is_day];
    const SelectedTimeWeatherCodeName = t('weatherForecast.weatherNames.'+selectedTimeData.weather_code_data.nameString);
    const SelectedTimeDayWeatherDataArray = weatherDataHourlyArray.slice(selectedTimeDayBeginIndex, selectedTimeDayEndIndex);
    const FavouriteIcon = FavouriteIconData[+geocodingData.is_favourite];

    // Center view on chosen hour if possible
    React.useEffect(() => {
        selectedTimeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "end" });
    }, [selectedTime])


    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="flex flex-col justify-center">

                {/* Main banner */}
                <div className="mb-8 lg:mb-10 2xl:mb-12  [transition:margin-bottom_350ms]">
                    <div className="flex flex-col xs:flex-row justify-center items-center mb-2">
                        <SelectedTimeWeatherCodeIcon className="size-[108px] lg:size-[138px] 2xl:size-[168px] [transition:width_350ms,height_350ms] shrink-0" />
                        <div className="items-center w-[160px] lg:w-[180px] 2xl:w-[210px] [transition:width_350ms]">
                            <div className="flex justify-center xs:justify-start">
                                <p className="font-bold text-5xl lg:text-6xl 2xl:text-7xl  [transition:font-size_350ms] dark:text-white">{selectedTimeData.temperature_2m}</p>
                                <p className="font-semibold text-2xl lg:text-3xl 2xl:text-4xl  [transition:font-size_350ms] dark:text-white">{temperature_2m_unit}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] dark:text-white">{t('weatherForecast.temperatureApparent')+':'}</p>
                                <div className="flex">
                                    <p className="font-semibold text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] dark:text-white">{selectedTimeData.apparent_temperature}</p>
                                    <p className="font-semibold text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-white">{apparent_temperature_unit}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] dark:text-white">{t('weatherForecast.rainChance')+':'}</p>
                                <div className="flex items-center">
                                    <p className="font-semibold text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] dark:text-white">{selectedTimeData.precipitation_probability}</p>
                                    <p className="font-semibold text-sm lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-white">{precipitation_probability_unit}</p>
                                </div>
                            </div>
                            <p className="text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] text-gray-600 text-center xs:text-left dark:text-gray-300">{SelectedTimeWeatherCodeName}</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <button 
                            className="rounded-full p-1 mr-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer active:bg-slate-400 disabled:bg-slate-50 disabled:cursor-default disabled:pointer-events-none focus-visible:outline-3 focus-visible:outline-slate-500 dark:bg-slate-500 dark:hover:bg-slate-600 dark:active:bg-slate-700 dark:active:shadow-none dark:disabled:bg-slate-700"
                            title={geocodingData.is_favourite ? t('unfavouriteButtonTitle') : t('favouriteButtonTitle')}
                            type="button"
                            onClick={() => onLocationFavouriteClick(geocodingData)}
                            disabled={geocodingData.osm_id === -1} // Can't favourite error location
                        >
                            <FavouriteIcon className={`size-[22px] lg:size-[26px] 2xl:size-[30px] transition-[width_height] duration-350 shrink-0 ${geocodingData.osm_id === -1 ? 'dark:fill-slate-600 fill-slate-200' : 'fill-rose-400'}`} />
                        </button>
                        <p className="text-center font-semibold text-lg lg:text-xl 2xl:text-2xl  [transition:font-size_350ms] dark:text-white">{geocodingData.name}</p> 
                        <button 
                            className="rounded-full ml-1 group hover:cursor-pointer focus-visible:outline-3 focus-visible:outline-slate-500"
                            onClick={() => setOpenGeolocationInfo(!openGeolocationInfo)}
                            title={t('weatherForecast.geolocationInfoButtonTitle')}
                            role="button"
                        >
                            <InfoOutline className="size-[18px] lg:size-[20px] 2xl:size-[22px] [transition:width_350ms,height_350ms] bg-white fill-white rounded-full shrink-0 dark:bg-gray-600 group-hover:fill-gray-100 group-active:fill-gray-200"/>
                        </button> 
                    </div>
                    <div className={`flex flex-col items-center overflow-hidden transition-[max-height] duration-500 ease-in-out ${openGeolocationInfo ? 'max-h-100' : 'max-h-0'}`}>
                        {geolocationLabels.map((label, index) => (
                            <p key={index} className="text-gray-600 text-base lg:text-lg 2xl:text-xl  [transition:font-size_350ms] font-mono first-letter:uppercase dark:text-gray-300">{label}</p>
                        ))}
                        <p className="text-gray-600 text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] font-mono first-letter:uppercase dark:text-gray-300">{'Lat: ' + geocodingData.lat}</p>
                        <p className="text-gray-600 text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] font-mono first-letter:uppercase dark:text-gray-300">{'Lon: ' + geocodingData.lon}</p>
                    </div>
                    <div className="flex justify-around">
                        <p className="font-mono first-letter:uppercase text-base lg:text-lg 2xl:text-xl  [transition:font-size_350ms] indent-1 text-center xs:text-left dark:text-white">{selectedTime.format('dddd, D MMMM HH:mm')}</p>     
                    </div>
                </div>

                {/* Hour list */}
                <ul className="flex flex-nowrap overflow-x-scroll space-x-1 2xl:space-x-2 p-2 bg-gray-200 rounded-xl dark:bg-gray-700 focus-visible:outline-3 focus-visible:outline-slate-500">
                    {SelectedTimeDayWeatherDataArray.map((data, index) => {
                        const DataWeatherIcon = data.weather_code_data.icon[data.is_day];
                        const PrecipitationProbabilityIcon = getPrecipitationIcon(data.precipitation_probability);
                        const isSelected = selectedTimeStartOfHour.isSame(data.time);
                        return (
                        <li key={index} className="inline-block [transition:margin_350ms]">
                            <button 
                                className="flex flex-col items-center p-2 2xl:p-3 [transition:padding_350ms] bg-slate-50 rounded-lg shadow-md outline-none dark:bg-gray-600 dark:hover:bg-slate-700 dark:active:bg-slate-800 dark:disabled:bg-slate-800 hover:cursor-pointer hover:bg-sky-50 active:bg-sky-100 disabled:bg-sky-100 disabled:cursor-default focus-visible:inset-ring-3 focus-visible:inset-ring-slate-500"
                                onClick={() => setSelectedTime(data.time)}
                                disabled={isSelected}
                                title={t('weatherForecast.hourButtonTitle') + ': ' + data.time.format("HH:mm")}
                                ref={isSelected ? selectedTimeRef : undefined}
                                type="button"
                            >
                                <p className="text-gray-600 font-mono text-center text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] dark:text-gray-300">{data.time.format('HH:mm')}</p>
                                <DataWeatherIcon className="size-[48px] lg:size-[56px] 2xl:size-[64px] [transition:width_350ms,height_350ms] bg-white rounded-full shrink-0 dark:bg-gray-500"/>
                                <div className="flex justify-center">
                                    <p className="font-semibold text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] dark:text-white">{data.temperature_2m}</p>
                                    <p className="font-semibold text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-white">{temperature_2m_unit}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <PrecipitationProbabilityIcon className="size-[28px] lg:size-[36px] 2xl:size-[44px] [transition:width_350ms,height_350ms] -ml-1 shrink-0"/>
                                    <div className="flex justify-center">
                                        <p className="text-gray-600 text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] w-[4ch] text-right dark:text-gray-300">{data.precipitation_probability}</p>
                                        <p className="text-gray-600 text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-gray-300">{precipitation_probability_unit}</p>
                                    </div>
                                </div>
                            </button>
                        </li>
                    )})}
                </ul>

                {/* Day list */}
                <ul className="space-y-1 lg:space-y-2 2xl:space-y-3  mt-5 p-4 bg-gray-200 rounded-xl dark:bg-gray-700">
                    {weatherDataDailyArray.map((day, index) => {
                        const PrecipitationProbabilityIcon = getPrecipitationIcon(day.precipitation_probability_max);
                        return (
                            <li key={index} className="[transition:margin_350ms]">
                                <button 
                                    className="w-full flex flex-col xs:flex-row justify-between items-center p-2 2xl:p-3  [transition:padding_350ms] mb-2 bg-slate-50 shadow-md outline-none dark:bg-gray-600 dark:hover:bg-slate-700 dark:active:bg-slate-800 dark:disabled:bg-slate-800 hover:cursor-pointer hover:bg-sky-50 active:bg-sky-100 disabled:bg-sky-100 disabled:cursor-default focus-visible:inset-ring-3 focus-visible:inset-ring-slate-500"
                                    onClick={() => setSelectedTime(day.time.hour(selectedTime.hour()))}
                                    disabled={selectedTimeStartOfDay.isSame(day.time)}
                                    title={t('weatherForecast.dayButtonTitle') + ': ' + day.time.format("dddd")}
                                    type="button"
                                >
                                    <p className="w-full xs:w-[130px] lg:w-[170px] 2xl:w-[220px] text-lg lg:text-xl 2xl:text-2xl  [transition:font-size_350ms,width_350ms] xs:text-left xs:text-base first-letter:uppercase font-semibold dark:text-white">{day.time.format('dddd')}</p>
                                    <div className="flex flex-col-reverse xs:flex-row justify-around w-full xs:justify-between xs:w-[130px] lg:w-[160px] 2xl:w-[190px] [transition:width_350ms] items-center my-2 xs:space-x-8">
                                        <div className="flex justify-center items-center pr-2 xs:pr-0">
                                            <PrecipitationProbabilityIcon className="size-[46px] xs:size-[28px] lg:size-[38px] 2xl:size-[48px] [transition:width_350ms,height_350ms] shrink-0"/>
                                            <p className="text-gray-600 text-sm xs:text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-gray-300">{day.precipitation_probability_max}</p>
                                            <p className="text-gray-600 text-sm xs:text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-gray-300">{precipitation_probability_unit_max}</p>
                                        </div>
                                        <day.weather_icon className="size-[58px] m-1 xs:size-[32px] xs:m-0 lg:size-[42px] 2xl:size-[52px] [transition:width_350ms,height_350ms] bg-white rounded-full shrink-0 dark:bg-gray-500"/>
                                    </div>
                                    <div className="flex justify-center xs:justify-end w-[150px]">
                                        <div className="flex justify-center">
                                            <p className="font-semibold text-base xs:text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] dark:text-white">{day.temperature_2m_max}</p>
                                            <p className="font-semibold text-sm xs:text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-white">{temperature_2m_unit_max}</p>
                                        </div>
                                        <p className="font-semibold text-base xs:text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] indent-1 text-gray-600 dark:text-gray-300">/</p>
                                        <div className="flex justify-center">
                                            <p className="font-semibold text-base xs:text-sm lg:text-base 2xl:text-lg  [transition:font-size_350ms] indent-1 dark:text-white">{day.temperature_2m_min}</p>
                                            <p className="font-semibold text-sm xs:text-xs lg:text-sm 2xl:text-base  [transition:font-size_350ms] dark:text-white">{temperature_2m_unit_min}</p>
                                        </div> 
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ul>

            </div>
        </Modal>
    );
};

export default WeatherForecast;