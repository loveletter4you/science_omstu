import React from "react";
import {NavLink} from "react-router-dom";

const AllAuthors = (props) => {

    return <div>
        <div>
            {props.authors.map(a => <div key={a.id}>
                <NavLink to={'/author/' + a.id}>
                    {a.surname} {a.name} {a.patronymic}
                </NavLink></div>)}
        </div>
    </div>
}
export default AllAuthors;