import React from "react";
import s from './Search.module.css'

const Search = () => {
    return <input className={s.search} placeholder='Поиск' type="text"/>
}

export default Search;
