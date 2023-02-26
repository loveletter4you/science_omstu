import React, {useState} from 'react';
import axios from "axios";
import {NavLink} from "react-router-dom";
import s from "./Authors.module.css";
import c from './../Search/Search.module.css';
import ReactPaginate from "react-paginate";
import Paginator from '../Paginator/Paginator.css';
import {useDispatch, useSelector} from "react-redux";
import {setData, setSize} from "../../store/slices/AuthorsSlice";
import preloader from "../../assets/img/preloader.svg";
import {useDebounce} from "use-debounce";


const Authors = () => {

    const {authors, currentPage, pageSize, count} = useSelector(state => state.authors);
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
        const fetchAuthors = async () => {
            const res = await axios.get(`/api/author?search=${search}&page=${e.selected}&limit=${pageSize}`);
            dispatch(setData(res.data));
            toggleIsFetching(false);
        }
        fetchAuthors();
    }


    React.useEffect(() => {
        if(debouncedSearch[0] !== '') {
            toggleIsFetching(true);
            const fetchPublications = async () => {
                const res = await axios.get(`/api/author?search=${search}&page=0&limit=${pageSize}`);
                toggleIsFetching(false);
                dispatch(setData(res.data));
            }
            fetchPublications();
        }
        else {
            toggleIsFetching(true);
            const fetchPublications = async () => {
                const res = await axios.get(`/api/author?page=0&limit=${pageSize}`);
                toggleIsFetching(false);
                dispatch(setData(res.data));
            }
            fetchPublications();
        }
    }, [pageSize, debouncedSearch[0]]);


    return (<div>
        <div className={s.block}>
            <input className={c.search} placeholder='Поиск' type="text" value={search} onChange={onSearchChange}/>
        </div>
            {isFetching === true ? <img src={preloader} alt=""/> :
                <div>
                    <div className={s.block}>

                        <div className={s.size}>
                            Отображать по:
                            <ul>
                                <li onClick={() => {
                                    dispatch(setSize(30));
                                }}>30
                                </li>
                                <li onClick={() => {
                                    dispatch(setSize(60));
                                }}>60
                                </li>
                                <li onClick={() => {
                                    dispatch(setSize(90));
                                }}>90
                                </li>
                            </ul>
                        </div>
                        <div className={s.block__item}>
                            <ul className={s.item}>
                                {authors === undefined ? 'Подождите пожалуйста' : authors.map(a => <>
                                        <li key={a.id} className={s.list__item}>
                                            <NavLink to={'/author/' + a.id}> {a.surname} {a.name} {a.patronymic}</NavLink>
                                        </li>
                                    </>
                                )}
                            </ul>

                        </div>

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

export default Authors;
