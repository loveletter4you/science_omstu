import React, {useState, useEffect} from "react";
import n from "./Navbar.module.css"
import {NavLink} from "react-router-dom";
import BugTracker from "../Bugtracker/Bugtracker";
import {useColorTheme} from "../Theme/Theme";
import theme from "./../../assets/img/theme-dark.png"
import {useSelector} from "react-redux";
import SignOut from "../Auth/SignOut";
import {useCookies} from "react-cookie";

const Navbar = () => {

    const signIn = useSelector(state => state.signIn)
    const [Active, setActive] = useState(false);
    const toggle = () => {
        setActive(!Active);
    }
    const [cookiesTheme, setCookiesTheme] = useCookies(['theme']);
    const {colorTheme, toggleColorTheme} = useColorTheme();

    useEffect(() => {
        if (cookiesTheme.theme !== colorTheme) {
            toggleColorTheme();
        }
    }, [])
    const onChangeTheme = () => {
        document.getElementById("app-wrapper").style.transition = '.5s ease-in-out';
        toggleColorTheme();
    };

    useEffect(() => {
        if (Active === true && window.innerWidth < 991) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [Active]);


    return (
        <div className={n.appWrapperNavbar}>

            <div className={n.burger} onClick={toggle}>
                <span></span>
            </div>
            <div className={Active ? n.back : null}>
                <div className={Active ? n.menu + " " + n.active : n.menu}>
                    <div className={n.item} onClick={toggle}>
                        <NavLink to="/publication"
                                 className={navData => navData.isActive ? n.active : null}>Публикации</NavLink>
                    </div>
                    <div className={n.item} onClick={toggle}>
                        <NavLink to="/author"
                                 className={navData => navData.isActive ? n.active : null}>Персоналии</NavLink>
                    </div>
                    <div className={n.item} onClick={toggle}>
                        <NavLink to="/source"
                                 className={navData => navData.isActive ? n.active : null}>Источники</NavLink>
                    </div>
                    {signIn.isAuth ? <div className={n.item} onClick={toggle}>
                        <NavLink to="/admin/feedbacks">Администратор</NavLink>
                    </div> : null}
                    <div className={n.item}>
                        <BugTracker/>
                    </div>
                    <div className={n.item} onClick={onChangeTheme}>
                        <img src={theme} className={n.image}/>
                    </div>
                    <div>
                        {signIn.isAuth ?
                            <div onClick={toggle}><SignOut/></div> :
                            <NavLink to="/login">
                                <button className={n.btn} onClick={toggle}>Войти</button>
                            </NavLink>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;