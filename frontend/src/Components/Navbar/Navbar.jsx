import React from "react";
import n from "./Navbar.module.css"
import {NavLink} from "react-router-dom";




const Navbar = () => {
    return <div className={n.appWrapperNavbar}>
        <div className={n.item}>
            <NavLink to="/"  className = { navData => navData.isActive ? n.active : n.item}>Главная</NavLink>
        </div>
        <div className={n.item}>
            <NavLink to="/publications"  className = { navData => navData.isActive ? n.active : n.item}>Публикации</NavLink>
        </div>
        <div className={n.item}>
            <NavLink to="/authors"  className = { navData => navData.isActive ? n.active : n.item}>Авторы</NavLink>
        </div>
        <button className={n.btn}>Login</button>
    </div>
}

export default Navbar;