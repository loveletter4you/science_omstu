import React from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchRid} from "../../../store/slices/RidSlice";
import style from "./Rid.module.css"
import {NavLink} from "react-router-dom";
import Preloader from "../../Helpers/Preloader/Preloader";

const Rid = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const rid = useSelector(state => state.rid);
    const keywords = [];

    React.useEffect(() => {
        dispatch(fetchRid(params.id))
    }, [])

    return (<div className={style.theme}>
            {rid.isFetching === true ? <Preloader/> :
                <div>

                    <div className={style.block}>
                        <div>{rid.title}</div>
                        <div>Дата: {rid.rid_date}</div>
                    </div>

                    <div className={style.block}>
                        <div>Руководитель работы:
                            <NavLink to={"/author/" + rid.work_supervisor.id}>
                                &nbsp;{rid.work_supervisor.surname} {rid.work_supervisor.name} {rid.work_supervisor.patronymic}
                            </NavLink>
                        </div>
                    </div>

                    <div className={style.block}>
                        <div>Руководитель организации:
                            <NavLink to={"/author/" + rid.organization_supervisor.id}>
                                &nbsp;{rid.organization_supervisor.surname} {rid.organization_supervisor.name} {rid.organization_supervisor.patronymic}
                            </NavLink>
                        </div>
                    </div>


                    <div className={style.block}>
                        <div>Исполнитель: <br/>
                            {rid.organization_executor.map(organization =>
                                <div>
                                    <div>{organization.organization.name}</div><br/>
                                    <div className={style.line}>Город: {organization.organization.city}</div>
                                    <div className={style.line}>ОГРН: {organization.organization.ogrn}</div>
                                    <div className={style.line}>ИНН: {organization.organization.inn}</div>

                                </div>
                            )}

                        </div>

                    </div>

                    <div className={style.block}>
                        {/*Добавить city*/}
                        <div>Заказчик: <br/>{rid.customer.name}<br/>
                            <div >
                                <div className={style.line} >Город: {rid.customer.city}</div>
                                <div className={style.line} >ОГРН: {rid.customer.ogrn}</div>
                                <div className={style.line} >ИНН: {rid.customer.inn}</div>
                            </div>
                        </div>
                    </div>

                    <div className={style.block}>
                        Аннотация: <div>{rid.abstract}</div>
                    </div>

                    <div className={style.block}>
                        Предполагаемый тип результата: <div>{rid.rid_type}</div>
                    </div>

                    <div className={style.block}>
                        Предполагаемое закрепление прав: <div>{rid.expected}</div>
                    </div>

                    <div className={style.block}>
                        Возможные направления использования: <div>{rid.using_ways}</div>
                    </div>

                    <div className={style.block}>
                        Количество опытных образцов: <div>{rid.number_of_prototypes}</div>
                    </div>


                    <div className={style.block}>
                        Ключевые слова:
                        {rid.keyword_rids.map(word => {
                                keywords.push(word.keyword.keyword)
                            }
                        )}
                        <div>{keywords.join(", ")}</div>
                    </div>

                    <div className={style.block}>
                        Авторы РИД:

                        {rid.rid_authors.map(author =>

                        <div>
                            <NavLink to={"/author/" + author.author.id}>
                                <div>{author.author.surname} {author.author.name} {author.author.patronymic}</div>
                            </NavLink>
                        </div>

                        )}



                    </div>


                    <table className={style.block}>
                        Дополнительная информация
                        <tbody>
                        {rid.rid_subject.map((subject, index) =>

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

export default Rid;
