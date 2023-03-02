import React from "react";
import s from './SignIn.module.css'
import {useForm} from "react-hook-form";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setUserData, setIsAuth} from "../../store/slices/SignInSlice";
import {Navigate} from "react-router-dom";
import { useCookies } from 'react-cookie';

const SignIn = () => {
    const signIn = useSelector(state => state.signIn)
    const {register, formState: {errors}, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    const [_, setCookie] = useCookies(['token']);

    const onSubmit = (data) => {
        dispatch(setUserData(data));
        const postUser = async () => {
            const res = await axios.post("/api/user/token", data, {
                headers: headers
            });
            if (res.status === 200) {
                dispatch(setIsAuth(true));
            }
            setCookie('token', res.data, { path: '/', maxAge: 600});
        }
        postUser();
    };


    return (<div>
            {signIn.isAuth ? <Navigate to={"/publication"}/> :
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <input {...register("username", {required: true})}
                                   aria-invalid={errors.username ? "true" : "false"}/>
                            {errors.username?.type === 'required' && <p role="alert">Login is required</p>}
                        </div>
                        <div>
                            <input type={"password"} {...register("password", {required: true})}
                                   aria-invalid={errors.password ? "true" : "false"}/>
                            {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                        </div>
                        <div>
                            <input type={"checkbox"}/> Запомнить меня
                        </div>
                        <input type="submit"/>
                    </form>
                    <div>

                    </div>
                </div>
            }
        </div>
    );
}

export default SignIn;