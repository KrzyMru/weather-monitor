import type dayjs from "dayjs";

type ChartWeatherData = {
    timeAxis: string;
    temperatureAxis: number;
    time: dayjs.Dayjs;
    temperature: number;
    precipitation_probability: number;
    weather_code_data: {
        nameString: string;
        icon: Array<React.FunctionComponent<React.SVGProps<SVGSVGElement>>>;
    };
    is_day: number;
};

interface WeatherChartProps {
    weatherData: ChartWeatherData[],
    selectedTime: dayjs.Dayjs,
    setSelectedTime: (newTime: dayjs.Dayjs) => void,
    selectedTimeTemperature: number,
    temperature_2m_unit: string,
    precipitation_probability_unit: string,
}

export type { WeatherChartProps }