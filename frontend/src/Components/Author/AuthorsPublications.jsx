import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import ReactPaginate from "react-paginate";
import {setData} from "../../store/slices/PublicationsSlice";
import {useDispatch, useSelector} from "react-redux";
import s from "../Publications/Publications.module.css";
import {AuthorAPI} from "../api";
import Preloader from "../Preloader/Preloader";


const AuthorsPublications = () => {
    const author = useSelector(state => state.author);
    const dispatch = useDispatch();
    const {publications, pageSize, count} = useSelector(state => state.publications);
    let pageCount = Math.ceil(count / pageSize);
    const [isFetching, toggleIsFetching] = useState(false);


    const handlePageClick = (e) => {
        toggleIsFetching(true);
        try {
            const fetchPublications = async () => {
                const res = await AuthorAPI.getAuthorPublication(author.id, e.selected, pageSize);
                dispatch(setData(res.data));
                toggleIsFetching(false);
            }
            fetchPublications();
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        toggleIsFetching(true);
        try {
            const fetchPublications = async () => {
                const res = await AuthorAPI.getAuthorPublication(author.id, 0, pageSize);
                dispatch(setData(res.data));
                toggleIsFetching(false);
            }
            fetchPublications();
        } catch (e) {
            console.log(e);
        }
    }, [author.id]);

    return <div>
        {isFetching === true ? <Preloader/> :
            <div className={s.theme} >
                <div className={s.block}>
                    {publications === undefined ? 'Подождите пожалуйста' : publications.map(p => <div key={p.id}>
                        <div key={p.id} className={s.blocks}>
                            <div>{p.publication_type.name}</div>
                            <div><NavLink to={'/source/' + p.source.id}>{p.source.name}</NavLink></div>
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
            </div>
        }
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

export default AuthorsPublications;