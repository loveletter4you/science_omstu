import React from "react";
import {useDispatch} from "react-redux";
import style from "./../Header/Navbar/Navbar.module.css";
import {setIsAuth} from "../../store/slices/SignInSlice";
import {useCookies} from 'react-cookie';


const SignOut = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['token'])
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(setIsAuth(false));
        removeCookies('token', {path: '/'});

    }
    return (<div>
            <button className={style.btn} onClick={logout}>Выйти</button>
        </div>
    );
}

export default SignOut;
