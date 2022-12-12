import React from "react";
import {NavLink} from "react-router-dom";
import s from "./AllAuthors.module.css"

const AllAuthors = (props) => {

    return <div>
        <div className={s.item}>
            {props.authors.map(a => <div key={a.id}>
                <NavLink to={'/author/' + a.id}>
                    {a.surname} {a.name} {a.patronymic}
                </NavLink></div>)}
        </div>
    </div>
}
export default AllAuthors;