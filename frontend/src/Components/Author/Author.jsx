import React from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import s from './Author.module.css'
import {useDispatch, useSelector} from "react-redux";
import {setAuthor} from "../../store/slices/AuthorSlice";
import avatar from "../../assets/img/avatar.svg"
import AuthorsPublications from "./AuthorsPublications";
import {setData} from "../../store/slices/PublicationsSlice";
import {getAuthor, getAuthorPublication} from "../api";

const Author = () => {


    const params = useParams();
    const dispatch = useDispatch();
    const author = useSelector(state => state.author);
    const {publications, pageSize, count} = useSelector(state => state.publications);


    React.useEffect(() => {
        const fetchAuthor = async () => {
            const res = await getAuthor(params.id);
            dispatch(setAuthor(res.data));
        }
        fetchAuthor();
    }, [])


    React.useEffect(() => {
        const fetchPublications = async () => {
            const res = await getAuthorPublication(params.id);
            dispatch(setData(res.data));
        }
        fetchPublications();
    }, [pageSize]);

    return (<div>
            {author === undefined ? 'Подождите пожалуйста' : <>
                <div className={s.block}>
                    <img className={s.block__image}
                         src={avatar}
                         alt=""/>
                    <div className={s.block__info}>
                        <p className={s.block__text}>{author.surname} {author.name} {author.patronymic}</p>
                        {author.author_identifiers.map(a=><div>
                            {a.identifier.name}: {a.identifier_value}
                        </div>)}
                    </div>
                </div>
                <div className={s.title}>
                Публикации:
                </div>
                <AuthorsPublications id = {author.id}/>

            </>
            }
        </div>
    );
};

export default Author;

