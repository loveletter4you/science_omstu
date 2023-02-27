import React from "react";
import s from './Header.module.css'
import logo from '../../assets/img/logo.png'
import Navbar from "../Navbar/Navbar";
import BugTracker from "../Bugtracker/Bugtracker";

const Header = () => {
    return <div className={s.header}>
        <div className={s.head}>Science</div>

        <Navbar/>
    </div>
}

export default Header;