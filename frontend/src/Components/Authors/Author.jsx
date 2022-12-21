import React, {useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from "axios";
import s from './Author.module.css'
import {useDispatch, useSelector} from "react-redux";
import {setAuthor} from "../../store/slices/authorSlice";

const Author = () => {


    const params = useParams();
    // const [author, setAuthor] = useState([]);

    const dispatch = useDispatch();
    const author = useSelector(state => state.author);
    const identifiers = author.identifiers;
    console.log(author);

    React.useEffect(() => {
        const fecthAuthor = async () => {
            const res = await axios.get(`/api/author/${params.id}`);
            dispatch(setAuthor(res.data));
        }

        fecthAuthor();
    }, [])

    return (<div>
            {author === undefined ? 'Ну подождите пж' : <>
                <div className={s.block}>
                    <img className={s.block__image}
                         src="https://yt3.ggpht.com/ytc/AKedOLT51aPd9DvTdZwDGPIek8Q0dyfxdZ0iaqok41yx1RQ=s900-c-k-c0x00ffffff-no-rj"
                         alt=""/>
                    <div className={s.block__info}>
                        <p className={s.block__text}>{author.surname} {author.name} {author.patronymic}</p>

                        { identifiers === undefined ? '' :identifiers.map(i => <p className={s.block__identifiers}>
                            {i.identifier_info.name}: {i.identifier}
                        </p>)}
                    </div>
                </div>
            </>
            }
        </div>
    );
};

export default Author;

