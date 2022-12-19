import React, {useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from "axios";
import s from './Author.module.css'

const Author = () => {


    const params = useParams();
    const [author, setAuthor] = useState([]);

    React.useEffect(() => {
        const fecthAuthor = async () => {
            const res = await axios.get(`/api/author/${params.id}`);
            setAuthor(res.data.author);
        }

        fecthAuthor();
    }, [])

    return (<div className={s.list}>
            {author === undefined ? 'Ну подождите пж' : <>
                <p className={s.list__item}>Фамилия: {author.surname}</p>
                <p className={s.list__item}>Имя: {author.name}</p>
                <p className={s.list__item}>Отчество: {author.patronymic}</p>
            </>
            }
        </div>
    );
};

export default Author;

