import { Modal } from "../base-modal";
import React, { useContext } from "react";
import type { ModalProps } from "../base-modal/types";
import { SettingsContext } from "../../contexts";
import { useTranslation } from "react-i18next";

const Settings = (props: ModalProps) => {
    const { open, onClose } = { ...props }
    const { darkMode, setDarkMode, chooseLocationOnClick, setChooseLocationOnClick } = useContext(SettingsContext);
    const { t, i18n } = useTranslation();
    const supportedLanguages = ['en', 'pl'];
    const currentLanguageIndex = supportedLanguages.findIndex(lng => lng === i18n.language);
    const [language, setLanguage] = React.useState(currentLanguageIndex >= 0 ? currentLanguageIndex : 0);

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className="flex items-center justify-center">
                {/* Settings icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" 
                    className="size-[36px] fill-gray-900 mr-2 shrink-0 dark:fill-white"
                >
                    <path d="m9.25 22l-.4-3.2q-.325-.125-.613-.3t-.562-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.337v-.674q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2h-5.5Zm2.8-6.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.012 2.475T12.05 15.5Z"></path>
                </svg>
                <p className="text-2xl font-bold line-clamp-1 dark:text-white">{t('settings.header')}</p>
            </div>
            <ul className="space-y-4 px-5 pt-4 pb-2">

                {/* Dark mode */}
                <li>
                    <button 
                        className="w-full rounded-lg shadow-md border-1 bg-sky-50 border-gray-300 dark:bg-gray-600 dark:border-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-900 hover:bg-sky-100 hover:cursor-pointer active:bg-sky-200 focus-visible:outline-2 focus-visible:outline-slate-600 dark:focus-visible:outline-slate-300"
                        onClick={() => setDarkMode(!darkMode)}    
                        title={t('settings.darkModeButtonTitle')}
                        type="button"
                    >
                        <div className="flex items-center border-b-1 p-2 border-gray-300 dark:border-gray-500">
                            {/* Moon icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24" 
                                className={`size-[28px] fill-gray-300 mr-2 shrink-0 dark:fill-white`}
                            >
                                <path d="M19.9001 2.30719C19.7392 1.8976 19.1616 1.8976 19.0007 2.30719L18.5703 3.40247C18.5212 3.52752 18.4226 3.62651 18.298 3.67583L17.2067 4.1078C16.7986 4.26934 16.7986 4.849 17.2067 5.01054L18.298 5.44252C18.4226 5.49184 18.5212 5.59082 18.5703 5.71587L19.0007 6.81115C19.1616 7.22074 19.7392 7.22074 19.9001 6.81116L20.3305 5.71587C20.3796 5.59082 20.4782 5.49184 20.6028 5.44252L21.6941 5.01054C22.1022 4.849 22.1022 4.26934 21.6941 4.1078L20.6028 3.67583C20.4782 3.62651 20.3796 3.52752 20.3305 3.40247L19.9001 2.30719Z"></path> <path d="M16.0328 8.12967C15.8718 7.72009 15.2943 7.72009 15.1333 8.12967L14.9764 8.52902C14.9273 8.65407 14.8287 8.75305 14.7041 8.80237L14.3062 8.95987C13.8981 9.12141 13.8981 9.70107 14.3062 9.86261L14.7041 10.0201C14.8287 10.0694 14.9273 10.1684 14.9764 10.2935L15.1333 10.6928C15.2943 11.1024 15.8718 11.1024 16.0328 10.6928L16.1897 10.2935C16.2388 10.1684 16.3374 10.0694 16.462 10.0201L16.8599 9.86261C17.268 9.70107 17.268 9.12141 16.8599 8.95987L16.462 8.80237C16.3374 8.75305 16.2388 8.65407 16.1897 8.52902L16.0328 8.12967Z"></path> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                            </svg>
                            <p className="text-xl font-semibold line-clamp-1 font-mono text-gray-300 dark:text-white">{t('settings.darkModeHeader')}</p>
                        </div>
                        <div className="p-2 min-h-[120px]">
                            <p className="text-left text-base text-gray-300 dark:text-white">{t('settings.darkModeText')}</p>
                        </div>
                    </button>
                </li>

                {/* Choose location on click */}
                <li>
                    <button 
                        className={`w-full rounded-lg shadow-md border-1 ${chooseLocationOnClick ? 'bg-sky-300 border-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-900 hover:bg-sky-400 active:bg-sky-200' : 'bg-sky-50 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-700 dark:active:bg-gray-500 hover:bg-sky-100 active:bg-sky-200'} hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-600 dark:focus-visible:outline-slate-300`}
                        onClick={() => setChooseLocationOnClick(!chooseLocationOnClick)}    
                        title={t('settings.forecastOnClickButtonTitle')}
                        type="button"
                    >
                        <div className={`flex items-center border-b-1 p-2 ${chooseLocationOnClick ? 'border-white dark:border-gray-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            {/* Location icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24" 
                                className={`size-[28px] ${chooseLocationOnClick ? 'fill-white' : 'fill-gray-300 dark:fill-gray-600'}`}
                            >
                                <path d="M12 12q.825 0 1.413-.588T14 10q0-.825-.588-1.413T12 8q-.825 0-1.413.588T10 10q0 .825.588 1.413T12 12Zm0 10q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2q3.175 0 5.588 2.225T20 10.2q0 2.5-1.988 5.438T12 22Z"></path>
                            </svg>
                            <p className={`text-xl font-semibold line-clamp-1 font-mono ${chooseLocationOnClick ? 'text-white' : 'text-gray-300 dark:text-gray-600'}`}>{t('settings.forecastOnClickHeader')}</p>
                        </div>
                        <div className="p-2 min-h-[120px]">
                            <p className={`text-left text-base ${chooseLocationOnClick ? 'text-white' : 'text-gray-300 dark:text-gray-600'}`}>{t('settings.forecastOnClickText')}</p>
                        </div>
                    </button>
                </li>

                {/* Language */}
                <li>
                    <button 
                        className={`w-full rounded-lg shadow-md border-1 bg-sky-300 border-gray-400 hover:bg-sky-400 active:bg-sky-200 hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-600 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-900 dark:focus-visible:outline-slate-300`}
                        onClick={() => {
                            const newLng = (language+ 1) >= supportedLanguages.length ? 0 : (language + 1);
                            i18n.changeLanguage(supportedLanguages[newLng]);
                            setLanguage(newLng);
                        }}    
                        title={t('settings.languageButtonTitle')}
                        type="button"
                    >
                        <div className="flex items-center border-b-1 p-2 border-white dark:border-gray-500">
                            <p className="text-2xl font-bold line-clamp-1 font-mono text-white uppercase mr-2 bg-sky-500 shadow-sm px-1 rounded-full dark:bg-sky-600">{i18n.language}</p>
                            <p className="text-xl font-semibold line-clamp-1 font-mono text-white">{t('settings.languageHeader')}</p>
                        </div>
                        <div className="p-2 min-h-[120px]">
                            <p className="text-left text-base text-white">{t('settings.languageText')}</p>
                        </div>
                    </button>
                </li>

            </ul>
        </Modal>
    );
};

export default Settings;