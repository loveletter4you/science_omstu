import React from "react";
import style from './Main.module.css'
import {NavLink} from "react-router-dom";

const Main = () => {
    return <div>
        <div className={style.container}>
            <h2 className={style.title}>Тестовая версия системы учета научной деятельности сотрудников ОмГТУ</h2>
            <div className={style.instruction}>
                <p><NavLink to={"/publication"}>Публикации</NavLink> - в этом разделе находятся все публикации сотрудников университета (персоналий).</p>
                <div className={style.publicationExample}>
                    <div>Конференция/Журнал</div>
                    <div>Источник</div>
                    <div>Название статьи</div>
                    <div>Автор(-ы)</div>
                    <div>Дата</div>
                </div>
                <p><NavLink to={"/author"}>Персоналии</NavLink> - сотрудники университета, установленные в конфигурационном файле.</p>
                <p><NavLink to={"/source"}>Источники</NavLink> - названия журналов и конференций, упорядоченные по количеству публикаций в системе.</p>
                <p>Данные о публикациях собираются автоматически, используя OpenAlex, а также выгрузок из Scopus, Web of Science, Elibrary.</p>
                <p>Если вы хотите оставить отзыв о системе, указать на ошибку или у вас есть какое-либо предложение по
                    улучшению сайта напишите нам используя функцию обратной связи (она расположена в главном меню, после источников)</p>
            </div>
        </div>
    </div>
}

export default Main;	
