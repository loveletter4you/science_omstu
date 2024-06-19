import React, {useState} from 'react';
import style from './Dissertations.module.css';
import styleSearch from '../Helpers/Search/Search.module.css';
import {useDispatch, useSelector} from "react-redux";
import {fetchDissertations, fetchDissertationsSearch} from "../../store/slices/DissertationsSlice";
import ReactPaginate from "react-paginate";
import {NavLink} from "react-router-dom";
import {useDebounce} from "use-debounce";
import Preloader from "../Helpers/Preloader/Preloader";

const Dissertations = () => {
    const {dissertations, pageSize, count, isFetching, data} = useSelector(state => state.dissertations);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    let keywords = [];

    const onSearchChange = (e) => {
        const {value} = e.target
        setSearch(value)
    }

    const handlePageClick = (e) => {
        dispatch(fetchDissertationsSearch({search, author_id: data.authorName, from_date: data.beforeTime,
            to_date: data.afterTime, page: e.selected, pageSize}));
    }

    React.useEffect(() => {
        if (debouncedSearch[0] !== '') {
            dispatch(fetchDissertationsSearch({search, author_id: data.authorName,
                from_date: data.beforeTime, to_date: data.afterTime, page: 0, pageSize}))
        } else {
            dispatch(fetchDissertations({page: 0, pageSize}))
        }
    }, [pageSize, debouncedSearch[0]]);

    return (<div className={style.container}>
            <input className={styleSearch.search} placeholder='Поиск' type="text" value={search}
                   onChange={onSearchChange}/>
            <div className={style.blockCount}>
                <div>Количество найденных <br></br>Диссертаций: <span className={style.count}>{count}</span></div>
            </div>
            {/*<NioktrFilterSize min={20} mid={40} max={80}/>*/}
            {isFetching === true ? <Preloader/> :
                <div className={style.block}>
                    {dissertations.map((item, index) => <div key={index}>
                        <div className={style.blocks}>
                            <NavLink to={"/dissertation/" + item.id}>
                                <div>{item.title}</div>
                            </NavLink>

                            <div>
                                Регистрационный номер: {item.registration_number}
                            </div>
                            <div >
                                Автор работы:

                                <NavLink to={"/author/" + item.author.id}>
                                    &nbsp;{item.author.surname} {item.author.name} {item.author.patronymic}
                                </NavLink>

                            </div>

                            <div className={style.dissertation_keywords}>
                                Ключевые слова:
                                <div>
                                    {item.dissertation_keywords.map((wordItem, index) =>

                                        <span> {wordItem.keyword.keyword}</span>

                                    )}
                                </div>
                            </div>

                            <div>
                                {item.dissertation_date === null ||
                                item.dissertation_date === undefined ? '' :
                                    item.dissertation_date.slice(0, 4)}
                            </div>
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

export default Dissertations;

