import React from "react";
import {NavLink} from "react-router-dom";
import s from "./AllAuthors.module.css"

const AllAuthors = (props) => {
    return <div>
        <div className={s.item}>Авторы:</div>
        <div className={s.item}>Фамилия Имя Отчество:</div>
        <div className={s.item}>
            {props.authors.map(a => <div key={a.id}>
                <NavLink to={'/author/' + a.id}>
                    <div className={s.line}><div className={s.first}>{a.surname} &nbsp;</div></div>
                    <div className={s.line}><div className={s.first}>{a.name} &nbsp;</div></div>
                        <div className={s.line}><div className={s.first}>{a.patronymic} &nbsp;</div></div>
                </NavLink></div>)}
        </div>
    </div>
}
export default AllAuthors;