import {useCallback, useEffect, useState} from "react";
import {useCookies} from "react-cookie";

const COLOR_THEME = {
    light: "light",
    dark: "dark"
};

export const useColorTheme = () => {
    const [colorTheme, setColorTheme] = useState(COLOR_THEME.light);
    const [cookiesTheme, setCookiesTheme] = useCookies(['theme'])

    const changeColorTheme = useCallback((theme = "") => {
        const currentTheme = theme === "" ? COLOR_THEME.light : theme;
        setColorTheme(currentTheme);
        document.documentElement.setAttribute("data-theme", currentTheme);
    }, []);


    const toggleColorTheme = useCallback(() => {
        if (colorTheme === COLOR_THEME.light) {
            changeColorTheme(COLOR_THEME.dark)
            setCookiesTheme('theme', COLOR_THEME.dark, {path: '/', maxAge: 60 * 60 * 24 * 30, secure: true});
        }
        else {
            changeColorTheme(COLOR_THEME.light);
            setCookiesTheme('theme', COLOR_THEME.light, {path: '/', maxAge: 60 * 60 * 24 * 30, secure: true});
        }
    }, [colorTheme, changeColorTheme]);

    return {colorTheme, changeColorTheme, toggleColorTheme};
};
