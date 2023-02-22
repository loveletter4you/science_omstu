import React, {useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from "axios";
import s from './Author.module.css'
import {useDispatch, useSelector} from "react-redux";
import {setAuthor} from "../../store/slices/AuthorSlice";
import avatar from "../../assets/img/avatar.svg"
import {setPublic} from "../../store/slices/AuthorsPublications";

const Author = () => {


    const params = useParams();
    const dispatch = useDispatch();
    const author = useSelector(state => state.author);
    const publications = useSelector(state => state.AuthorsPublications)

    React.useEffect(() => {
        const fetchAuthor = async () => {
            const res = await axios.get(`/api/author/${params.id}`);
            dispatch(setAuthor(res.data));
        }
        fetchAuthor();
    }, [])

    React.useEffect(() => {
        const fetchPublic = async () => {
            const res = await axios.get(`/api/author/${params.id}/publications`);
            dispatch(setPublic(res.data));
        }
        fetchPublic();
    }, [])

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
                
            </>
            }
        </div>
    );
};

export default Author;

