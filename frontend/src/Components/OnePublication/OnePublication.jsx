import React from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setPublic} from "../../store/slices/onePublicSlice";
import s from "./OnePublication.module.css"
import AuthorsOfPublication from "../Publications/AuthorsOfPublication";

const OnePublication = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const onePublic = useSelector(state => state.onePublic);


    React.useEffect(() => {
        const fetchPublic = async () => {
            const res = await axios.get(`/api/publication/${params.id}`);
            dispatch(setPublic(res.data));
        }
        fetchPublic();
    }, [])

    return (<div>
            <div className={s.block}>
                <div> {onePublic.type.name}</div>
                <div>{onePublic.title}</div>
                <div>{onePublic.source.Name}</div>
                <div>{onePublic.publication_date}</div>
            </div>
            <AuthorsOfPublication id={params.id}/>
        </div>
    )

};

export default OnePublication;