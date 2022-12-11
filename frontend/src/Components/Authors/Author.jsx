import React from "react";

const Author = (props) => {
    if (!props.author) {
        return <div>нет автора</div>
    }
    return <div>
        <div>Фамилия: {props.author.author.surname}</div>
        <div>Имя: {props.author.author.name}</div>
        <div>Отчество: {props.author.author.patronymic}</div>
        {props.author.identifiers.map(i => {
            return (<div>{i.identifier_info.name}: {i.identifier}</div>
            )
        })}
    </div>
}

export default Author;