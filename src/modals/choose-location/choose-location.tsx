import { Modal } from "../base-modal";
import type { ChooseLocationProps } from "./types";
import { useTranslation } from "react-i18next";
import { Heart, HeartBroken } from "../../assets/icons";
import React from "react";
import type { GeolocationDataWithFavourite } from "../../components/search-bar/api/types";

const FavouriteIconData: Record<number, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
    0: Heart,
    1: HeartBroken,
};

const ChooseLocation = (props: ChooseLocationProps) => {
    const { open, onClose, locations, onLocationClick, onLocationFavouriteClick } = { ...props }
    const { t } = useTranslation();

    const handleLocationClick = (location: GeolocationDataWithFavourite) => {
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
                    className={`size-[36px] fill-gray-900 mr-2 shrink-0 dark:fill-white`}
                >
                    <path d="M8 17q.425 0 .713-.288T9 16q0-.425-.288-.713T8 15q-.425 0-.713.288T7 16q0 .425.288.713T8 17Zm0-4q.425 0 .713-.288T9 12q0-.425-.288-.713T8 11q-.425 0-.713.288T7 12q0 .425.288.713T8 13Zm0-4q.425 0 .713-.288T9 8q0-.425-.288-.713T8 7q-.425 0-.713.288T7 8q0 .425.288.713T8 9Zm3 8h6v-2h-6v2Zm0-4h6v-2h-6v2Zm0-4h6V7h-6v2ZM5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z"></path>
                </svg>
                <p className="text-2xl pb-1 font-bold line-clamp-1 dark:text-white">{t('chooseLocation.header')}</p>
            </div>
            <div className="border-b-1 border-gray-300 dark:border-gray-600" />
            <ul className="flex flex-col space-y-3 pt-6 pb-2">
                {
                    locations.length === 0 ?
                    <div className="h-30">
                        <p className="text-base text-center font-sans line-clamp-1 text-gray-600 dark:text-gray-300">{t('chooseLocation.noLocationsFound')}</p>
                    </div>
                    :
                    locations.map((location) => {
                        const geolocationLabels = location.display_name.split(',').slice(1);
                        const FavouriteIcon = FavouriteIconData[+location.is_favourite];
                        return (
                            <li key={location.osm_id}>
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="relative w-full overflow-hidden bg-slate-100 rounded-lg shadow-md p-2 hover:cursor-pointer [&:not(:has(button:hover))]:hover:bg-slate-200 [&:not(:has(button:hover))]:active:bg-slate-300 focus-visible:outline-3 focus-visible:outline-sky-600 dark:bg-gray-600 [&:not(:has(button:hover))]:dark:hover:bg-slate-600 [&:not(:has(button:hover))]:dark:active:bg-slate-700 dark:focus-visible:outline-sky-300"
                                    title={t('chooseLocation.locationButtonTitle') + ': ' + location.display_name}
                                    onClick={() => handleLocationClick(location)}
                                    onKeyDown={(event) => {
                                        if (event.currentTarget === event.target // for event bubbling from children on key press
                                            && event.key === 'Enter' || event.key === ' ')
                                            handleLocationClick(location)
                                    }}
                                >
                                    <button 
                                        className="absolute top-0 right-0 rounded-bl-full bg-slate-400 pt-1 pb-2 pl-2 pr-1 shadow-lg hover:bg-slate-500 hover:cursor-pointer active:bg-slate-600 focus-visible:outline-3 focus-visible:outline-slate-600 dark:bg-slate-500 dark:focus-visible:outline-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-800 dark:active:shadow-none"
                                        title={location.is_favourite ? t('unfavouriteButtonTitle') : t('favouriteButtonTitle')}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onLocationFavouriteClick(location);
                                        }}
                                    >
                                        <FavouriteIcon className="size-[18px] fill-rose-400 shrink-0" />
                                    </button>
                                    <p className="text-left text-xl font-semibold font-mono first-letter:uppercase dark:text-white">{location.name}</p>
                                    <div className="flex flex-wrap space-x-2">
                                        {geolocationLabels.slice(0, -1).map((label, index) => (
                                            <p key={index} className="text-left text-base font-mono first-letter:uppercase dark:text-white inline-block">{label + ', '}</p>
                                        ))}
                                    </div>
                                    <p className="text-left text-base font-mono first-letter:uppercase dark:text-white">{geolocationLabels[geolocationLabels.length-1]}</p>
                                    <p className="text-left text-sm font-mono first-letter:uppercase dark:text-white">{'Lat: ' + location.lat}</p>
                                    <p className="text-left text-sm font-mono first-letter:uppercase dark:text-white">{'Lon: ' + location.lon}</p>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </Modal>
    );
};

export default ChooseLocation;