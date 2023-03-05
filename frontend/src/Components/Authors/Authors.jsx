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
import {AuthorsAPI} from "../api";
import {useCookies} from "react-cookie";
import Preloader from "../Preloader/Preloader";


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
        try {
            const fetchAuthors = async () => {
                const res = await AuthorsAPI.getAuthors(e.selected, pageSize);
                dispatch(setData(res.data));
                toggleIsFetching(false);
            }
            fetchAuthors();
        } catch (e) {
            console.log(e);
        }
    }


    React.useEffect(() => {
        try {
            if (debouncedSearch[0] !== '') {
                toggleIsFetching(true);
                const fetchPublications = async () => {
                    const res = await AuthorsAPI.getAuthorsSearch(search, 0, pageSize);
                    toggleIsFetching(false);
                    dispatch(setData(res.data));
                }
                fetchPublications();
            } else {
                toggleIsFetching(true);
                const fetchPublications = async () => {
                    const res = await AuthorsAPI.getAuthors(0, pageSize)
                    toggleIsFetching(false);
                    dispatch(setData(res.data));
                }
                fetchPublications();
            }
        } catch (e) {
            console.log(e);
        }
    }, [pageSize, debouncedSearch[0]]);

    return (<div color={s.theme}>
        <div className={s.block}>
            <input className={c.search} placeholder='Поиск' type="text" value={search} onChange={onSearchChange}/>
        </div>
            {isFetching === true ? <Preloader/> :
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
