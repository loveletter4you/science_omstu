import { useCallback, useState } from "react";

const COLOR_THEME = {
    light: "light",
    dark: "dark"
};

export const useColorTheme = () => {
    const [colorTheme, setColorTheme] = useState(COLOR_THEME.light);

    const changeColorTheme = useCallback((theme = "") => {
        const currentTheme = theme === "" ? COLOR_THEME.light : theme;
        setColorTheme(currentTheme);
        document.documentElement.setAttribute("data-theme", currentTheme);
    }, []);

    const toggleColorTheme = useCallback(() => {
        colorTheme === COLOR_THEME.light
            ? changeColorTheme(COLOR_THEME.dark)
            : changeColorTheme(COLOR_THEME.light);
    }, [colorTheme, changeColorTheme]);

    return { colorTheme, changeColorTheme, toggleColorTheme };
};
