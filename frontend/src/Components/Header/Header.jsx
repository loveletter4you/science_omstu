import React from "react";
import s from './Header.module.css'
import logo from '../../assets/img/logo.png'
import Navbar from "../Navbar/Navbar";
import {useDispatch, useSelector} from "react-redux";
import {setIsAuth} from "../../store/slices/SignInSlice";

const Header = () => {
    const signIn = useSelector(state => state.signIn)
    const dispatch = useDispatch();

/*
    const readCookie = () => {
        const user = Cookies.get("user");
        if(user){
            dispatch(setIsAuth(true));
        }
    }
    React.useEffect(()=>{
        readCookie();
    })
*/

    return <div className={s.header}>
        <div className={s.head}>Science</div>
        <Navbar/>
    </div>
}

export default Header;