import { useTranslation } from "react-i18next";
import SettingsSvg from "./assets/settings-svg";
import type { SettingsControlProps } from "./types";

const SettingsControl = (props: SettingsControlProps) => {
    const { onClick } = { ...props }
    const { t } = useTranslation();

    return (
        <div className="absolute bottom-4 left-4 lg:bottom-auto lg:top-4 z-999">
            <button 
                className="bg-slate-100 border-1 border-gray-300 rounded-full shadow-xl p-2 hover:cursor-pointer hover:bg-slate-200 active:bg-slate-300 focus-visible:duration-0 focus-visible:outline-3 focus-visible:outline-sky-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:active:bg-gray-400 dark:focus-visible:outline-sky-300"
                title={t('settingsButtonTitle')}
                type="button"
                onClick={onClick}
            >
                <SettingsSvg className="size-[32px] shrink-0 fill-gray-900 dark:fill-white"/>
            </button>
        </div>
    );
}

export default SettingsControl;