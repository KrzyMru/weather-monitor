import Modal from "../Modal";
import type { ChooseLocationProps } from "./types";
import type { LocationGeocodingData } from "../../api/types";

const ChooseLocation = (props: ChooseLocationProps) => {
    const { open, onClose, locations, onLocationClick } = { ...props }

    const handleLocationClick = (location: LocationGeocodingData) => {
        onLocationClick(location);
        onClose();
    }

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
            <ul className="flex flex-col space-y-3 pt-6 pb-2">
                {
                    locations.length === 0 ?
                    <p className="text-base text-center lg:text-xl font-sans line-clamp-1 text-gray-600 dark:text-gray-300 [transition:font-size_350ms,color_350ms]">No locations were found</p>
                    :
                    locations.map(location => (
                    <button
                        className="bg-slate-100 rounded-lg shadow-md p-2 transition-[background-color] duration-350 dark:bg-gray-600 dark:hover:bg-gray-500 dark:active:bg-gray-400 dark:focus-visible:outline-sky-300 hover:duration-100 hover:cursor-pointer hover:bg-slate-200 active:bg-slate-300 focus-visible:duration-0 focus-visible:outline-3 focus-visible:outline-sky-600"
                        title={"Load weather forecast for: " + location.display_name}
                        onClick={() => handleLocationClick(location)}
                    >
                        <p className="text-left text-xl font-semibold font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{location.name}</p>
                        <p className="text-left text-base font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{location.addresstype + ', ' + (location.address.county ? location.address.county + ', ' : '') + location.address.state}</p>
                        <p className="text-left text-sm font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{'Lat: ' + location.lat}</p>
                        <p className="text-left text-sm font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{'Lon: ' + location.lon}</p>
                        <p className="text-left text-base font-mono first-letter:uppercase transition-[color] duration-350 dark:text-white">{location.address.country}</p>
                    </button>
                    ))
                }
            </ul>
        </Modal>
    );
};

export default ChooseLocation;