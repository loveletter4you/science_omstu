import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setSource} from "../../store/slices/SourceSlice";
import s from "./Source.module.css"
import SourcePublications from "../Source/SourcesPublication";
import {SourceAPI} from "../api";
import {useCookies} from "react-cookie";
import Preloader from "../Preloader/Preloader";

const Source = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const source = useSelector(state => state.source)
    const {publications, pageSize, count} = useSelector(state => state.publications);
    const [isFetching, toggleIsFetching] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies(['token'])

    React.useEffect(() => {
        toggleIsFetching(true);
        const fetchSource = async () => {
            const res = await SourceAPI.getSource(params.id);
            dispatch(setSource(res.data));
            toggleIsFetching(false);
        }
        fetchSource();
    }, [params.id])

    React.useEffect(() => {
        toggleIsFetching(true);
        const fetchSource = async () => {
            const res = await SourceAPI.getSourcePageSize(params.id, 0, pageSize);
            dispatch(setSource(res.data));
            toggleIsFetching(false);
        }
        fetchSource();
    }, [pageSize]);

    return <div className={s.theme}>
        {isFetching === true ? <Preloader/> :
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
                <div>

                    <div className={s.lineBlock}>{source.source_ratings.map(r => <div className={s.blockRating}>
                        <div>{r.source_rating_type.name}</div>
                        <div>{r.rating}</div>
                        <div>{r.rating_date}</div>
                    </div>)}</div>
                </div>

                <SourcePublications/>
            </div>
        }
    </div>
}

export default Source;
