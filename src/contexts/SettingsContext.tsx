import React, { createContext } from 'react';
import type { ContextProviderProps, SettingsContextProps } from './types';

const SettingsContext = createContext<SettingsContextProps>({
    darkMode: false,
    setDarkMode: () => { },
    chooseLocationOnClick: true,
    setChooseLocationOnClick: () => { }
});

const SettingsContextProvider = (props: ContextProviderProps) => {
    const { children } = { ...props }
    const [darkMode, setDarkMode] = React.useState<boolean>(
        () => {
            try {
                const item = localStorage.getItem("darkMode");
                if (item === undefined || item === null)
                    throw new Error();
                return JSON.parse(item);
            } catch (e: unknown) {
                return false;
            }
        }
    );
    const [chooseLocationOnClick, setChooseLocationOnClick] = React.useState<boolean>(
        () => {
            try {
                const item = localStorage.getItem("chooseLocationOnClick");
                if (item === undefined || item === null)
                    throw new Error();
                return JSON.parse(item);
            } catch (e: unknown) {
                return true;
            }
        }
    );

    React.useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);
    React.useEffect(() => {
        localStorage.setItem("chooseLocationOnClick", JSON.stringify(chooseLocationOnClick));
    }, [chooseLocationOnClick]);

    return (
        <SettingsContext.Provider value={{ darkMode, setDarkMode, chooseLocationOnClick, setChooseLocationOnClick }}>
            {children}
        </SettingsContext.Provider>
    )
}

export { SettingsContextProvider, SettingsContext }