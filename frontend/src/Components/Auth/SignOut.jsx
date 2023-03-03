import React from "react";
import {useDispatch, useSelector} from "react-redux";
import n from "../Navbar/Navbar.module.css";
import {setIsAuth, setToken, setUserData} from "../../store/slices/SignInSlice";
import { useCookies } from 'react-cookie';


const SignOut = () => {
    const signIn = useSelector(state => state.signIn)
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const logout = () =>{
        dispatch(setIsAuth(false));
        removeCookie('token', {path:'/'});
        dispatch(setToken(cookies.token));

    }

    return (<div>
            <button className={n.btn} onClick={logout}>Выйти</button>

        </div>
    );
}

export default SignOut;
