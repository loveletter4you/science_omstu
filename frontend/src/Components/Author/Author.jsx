import React, {useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from "axios";
import s from './Author.module.css'
import {useDispatch, useSelector} from "react-redux";
import {setAuthor, setPublic} from "../../store/slices/AuthorSlice";
import avatar from "../../assets/img/avatar.svg"

const Author = () => {


    const params = useParams();
    // const [author, setAuthor] = useState([]);

    const dispatch = useDispatch();
    const author = useSelector(state => state.author);
    const publication = author.publications;
    const identifiers = author.identifiers;

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
                        { identifiers === undefined ? '' :identifiers.map(i => <p className={s.block__identifiers}>
                            {i.identifier_info.name}: {i.identifier}
                        </p>)}
                    </div>
                </div>
                <div className={s.title}>
                Публикации:
                </div>
                <div>{publication === undefined? ' ' : publication.map(p => <div className={s.public}>
                    <p>{p.type.name}</p>
                    <NavLink to={"/publication/" + p.id}><p>{p.title}</p></NavLink>
                    <p>{p.source.Name}</p>
                    <p>{p.publication_date}</p>
                </div>)}</div>
            </>
            }
        </div>
    );
};

export default Author;

