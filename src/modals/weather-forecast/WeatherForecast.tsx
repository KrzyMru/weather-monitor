import Modal from "../Modal";
import type { WeatherForecastProps } from "./types";

const WeatherForecast = (props: WeatherForecastProps) => {
    const { open, onClose, weatherData } = { ...props }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="flex items-center justify-center mb-2">
                {/* Results icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" 
                    className={`size-[36px] fill-gray-900 mr-2 shrink-0 transition-[fill] duration-350 dark:fill-white`}
                >
                    <path d="M8 17q.425 0 .713-.288T9 16q0-.425-.288-.713T8 15q-.425 0-.713.288T7 16q0 .425.288.713T8 17Zm0-4q.425 0 .713-.288T9 12q0-.425-.288-.713T8 11q-.425 0-.713.288T7 12q0 .425.288.713T8 13Zm0-4q.425 0 .713-.288T9 8q0-.425-.288-.713T8 7q-.425 0-.713.288T7 8q0 .425.288.713T8 9Zm3 8h6v-2h-6v2Zm0-4h6v-2h-6v2Zm0-4h6V7h-6v2ZM5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z"></path>
                </svg>
                <p className="text-2xl font-bold line-clamp-1 transition-[color] duration-350 dark:text-white">Choose location</p>
            </div>
            <div className="border-b-1 border-gray-300 dark:border-gray-600 [transition:border-color_350ms]" />
            <div>{weatherData.hourly.time.map((e) => <div>{e}</div>)}</div>
        </Modal>
    );
};

export default WeatherForecast;