import React, {useState} from 'react';
import axios from "axios";
import {NavLink} from "react-router-dom";
import s from "./Authors.module.css";
import ReactPaginate from "react-paginate";
import Paginator from '../Paginator/Paginator.css';
import {useDispatch, useSelector} from "react-redux";
import {setData, setSize} from "../../store/slices/AuthorsSlice";
import Search from "../Search/Search";


const Authors = () => {

    const {authors, currentPage,pageSize, count} = useSelector(state => state.authors);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        const { value } = e.target
        setSearch(value)
    }

    const handlePageClick = (e) => {
        const fetchAuthors = async () => {
            const res = await axios.get(`/api/author?search=${search}&page=${e.selected}&limit=${pageSize}`);
            dispatch(setData(res.data));
        }
        fetchAuthors();
    }



    React.useEffect(() => {
        const fetchAuthors = async () => {
            const res = await axios.get(`/api/author?search=${search}&page=0&limit=${pageSize}`);
            dispatch(setData(res.data));
        }
        fetchAuthors();
    }, [pageSize, search]);


    return (
        <div>
            <div className={s.block}>
                <input placeholder='Поиск' type="text" value={search} onChange={onSearchChange}/>
                <div className={s.size}>
                    Отображать по:
                        <ul>
                            <li onClick={() => {dispatch(setSize(30)); }}>30</li>
                            <li onClick={() => {dispatch(setSize(60)); }}>60</li>
                            <li onClick={() => {dispatch(setSize(90)); }}>90</li>
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
