import React, {useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setAuthors} from "../../store/slices/PublicationsSlice";

const AuthorsOfPublication = (props) => {

    const [author, setAuthor] = useState([]);
    const params = props.id;
    const dispatch = useDispatch();
    const authors = useSelector(state => state.publications);

    React.useEffect(() => {
        const fetchPublic = async () => {
            const res = await axios.get(`/api/publication/${params}/authors`);
            dispatch(setAuthors(res.data));
        }
        fetchPublic();
    }, [])

    return (
        <div>
            Авторы:
            {authors.authors.map(a => <div>
                <NavLink to={'/author/'+ a.id}>{a.surname}&nbsp;{a.name}&nbsp;{a.patronymic}</NavLink>
            </div>)}
        </div>
    )

}

export default AuthorsOfPublication;