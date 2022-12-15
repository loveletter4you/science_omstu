import React from "react";
import s from "./Author.module.css"

const Author = (props) => {
    if (!props.author) {
        return <div>Ошибка</div>
    }

    return <div className={s.author}>
        <div className={s.item}>
            <div className={s.first}>Фамилия:&nbsp;</div>
            <div className={s.first}>{props.author.author.surname}</div>
        </div>

        <div>Имя: {props.author.author.name}</div>

        <div>Отчество: {props.author.author.patronymic}</div>

        {props.author.identifiers.map(i => {
            return (<div>{i.identifier_info.name}: {i.identifier}</div>
            )
        })}
    </div>
}

export default Author;