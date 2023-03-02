import React, {useState, useRef} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import n from "../Navbar/Navbar.module.css";
import {NavLink} from "react-router-dom";
import {setIsAuth, setUserData} from "../../store/slices/SignInSlice";


const SignOut = () => {
    const dispatch = useDispatch();
    const logout = () =>{
        dispatch(setIsAuth(false));
        dispatch(setUserData(null));
        /*Cookies.remove("user");*/
    }

    return (<div>
            <button className={n.btn} onClick={logout}>Выйти</button>
        </div>
    );
}

export default SignOut;
