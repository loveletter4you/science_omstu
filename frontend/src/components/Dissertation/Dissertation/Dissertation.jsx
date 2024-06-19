import React from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchDissertation} from "../../../store/slices/DissertationSlice";
import style from "./Dissertation.module.css"
import {NavLink} from "react-router-dom";
import Preloader from "../../Helpers/Preloader/Preloader";

const Dissertation = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const dissertation = useSelector(state => state.dissertation);
    const keywords = [];

    React.useEffect(() => {
        dispatch(fetchDissertation(params.id))
    }, [])

    return (<div className={style.theme}>
            {dissertation.isFetching === true ? <Preloader/> :
                <div>

                    <div className={style.block}>
                        <div>{dissertation.title}</div>
                        <div>Дата регистрации: {dissertation.dissertation_date}</div>
                        <div>Дата защиты: {dissertation.protection_date}</div>
                    </div>

                    <div className={style.block}>
                        <div>Председатель диссертационного совета:
                            <NavLink to={"/author/" + dissertation.chairman_dissertation_council.id}>
                                &nbsp;{dissertation.chairman_dissertation_council.surname} {dissertation.chairman_dissertation_council.name} {dissertation.chairman_dissertation_council.patronymic}
                            </NavLink>
                        </div>
                    </div>

                    <div className={style.block}>
                        <div>Руководитель организации:
                            <NavLink to={"/author/" + dissertation.organization_supervisor.id}>
                                &nbsp;{dissertation.organization_supervisor.surname} {dissertation.organization_supervisor.name} {dissertation.organization_supervisor.patronymic}
                            </NavLink>
                        </div>
                    </div>


                    <div className={style.block}>
                        {/*Добавить city*/}
                        <div>Сведения об организации, на базе которой создан диссертационный совет, в котором проходила защита диссертации: <br/>{dissertation.protection_organization.name}<br/>
                            <div >
                                <div className={style.line} >Город: {dissertation.protection_organization.city}</div>
                                <div className={style.line} >ОГРН: {dissertation.protection_organization.ogrn}</div>
                                <div className={style.line} >ИНН: {dissertation.protection_organization.inn}</div>
                            </div>
                        </div>
                    </div>


                    <div className={style.block}>

                        <div>Сведения об организации, в которой была выполнена диссертация: <br/>{dissertation.author_organization.name}<br/>
                            <div >
                                <div className={style.line} >Город: {dissertation.author_organization.city}</div>
                                <div className={style.line} >ОГРН: {dissertation.author_organization.ogrn}</div>
                                <div className={style.line} >ИНН: {dissertation.author_organization.inn}</div>
                            </div>
                        </div>
                    </div>

                    <div className={style.block}>
                        Аннотация: <div>{dissertation.abstract}</div>
                    </div>

                    <div className={style.block}>
                        Тип диссертации: <div>{dissertation.dissertation_type}</div>
                    </div>

                    <div className={style.block}>
                        Представлено к защите: <div>{dissertation.dissertation_report_type}</div>
                    </div>

                    <div className={style.block}>
                        Количествово томов: <div>{dissertation.books_count}</div>
                    </div>

                    <div className={style.block}>
                        Количествово таблиц: <div>{dissertation.tables_count}</div>
                    </div>

                    <div className={style.block}>
                        Количествово иллюстраций: <div>{dissertation.pictures_count}</div>
                    </div>

                    <div className={style.block}>
                        Количествово источников: <div>{dissertation.sources_count}</div>
                    </div>

                    <div className={style.block}>
                        Количествово приложений: <div>{dissertation.applications_count}</div>
                    </div>

                    <div className={style.block}>
                        Общее количество страниц: <div>{dissertation.pages_count}</div>
                    </div>

                    <div className={style.block}>
                        Ключевые слова:
                        {dissertation.dissertation_keywords.map(word => {
                                keywords.push(word.keyword.keyword)
                            }
                        )}
                        <div>{keywords.join(", ")}</div>
                    </div>

                    {/*<div className={style.block}>*/}
                    {/*    Авторы РИД:*/}

                    {/*    {rid.rid_authors.map(author =>*/}

                    {/*        <div>*/}
                    {/*            <NavLink to={"/author/" + author.author.id}>*/}
                    {/*                <div>{author.author.surname} {author.author.name} {author.author.patronymic}</div>*/}
                    {/*            </NavLink>*/}
                    {/*        </div>*/}

                    {/*    )}*/}



                    {/*</div>*/}


                    <table className={style.block}>
                        Дополнительная информация
                        <tbody>
                        {dissertation.dissertation_subject.map((subject, index) =>

                            <tr key={index} >
                                <td>{subject.subject.subj_code === null ? '-' : subject.subject.subj_code} </td>
                                &nbsp;<td>{subject.subject.name}</td>
                            </tr>

                        )}
                        </tbody>
                    </table>



                </div>
            }
        </div>
    )
};

// Проверить данные которые вывел и не вывел

export default Dissertation;
