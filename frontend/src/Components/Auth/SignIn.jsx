import React from "react";
import s from './SignIn.module.css'
import {useForm} from "react-hook-form";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setUserData} from "../../store/slices/SignInSlice";

const SignIn = () => {
    const signIn = useSelector(state => state.signIn)
    const {register, formState: {errors}, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    // const headers = {
    //     'Content-Type': 'application/json'
    //     'Authorization': '$coockie_token["token_type"]: $coockie_token["access_token"]"'
    // }
    const onSubmit = (data) => {

        const postUser = async () => {
            const res = await axios.post("/api/user/token", data, {
                headers: headers
            });
            if (res.status === 200) {
                dispatch(setUserData(true))
            }
            console.log(res.status)
        }
        postUser();
    };


    return (<div>
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
    );
}

export default SignIn;