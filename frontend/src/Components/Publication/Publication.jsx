import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {fetchPublication, setPublic} from "../../store/slices/PublicationSlice";
import s from "./Publication.module.css"
import {NavLink} from "react-router-dom";

import Preloader from "../Preloader/Preloader";

const Publication = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const publication = useSelector(state => state.publication);
    const [isFetching, toggleIsFetching] = useState(false);
    const keywords = [];

    React.useEffect(()=>{
        dispatch(fetchPublication(params.id))
    },[])

    return (<div className={s.theme}>
            {publication.isFetching === true ? <Preloader/> :
                <div>
                    <div className={s.block}>
                        <div>{publication.publication_type.name}</div>
                        <div><NavLink to={'/source/' + publication.source.id}>{publication.source.name}</NavLink></div>
                    </div>
                    <div className={s.block}>
                        <div>{publication.title}</div>
                        <div>{publication.publication_date}</div>
                    </div>
                    <div className={s.block}>
                        Авторы: <div>{publication.publication_authors.map(a => <div>
                        <NavLink
                            to={'/author/' + a.author.id}>{a.author.surname} {a.author.name} {a.author.patronymic}</NavLink>
                        {a.author_publication_organizations.map(p => <>
                            &nbsp;({p.organization.name}{p.organization.country === null ? "" : ", "}
                            {p.organization.country}{p.organization.city === null ? "" : ", "}{p.organization.city})
                        </>)}
                    </div>)}</div>
                    </div>
                    <div className={s.block}>
                        Аннотация: <div>{publication.abstract}</div>
                    </div>
                    <div className={s.block}>
                        Ключевые слова:
                        {publication.keyword_publications.map(w =>
                            {keywords.push(w.keyword.keyword)}
                        )}
                        <div>{keywords.join(", ")}</div>
                    </div>
                    <div className={s.block}>
                        <div>{publication.publication_links.map(l => <div>
                            {l.publication_link_type.name}: {l.publication_link_type.name === "DOI" ?
                            <a href={"https://www.doi.org/" + l.link} target="_blank">{l.link}</a> : <a href={l.link} target="_blank">{l.link}</a>}
                        </div>)
                        }</div>
                    </div>
                </div>
            }
        </div>
    )

};

export default Publication;