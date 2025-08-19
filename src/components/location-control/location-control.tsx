import { useTranslation } from "react-i18next";
import type { LocationControlProps } from "./types";
import LoadingCircleSvg from "../assets/loading-circle-svg";
import LocationSvg from "./assets/location-svg";

const LocationControl = (props: LocationControlProps) => {
    const { onClick, disabled, loading } = { ...props }
    const { t } = useTranslation();

    return (
        <div className="absolute bottom-4 right-4 xs:bottom-auto xs:top-4 z-999">
            <button 
                className="relative bg-slate-100 border-1 border-gray-300 rounded-full shadow-xl p-2 hover:cursor-pointer hover:bg-slate-200 active:bg-slate-300 disabled:cursor-default disabled:pointer-events-none focus-visible:outline-3 focus-visible:outline-sky-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:active:bg-gray-400 dark:focus-visible:outline-sky-300"
                title={t('locationButtonTitle')}
                type="button"
                onClick={onClick}
                disabled={disabled}
            >
                <LocationSvg className={`size-[32px] shrink-0 ${loading ? 'fill-gray-300 dark:fill-gray-700' : 'fill-gray-900 dark:fill-white'}`} />
                <LoadingCircleSvg className={`absolute inset-0 fill-gray-500 animate-spin transition-[opacity] duration-350 ${loading ? 'opacity-100' : 'opacity-0'} dark:fill-gray-400`} />
            </button>
        </div>
    );
}

export default LocationControl;