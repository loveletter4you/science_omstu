import React from "react";
import {useForm} from "react-hook-form";
import s from './Auth.module.css'
import {NavLink} from "react-router-dom";

const Auth = () => {
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const onSubmit = ({data}) => {
        reset();
    }
    return <div className={s.form}>
        <h1>Вход</h1>
        <div className={s.inp}>
        <form onSubmit = {handleSubmit(onSubmit)}>
            <div className={s.log}>
                {errors?.login && <div className={s.err}>!</div>}
                <input className={s.inp} {...(register('login',
                    {required: true, minLength: 5, maxLength: 40
                        }))} placeholder={"Login"} />
            </div>
            <div className={s.pass}>
                {errors?.password && <div className={s.err}>!</div>}
                <input className={s.inp} type={"password"} placeholder={"Password"}{...(register('password',
                    {required: true, minLength: 6, maxLength: 30}))} />
            </div>
            <div className={s.rem}>
                <label className={s.container}>
                <input className={s.inp} type={"checkbox"}/> Запомнить меня
                    <span className={s.highload}></span>
                </label>
            </div>
            <div>
                <button className={s.btn}>Войти</button>
            </div>
            <div className={s.reg}><NavLink to={"/registration"}>Зарегистрироваться</NavLink></div>
            <div className= {s.reg}><NavLink to={"/recovery"}>Забыли пароль?</NavLink></div>
        </form>
        </div>

    </div>
}

export default Auth;