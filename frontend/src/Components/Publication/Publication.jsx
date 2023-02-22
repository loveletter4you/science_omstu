import React from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setPublic} from "../../store/slices/PublicationSlice";
import s from "./Publication.module.css"
import {NavLink} from "react-router-dom";

const Publication = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const publication = useSelector(state => state.publication);


    React.useEffect(() => {
        const fetchPublic = async () => {
            const res = await axios.get(`/api/publication/${params.id}`);
            dispatch(setPublic(res.data));
        }
        fetchPublic();
    }, [])

    return (<div>
            <div className={s.block}>
                <div>{publication.publication_type.name}</div>
                <div>{publication.source.name}</div>
                <div>{publication.title}</div>
                <div>{publication.publication_date}</div>
                <div>{publication.publication_authors.map(a=><div>
                    <NavLink to={'/author/' + a.author.id}>{a.author.name} {a.author.surname} {a.author.patronymic}</NavLink>
                     ({a.author_publication_organizations.map(p=><>
                    {p.organization.name}, {p.organization.country}, {p.organization.city}
                </>)} )
                </div>)}</div>
            </div>
        </div>
    )

};

export default Publication;