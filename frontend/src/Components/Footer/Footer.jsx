import React from "react";
import f from './Footer.module.css'
const Footer = () => {
    return <div className={f.appWrapperFooter}>
        <div>Мы используем файлы cookie, чтобы предоставлять и расширять наши услуги,
            а также подбирать контент. Продолжая, вы соглашаетесь на использование файлов cookie.
        </div>
        <div>@2022 ОмГТУ</div>

    </div>
}

export default Footer;