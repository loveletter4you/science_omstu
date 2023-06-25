import React from "react";
import style from './Main.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchPublications} from "../../store/slices/PublicationsSlice";
import {fetchAuthor} from "../../store/slices/AuthorsSlice";
import {fetchSources} from "../../store/slices/SourcesSlice";

const Main = () => {
    const publication = useSelector(state => state.publications)
    const author = useSelector(state => state.authors);
    const source = useSelector(state => state.sources);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchPublications({page: 0, pageSize: publication.pageSize}))
        dispatch(fetchAuthor({page: 0, pageSize: author.pageSize}))
        dispatch(fetchSources({page: 0, pageSize: source.pageSize}));
    }, [])

    return <div>
        <div className={style.counts}>
            <div className={style.block}>
                <div className={style.countTitle}>Колличество публикаций <br></br> за последние 10 лет</div>
                <div className={style.count}>{publication.count}</div>
            </div>
            <div className={style.block}>
                <div className={style.countTitle}>Колличество авторов</div>
                <div className={style.count}>{author.count}</div>
            </div>
            <div className={style.block}>
                <div className={style.countTitle}>Колличество источников</div>
                <div className={style.count}>{source.count}</div>
            </div>
        </div>
        <div className={style.container}>
            <h2 className={style.title}>Тестовая версия системы учета научной деятельности сотрудников ОмГТУ</h2>
            <div className={style.instruction}>
                <p><NavLink to={"/publication"}>Публикации</NavLink> - в этом разделе находятся все публикации
                    сотрудников университета (персоналий).</p>
                <div className={style.publicationExample}>
                    <div>Конференция/Журнал</div>
                    <div>Источник</div>
                    <div>Название статьи</div>
                    <div>Автор(-ы)</div>
                    <div>Дата</div>
                </div>
                <p><NavLink to={"/author"}>Персоналии</NavLink> - сотрудники университета, установленные в
                    конфигурационном файле.</p>
                <p><NavLink to={"/source"}>Источники</NavLink> - названия журналов и конференций, упорядоченные по
                    количеству публикаций в системе.</p>
                <p>Данные о публикациях собираются автоматически, используя OpenAlex, а также выгрузок из Scopus, Web of
                    Science, Elibrary.</p>
                <p>Если вы хотите оставить отзыв о системе, указать на ошибку или у вас есть какое-либо предложение по
                    улучшению сайта напишите нам используя функцию обратной связи (она расположена в главном меню, после
                    источников)</p>
            </div>
        </div>
    </div>
}

export default Main;	
