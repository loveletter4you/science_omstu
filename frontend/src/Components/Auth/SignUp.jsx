import React from "react";
import {useForm} from "react-hook-form";
import s from './SignUp.module.css'

const SignUp = () => {
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const onSubmit = ({data}) => {
        reset();
    }
    return <div className={s.form}>
        <h1>Регистрация</h1>
        <div className={s.inp}>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <div className={s.log}>
                    <input className={s.inp} {...(register('surname',
                        {required: true,
                        }))} placeholder={"Фамилия"} />
                    {errors?.surname && <div className={s.err}>!</div>}
                </div>
                <div className={s.pass}>
                    <input className={s.inp} placeholder={"Имя"}{...(register('name',
                        {required:true}))} />
                    {errors?.name && <div className={s.err}>!</div>}
                </div>
                <div className={s.pass}>
                    <input className={s.inp} placeholder={"Отчество"}{...(register('patronymic',
                        {required:true}))} />
                    {errors?.patronymic && <div className={s.err}>!</div>}
                </div>
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
                <div className={s.pass}>
                    {errors?.password && <div className={s.err}>!</div>}
                    <input className={s.inp} type={"password"} placeholder={"Password"}{...(register('password',
                        {required: true, minLength: 6, maxLength: 30}))} />
                </div>
                <div className={s.rem}>
                    {errors?.repass && <div className={s.err}>!</div>}
                    <input className={s.inp} type={"checkbox"} {...(register('repass',
                        {required: true}))}/> Я согласен с условиями конфиденциальности

                </div>
                <div>
                    <button className={s.btn}>Зарегистрироваться</button>
                </div>
            </form>
        </div>
    </div>
}

export default SignUp;