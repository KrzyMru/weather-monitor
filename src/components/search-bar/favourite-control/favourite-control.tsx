import { useTranslation } from "react-i18next";
import type { FavouriteControlProps } from "./types";
import LoadingCircleSvg from "../../assets/loading-circle-svg";
import FavouriteSvg from "./assets/favourite-svg";

const FavouriteControl = (props: FavouriteControlProps) => {
    const { onClick, disabled, loading } = { ...props }
    const { t } = useTranslation();

    return (
        <button 
            className="relative ml-[3px] bg-slate-200 rounded-r-xl border-l-1 border-gray-300 p-2 disabled:bg-slate-300 disabled:pointer-events-none disabled:cursor-default hover:cursor-pointer hover:bg-slate-300 active:bg-slate-400 focus-visible:outline-3 focus-visible:outline-sky-600 dark:disabled:bg-slate-700 dark:bg-slate-500 dark:border-gray-400 dark:hover:bg-slate-700 dark:active:bg-slate-800 dark:focus-visible:outline-sky-300"
            title={t('favouritesButtonTitle')}
            type="button"
            disabled={disabled}
            onClick={onClick}
        >
            <FavouriteSvg className={`size-[32px] fill-rose-400 shrink-0 transition-[opacity] duration-350 ${loading ? 'opacity-0' : 'opacity-100'}`} />
            <LoadingCircleSvg className={`absolute inset-0 fill-rose-400 animate-spin transition-[opacity] duration-350 ${loading ? 'opacity-100' : 'opacity-0'}`} />
        </button>
    );
}

export default FavouriteControl;