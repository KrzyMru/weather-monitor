interface SettingsContextProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    chooseLocationOnClick: boolean;
    setChooseLocationOnClick: (enabled: boolean) => void;
}

interface ContextProviderProps {
    children: React.ReactNode;
}

export type { ContextProviderProps, SettingsContextProps }