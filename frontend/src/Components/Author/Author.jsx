import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import s from './Author.module.css'
import {useDispatch, useSelector} from "react-redux";
import {setAuthor} from "../../store/slices/AuthorSlice";
import avatar from "../../assets/img/avatar.svg"
import AuthorsPublications from "./AuthorsPublications";
import {setData} from "../../store/slices/PublicationsSlice";
import {AuthorAPI, getAuthor, getAuthorPageSize} from "../api";
import {useCookies} from "react-cookie";
import Preloader from "../Preloader/Preloader";

const Author = () => {

    const [cookies, setCookies, removeCookies] = useCookies(['token'])

    const params = useParams();
    const dispatch = useDispatch();
    const author = useSelector(state => state.author);
    const {publications, pageSize, count} = useSelector(state => state.publications);
    const [isFetching, toggleIsFetching] = useState(false);

    React.useEffect(() => {
       toggleIsFetching(true);
       try {
           const fetchAuthor = async () => {
               const res = await AuthorAPI.getAuthor(params.id);
               dispatch(setAuthor(res.data));
               toggleIsFetching(false);
           }
           fetchAuthor();
       } catch (e) {
           console.log(e);
       }
    }, [params.id])


    React.useEffect(() => {
        toggleIsFetching(true);
        try {
            const fetchPublications = async () => {
                const res = await AuthorAPI.getAuthorPageSize(params.id, 0, pageSize)
                dispatch(setData(res.data));
                toggleIsFetching(false);
            }
            fetchPublications();
        } catch (e) {
            console.log(e);
        }
    }, [pageSize]);

    return (<div className={s.theme}>
            {isFetching === true? <Preloader/> :
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
                    <AuthorsPublications/>

                </>
                }
            </div>
            }
        </div>
    );
};

export default Author;

