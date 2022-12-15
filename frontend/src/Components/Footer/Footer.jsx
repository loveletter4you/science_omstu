import React from "react";
import s from './Footer.module.css'




const Footer = () => {
    return <div className={s.footer}>
        <p>
            Мы используем файлы cookie, чтобы предоставлять и расширять наши услуги,  а также подбирать контент.
            Продолжая, вы соглашаетесь на использование файлов cookie.
        </p>
        <p>@2022 ОмГТУ</p>

    </div>
}

export default Footer;