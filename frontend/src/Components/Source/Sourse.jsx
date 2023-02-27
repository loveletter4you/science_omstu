import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setSource} from "../../store/slices/SourceSlice";
import s from "./Source.module.css"
import preloader from "../../assets/img/preloader.svg";
import SourcePublications from "../Source/SourcesPublication";

const Source = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const source = useSelector(state => state.source)
    const {publications, pageSize, count} = useSelector(state => state.publications);
    const [isFetching, toggleIsFetching] = useState(false);

    React.useEffect(() => {
        toggleIsFetching(true);
        const fetchSource = async () => {
            const res = await axios.get(`/api/source/${params.id}/`);
            dispatch(setSource(res.data));
            toggleIsFetching(false);
        }
        fetchSource();
    }, [params.id])

    React.useEffect(() => {
        toggleIsFetching(true);
        const fetchSource = async () => {
            const res = await axios.get(`/api/source/${params.id}/publications?page=0&limit=${pageSize}`);
            dispatch(setSource(res.data));
            toggleIsFetching(false);
        }
        fetchSource();
    }, [pageSize]);

    return <div className={s.theme}>
        {isFetching === true ? <img src={preloader} alt=""/> :
            <div>
                <div className={s.block}>
                    <div>{source.source_type.name}</div>
                    <div>{source.name}</div>
                </div>
                <div className={s.block}>
                    <div>{source.source_links.map(l => <div>
                        {l.source_link_type.name}{l.link === null ? '' : ':'} {l.link}
                    </div>)}</div>
                </div>
                <div className={s.block}>
                    <div>{source.source_ratings.map(r => <div>
                        <div>{r.source_rating_type.name}</div>
                        <div>{r.rating}</div>
                        <div>{r.rating_date}</div>
                    </div>)}</div>
                </div>
                <SourcePublications id={source.id}/>
            </div>
        }
    </div>
}

export default Source;
