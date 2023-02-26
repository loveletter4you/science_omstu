import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import s from './Author.module.css'
import {useDispatch, useSelector} from "react-redux";
import {setAuthor} from "../../store/slices/AuthorSlice";
import avatar from "../../assets/img/avatar.svg"
import AuthorsPublications from "./AuthorsPublications";
import {setData} from "../../store/slices/PublicationsSlice";
import preloader from "./../../assets/img/preloader.svg"

const Author = () => {


    const params = useParams();
    const dispatch = useDispatch();
    const author = useSelector(state => state.author);
    const {publications, pageSize, count} = useSelector(state => state.publications);
    const [isFetching, toggleIsFetching] = useState(false);

    React.useEffect(() => {
       toggleIsFetching(true);
        const fetchAuthor = async () => {
            const res = await axios.get(`/api/author/${params.id}/`);
            dispatch(setAuthor(res.data));
            toggleIsFetching(false);
        }
        fetchAuthor();
    }, [params.id])


    React.useEffect(() => {
        toggleIsFetching(true);
        const fetchPublications = async () => {
            const res = await axios.get(`/api/author/${params.id}/publications?page=0&limit=${pageSize}`);
            dispatch(setData(res.data));
            toggleIsFetching(false);
        }
        fetchPublications();
    }, [pageSize]);

    return (<div>
            {isFetching === true? <img src={preloader} alt=""/> :
            <div>
                {author === undefined ? 'Подождите пожалуйста' : <>
                    <div className={s.block}>
                        <img className={s.block__image}
                             src={avatar}
                             alt=""/>
                        <div className={s.block__info}>
                            <p className={s.block__text}>{author.surname} {author.name} {author.patronymic}</p>
                            {author.author_identifiers.map(a => <div>
                                {a.identifier.name}: {a.identifier_value}
                            </div>)}
                        </div>
                    </div>
                    <div className={s.title}>
                    </div>
                    <AuthorsPublications id={author.id}/>

                </>
                }
            </div>
            }
        </div>
    );
};

export default Author;

