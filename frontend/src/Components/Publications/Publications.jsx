import React, {useState} from 'react';
import s from './Publications.module.css';
import c from './../Search/Search.module.css';
import {useDispatch, useSelector} from "react-redux";
import {fetchPublications, fetchPublicationsSearch} from "../../store/slices/PublicationsSlice";
import ReactPaginate from "react-paginate";
import {NavLink} from "react-router-dom";
import PublicationFilter from "../Filters/PublicationFilter";
import {useDebounce} from "use-debounce";
import Preloader from "../Preloader/Preloader";

const Publications = () => {


    const {publications, currentPage, pageSize, count} = useSelector(state => state.publications);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);


    const onSearchChange = (e) => {
        const {value} = e.target
        setSearch(value)
    }

    const handlePageClick = (e) => {
        dispatch(fetchPublicationsSearch({search, page: e.selected, pageSize}));
    }

    React.useEffect(() => {
        if (debouncedSearch[0] !== '') {
            dispatch(fetchPublicationsSearch({search, page: 0, pageSize}))
        } else {
            dispatch(fetchPublications({page: 0, pageSize}))
        }
    }, [pageSize, debouncedSearch[0]]);

    return (<div className={s.container}>
            <input className={c.search} placeholder='Поиск' type="text" value={search} onChange={onSearchChange}/>
            <PublicationFilter min={20} mid={40} max={80}/>
            {publications.isFetching === true ? <Preloader/> :
                <div className={s.block}>
                    {publications.map(p => <div key={p.id}>
                        <div className={s.blocks}>
                            <div>{p.publication_type.name}</div>
                            <div><NavLink to={'/source/' + p.source.id}>{p.source.name}</NavLink></div>
                            <NavLink to={"/publication/" + p.id}>
                                <div>{p.title}</div>
                            </NavLink>
                            <div className={s.authors}>
                                <div className={s.author}>{p.publication_authors.map(a =>
                                    <NavLink
                                        to={'/author/' + a.author.id}> {a.author.surname} {a.author.name}</NavLink>
                                )}</div>
                            </div>
                            <div>{p.publication_date === null || p.publication_date === undefined ? '' : p.publication_date.slice(0, 4)}</div>
                        </div>
                    </div>)}
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
    );
};

export default Publications;

