import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import s from "./Admin.module.css";

const Admin = () => {
    const [Active, setActive] = useState(false);
    const toggle = () => {
        setActive(!Active);
    }

    return (
        <div className={s.AdminWrapper}>
            <div className={s.burger} onClick={toggle}>
                <span></span>
            </div>
            <div className={Active ? s.menu + " " + s.active : s.menu}>
                <div className={s.menuItems}>
                    <div className={s.item} onClick={toggle}>
                        <NavLink to="/admin/feedbacks">Сообщения пользователей</NavLink>
                    </div>
                    <div className={s.item} onClick={toggle}>
                        <NavLink to="/admin/upload">Загрузка данных</NavLink>
                    </div>
                </div>

            </div>
        </div>
    )

}
export default Admin;