import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setSource} from "../../../store/slices/SourceSlice";
import style from "./Source.module.css"
import SourcePublications from "./SourcesPublication";
import {SourceAPI} from "../../../store/api";
import Preloader from "../../Helpers/Preloader/Preloader";
import {setData} from "../../../store/slices/PublicationsSlice";

const Source = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const source = useSelector(state => state.source)
    const {pageSize} = useSelector(state => state.publications);
    const [isFetching, toggleIsFetching] = useState(false);

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
            dispatch(setData(res.data));
            toggleIsFetching(false);
        }
        fetchSource();
    }, [pageSize]);

    return <div className={style.theme}>
        {isFetching === true ? <Preloader/> :
            <div>
                <div className={style.block}>
                    <div>{source.source_type.name}</div>
                    <div>{source.name}</div>
                </div>
                <div className={style.block}>
                    <div>{source.source_links.map((links, index) => <div key = {index}>
                        {links.source_link_type.name}{links.link === null ? '' : ':'} {links.link}
                    </div>)}</div>
                </div>
                <div>

                    <div className={style.lineBlock}>{source.source_ratings.map((ratings, index) =>
                            <div key = {index} className={style.blockRating}>
                        <div>{ratings.source_rating_type.name}</div>
                        <div>{ratings.rating}</div>
                        <div>{ratings.rating_date}</div>
                    </div>
                    )}
                    </div>
                </div>

                <SourcePublications/>
            </div>
        }
    </div>
}

export default Source;
