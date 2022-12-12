import React from "react";
import s from "./Author.module.css"

const Author = (props) => {
    if (!props.author) {
        return <div>Ошибка</div>
    }

    return <div>
        <div className={s.item}> <div className={s.first}>Фамилия: </div><div className={s.first}>{props.author.author.surname}</div></div>
        <div>Имя: {props.author.author.name}</div>
        <div>Отчество: {props.author.author.patronymic}</div>
        {props.author.identifiers.map(i => {
            return (<div>{i.identifier_info.name}: {i.identifier}</div>
            )
        })}
    </div>
}

export default Author;