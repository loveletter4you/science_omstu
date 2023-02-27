import React, {useState} from 'react';
import s from './Publications.module.css';
import c from './../Search/Search.module.css';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setData} from "../../store/slices/PublicationsSlice";
import ReactPaginate from "react-paginate";
import {NavLink} from "react-router-dom";
import PublicationFilter from "../Filters/PublicationFilter";
import preloader from "../../assets/img/preloader.svg";
import {useDebounce} from "use-debounce";

const Publications = () => {


    const {publications, currentPage, pageSize, count} = useSelector(state => state.publications);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);
    const [search, setSearch] = useState('');
    const [isFetching, toggleIsFetching] = useState(false);
    const debouncedSearch = useDebounce(search, 500);


    const onSearchChange = (e) => {
            const {value} = e.target
            setSearch(value)
    }

    const handlePageClick = (e) => {
        toggleIsFetching(true);
        const fetchPublications = async () => {
            const res = await axios.get(`/api/publication?search=${search}&page=${e.selected}&limit=${pageSize}`);
            dispatch(setData(res.data));
            toggleIsFetching(false);
        }
        fetchPublications();
    }

    React.useEffect(() => {
        if(debouncedSearch[0] !== '') {
            toggleIsFetching(true);
            const fetchPublications = async () => {
                const res = await axios.get(`/api/publication?search=${search}&page=0&limit=${pageSize}`);
                toggleIsFetching(false);
                dispatch(setData(res.data));
            }
            fetchPublications();
        }
        else {
            toggleIsFetching(true);
            const fetchPublications = async () => {
                const res = await axios.get(`/api/publication?page=0&limit=${pageSize}`);
                toggleIsFetching(false);
                dispatch(setData(res.data));
            }
            fetchPublications();
        }
    }, [pageSize, debouncedSearch[0]]);

    return (<div className={s.container}>
            <input className={c.search} placeholder='Поиск' type="text" value={search} onChange={onSearchChange}/>

            <PublicationFilter/>
            {isFetching === true ? <img src={preloader} alt=""/> :
                <div>
                    <div className={s.block}>
                        {publications === undefined ? 'Подождите пожалуйста' : publications.map(p => <div>
                            <div key={p.id} className={s.blocks}>
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

