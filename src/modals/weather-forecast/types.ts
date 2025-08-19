import type { GeolocationDataWithFavourite } from "../../components/search-bar/api/types";
import type { ModalProps } from "../base-modal/types";
import { 
    ClearDay, MainlyClearDay, PartlyCloudyDay, OvercastDay, FogDay, DrizzleLightDay, RainLightDay, SnowLightDay, SleetDay, ThunderstormDay, ThunderstormHailLightDay, ThunderstormHailDenseDay,
    ClearNight, MainlyClearNight, PartlyCloudyNight, OvercastNight, FogNight, DrizzleLightNight, RainLightNight, SnowLightNight, SleetNight, ThunderstormNight, ThunderstormHailLightNight, ThunderstormHailDenseNight,
    RaindropFull,
    RaindropThreeQuarter,
    RaindropHalf,
    RaindropQuarter,
    RaindropEmpty,
} from "../../assets/icons";
import type dayjs from "dayjs";
import type { WeatherData } from "../../api/types";

interface WeatherForecastProps extends ModalProps {
    weatherData: WeatherData;
    geolocationData: GeolocationDataWithFavourite;
    onLocationFavouriteClick: (location: GeolocationDataWithFavourite) => void;
}

interface HourlyWeatherData {
    time: dayjs.Dayjs;
    temperature_2m: number;
    apparent_temperature: number;
    precipitation_probability: number;
    weather_code_data: {
        nameString: string;
        icon: Array<React.FunctionComponent<React.SVGProps<SVGSVGElement>>>;
    };
    is_day: number;
}

interface DailyWeatherData {
    time: dayjs.Dayjs;
    temperature_2m_min: number;
    temperature_2m_max: number;
    precipitation_probability_max: number;
    weather_icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const precipitationIconData = [
  { min: 80, icon: RaindropFull },
  { min: 60, icon: RaindropThreeQuarter },
  { min: 40, icon: RaindropHalf },
  { min: 20, icon: RaindropQuarter },
  { min: 0,  icon: RaindropEmpty },
] as const;

export const weatherCodeData: Record<number, {nameString: string, icon: Array<React.FunctionComponent<React.SVGProps<SVGSVGElement>>>}> = {
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
} as const;

export type { WeatherForecastProps, HourlyWeatherData, DailyWeatherData }