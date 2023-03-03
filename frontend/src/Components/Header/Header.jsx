import React from "react";
import s from './Header.module.css'
import Navbar from "../Navbar/Navbar";
import {useDispatch, useSelector} from "react-redux";

const Header = () => {
    const signIn = useSelector(state => state.signIn)
    const dispatch = useDispatch();

    return <div className={s.header}>
        <div className={s.head}>Science</div>
        <Navbar/>
    </div>
}

export default Header;