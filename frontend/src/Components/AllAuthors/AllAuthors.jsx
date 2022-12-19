import React from 'react';
import axios from "axios";
import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import s from "./AllAuthors.module.css";
import ReactPaginate from "react-paginate";
import Paginator from './Paginator.css';
import {useSelector} from "react-redux";

const AllAuthors = () => {
    const [authors, setAuthors] = React.useState([]);
    const [seePopup, setSeePopup] = React.useState(false);
    // const [popupValue, setPopupValue] = React.useState('популярности');
    // onClick={() => setPopupValue('публикациям')
    // let popup = useSelector(state => state.sort.popupValue)
    // console.log(popup);

    // const value = useSelector((state) => console.log('AllAuthors-state',state))

    let pageSize = 20;
    let total_authors = 1070;

    let pages = [];

    let pageCount = Math.ceil(total_authors / pageSize);

    for (let i = 1; i <= pageCount; i++) {
        pages[i] = i;
    }

    const handlePageClick = (e) => {
        const fetchAutors = async () => {
            const res = await axios.get(`//localhost/api/authors?page=${e.selected}&limit=20`);
            setAuthors(res.data.authors);

        }
        fetchAutors();
    }

    React.useEffect(() => {
        const fetchAutors = async () => {
            const res = await axios.get(`//localhost/api/authors?page=0&limit=20`);
            setAuthors(res.data.authors);
            console.log(res.data);
        }

        fetchAutors();
    }, []);

    return (
        <div className={s.block}>
            <input className={s.input} placeholder='Search' type="text"/>
            <div className={s.block__item}>
                <ul className={s.item}>
                    {authors === undefined ? 'Подожди пж' : authors.map(a => <>
                            <li key={a.id} className={s.list__item}>
                                <NavLink to={'/author/' + a.id}> {a.surname} {a.name} {a.patronymic}</NavLink>
                            </li>
                        </>
                    )}
                </ul>

                <div className={s.sort}>
                    <div className={s.sort__label} onClick={() => setSeePopup(!seePopup)}>
                        <b>Сортировка по:</b>
                        <span>dsfdsfds</span>
                    </div>

                    {
                        seePopup === false ? '' : <div className={s.sort__popup}>
                            <ul>
                                <li className={s.active}>популярности</li>
                                <li>публикациям</li>
                                <li>алфавиту</li>
                            </ul>
                        </div>
                    }


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

                containerClassName='pagination'
                activeLinkClassName='active'
            />

        </div>
    );
};

export default AllAuthors;
