import { Area, AreaChart, CartesianGrid, ReferenceArea, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { WeatherChartProps } from "./types";
import { useTranslation } from "react-i18next";
import { precipitationIconData } from "../../types";
import { ClearDay } from "../../../../assets/icons";
import dayjs from "dayjs";

const WeatherChart = (props: WeatherChartProps) => {
    const { 
        weatherData, 
        selectedTime, setSelectedTime, selectedTimeTemperature,
        temperature_2m_unit, precipitation_probability_unit
    } = { ...props };
    const { t } = useTranslation();

    const isDark = document.querySelector('.dark') !== null; // Needed for custom rechart ticks
    const minTemperature = Math.min(...weatherData.map(d => d.temperature));
    const maxTemperature = Math.max(...weatherData.map(d => d.temperature));
    const minTick = Math.floor((minTemperature - 5) / 5) * 5;
    const maxTick = Math.ceil((maxTemperature + 5) / 5) * 5;
    const tickCount = Math.floor((maxTick - minTick) / 5) + 1;
    const ticks = Array.from({ length: tickCount }, (_, i) => minTick + i * 5);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weatherData}>
                <defs>
                    <pattern
                        id="rainPattern"
                        patternUnits="userSpaceOnUse"
                        width="10" height="10"
                    >
                        <rect width="10" height="10" fill={isDark ? "rgba(39, 147, 255, 0.6)" : "rgba(119, 185, 255, 0.1)"} />
                        <g>
                            <line x1="2" y1="0"  x2="2" y2="5" stroke={isDark ? "rgba(122, 188, 255, 0.7)" : "rgba(183, 219, 255, 0.8)"} strokeWidth="2"/>
                            <line x1="5" y1="2"  x2="5" y2="7" stroke={isDark ? "rgba(122, 188, 255, 0.7)" : "rgba(183, 219, 255, 0.8)"} strokeWidth="2"/>
                            <line x1="8" y1="4"  x2="8" y2="9" stroke={isDark ? "rgba(122, 188, 255, 0.7)" : "rgba(183, 219, 255, 0.8)"} strokeWidth="2"/>
                            <line x1="2" y1="-10" x2="2" y2="-5" stroke={isDark ? "rgba(122, 188, 255, 0.7)" : "rgba(183, 219, 255, 0.8)"}  strokeWidth="2"/>
                            <line x1="5" y1="-8" x2="5" y2="-3" stroke={isDark ? "rgba(122, 188, 255, 0.7)" : "rgba(183, 219, 255, 0.8)"}  strokeWidth="2"/>
                            <line x1="8" y1="-7" x2="8" y2="-1" stroke={isDark ? "rgba(122, 188, 255, 0.7)" : "rgba(183, 219, 255, 0.8)"} strokeWidth="2"/>
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,0; 0,10"
                                dur="1s"
                                repeatCount="indefinite"
                            />
                        </g>
                    </pattern>
                </defs>
                <XAxis
                    dataKey="timeAxis"
                    interval={0}
                    height={0}
                    xAxisId="0"
                />
                <XAxis 
                    dataKey="timeAxis" 
                    height={66}
                    interval="equidistantPreserveStart"
                    xAxisId="1"
                    orientation="top"
                    tick={({ x, y, payload }) => {
                        const data = weatherData.find(data => data.time.isSame(selectedTime, 'day') && data.time.format("HH:mm") === payload?.value);
                        const DataWeatherIcon = data?.weather_code_data?.icon[data?.is_day] ?? ClearDay;
                        const temperature = data?.temperature ?? 0;
                        const isNow = dayjs().format("HH") === data?.time.format("HH");
                        return (
                            <g transform={`translate(${x},${y})`}>
                                <text
                                    dy={-50}
                                    textAnchor="middle"
                                    fill={isDark ? "#D1D5DB" : "#4B5563"}
                                    fontSize={"0.75rem"}
                                >
                                    {isNow ? t('weatherForecast.now') : payload.value}
                                </text>
                                <svg transform="translate(-16,-48)" width={32} height={32} viewBox="0 0 64 64" >
                                    <circle cx={32} cy={32} r={30} fill={isDark ? "#6B7280" : "white"} />
                                    <DataWeatherIcon />
                                </svg>
                                <text
                                    dy={-5}
                                    textAnchor="middle"
                                    fill={isDark ? "#D1D5DB" : "#4B5563"}
                                    fontSize={"0.75rem"}
                                    fontWeight={600}
                                >
                                    {`${temperature}°`}
                                </text>
                            </g>
                        )
                    }}
                />
                <YAxis 
                    dataKey="temperatureAxis" 
                    width={26}
                    tickFormatter={(value: number) => `${Math.round(value)}°`}
                    interval="equidistantPreserveStart"
                    domain={[minTick, maxTick]}
                    ticks={ticks}
                    tick={({ x, y, payload }) => (
                        <text
                            x={x} y={y} dy={4}
                            textAnchor="end"
                            fill={isDark ? "#D1D5DB" : "#4B5563"}
                            fontSize={"0.75rem"}
                            fontWeight={600}
                        >
                            {`${Math.floor(payload?.value)}°`}
                        </text>
                    )}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                    content={({ active, payload, label }: TooltipContentProps<number, string>) => {
                        if (!active || !payload || payload.length === 0) return null;
                        const DataWeatherIcon = payload[0]?.payload?.weather_code_data?.icon[payload[0]?.payload?.is_day];
                        const precipitation = payload[0]?.payload?.precipitation_probability;
                        const PrecipitationProbabilityIcon = precipitationIconData.find(({ min }) => precipitation >= min)!.icon;
                        return (
                            <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg shadow-md outline-none dark:bg-gray-600">
                                <p className="text-gray-600 font-mono text-center text-sm dark:text-gray-300">{label}</p>
                                <DataWeatherIcon className="size-[48px] bg-white rounded-full shrink-0 dark:bg-gray-500"/>
                                <div className="flex justify-center">
                                    <p className="font-semibold text-sm dark:text-white">{payload[0]?.payload?.temperature}</p>
                                    <p className="font-semibold text-xs dark:text-white">{temperature_2m_unit}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <PrecipitationProbabilityIcon className="size-[28px] -ml-1 shrink-0"/>
                                    <div className="flex justify-center">
                                        <p className="text-gray-600 text-xs w-[4ch] text-right dark:text-gray-300">{payload[0]?.payload?.precipitation_probability}</p>
                                        <p className="text-gray-600 text-xs dark:text-gray-300">{precipitation_probability_unit}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="temperatureAxis" 
                    stroke="#8bd1ffff" 
                    fill="#c4e7ffff"
                    fillOpacity={0.2} 
                    strokeWidth={3}
                    activeDot={({ cx, cy, payload }) => (
                        <circle 
                            cx={cx} cy={cy} r={5}
                            fill="#9cdbffff" stroke="#fff" strokeWidth={2}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedTime(payload?.time)}
                        />
                    )}
                />
                <ReferenceDot
                    x={selectedTime.startOf('hour').format("HH:mm")}
                    y={selectedTimeTemperature}
                    r={5}
                    fill="#0091b9ff" stroke="white" strokeWidth={2}
                />
                {
                    weatherData.map((data, index) => 
                        // Don't draw rain on last element
                        index < weatherData.length - 1 && data.precipitation_probability > 35 ?
                        <ReferenceArea 
                            key={index}
                            x1={data.time.format("HH:mm")} 
                            x2={data.time.add(1, 'hour').format("HH:mm")} 
                            y1={Math.floor((minTemperature - 5) / 5) * 5} 
                            y2={Math.ceil((maxTemperature + 5) / 5) * 5} 
                            fill="url(#rainPattern)"
                            strokeOpacity={0.0} 
                            pointerEvents="none"
                        /> : null
                    )
                }
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default WeatherChart;