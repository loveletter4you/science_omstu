import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import ReactPaginate from "react-paginate";
import {setData} from "../../store/slices/PublicationsSlice";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import s from "../Publications/Publications.module.css";
import preloader from "../../assets/img/preloader.svg";
import c from "./Source.module.css"


const SourcePublications = (props) => {

    const dispatch = useDispatch();
    const {publications, pageSize, count} = useSelector(state => state.publications);
    let pageCount = Math.ceil(count / pageSize);
    const [isFetching, toggleIsFetching] = useState(false);


    const handlePageClick = (e) => {
        toggleIsFetching(true);
        const fetchPublications = async () => {
            const res = await axios.get(`/api/source/${props.id}/publications?page=${e.selected}&limit=${pageSize}`);
            dispatch(setData(res.data));
            toggleIsFetching(false);
        }
        fetchPublications();
    }

    React.useEffect(() => {
        toggleIsFetching(true);
        const fetchPublications = async () => {
            const res = await axios.get(`/api/source/${props.id}/publications?page=0&limit=${pageSize}`);
            dispatch(setData(res.data));
            toggleIsFetching(false);
        }
        fetchPublications();
    }, [props.id]);

    return (<div className={c.theme}>
            {isFetching === true ? <img src={preloader} alt=""/> :
                <div>
                    <div className={s.block}>
                        {publications === undefined ? 'Подождите пожалуйста' : publications.map(p => <div>
                            <div key={p.id} className={s.blocks}>
                                <div>{p.publication_type.name}</div>
                                <div>{p.source.name}</div>
                                <NavLink to={"/publication/" + p.id}>
                                    <div>{p.title}</div>
                                </NavLink>
                                <div className={s.authors}>
                                    <div className={s.author}>{p.publication_authors.map(a =>
                                        <NavLink to={"/author/" + a.author.id}>
                                            {a.author.surname} {a.author.name}
                                        </NavLink>
                                    )}</div>
                                </div>
                                <div>{p.publication_date === null || p.publication_date === undefined ? '' : p.publication_date.slice(0, 4)}</div>
                            </div>
                        </div>)}
                    </div>

                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="->"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="<-"
                        renderOnZeroPageCount={null}

                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                    />
                </div>
            }
        </div>
    )
}

export default SourcePublications;
