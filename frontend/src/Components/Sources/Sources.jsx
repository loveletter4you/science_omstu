import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import c from "../Search/Search.module.css";
import ReactPaginate from "react-paginate";
import {setSource} from "../../store/slices/SourcesSlice";
import s from "./Sources.module.css"
import {setSize} from "../../store/slices/SourcesSlice";
import {NavLink} from "react-router-dom";
import preloader from "../../assets/img/preloader.svg";
import {useDebounce} from "use-debounce";
import {SourcesAPI} from "../api";
import {useCookies} from "react-cookie";
import Preloader from "../Preloader/Preloader";

const Sources = () => {

    const {sources, pageSize, count} = useSelector(state => state.sources);
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
            const res = await SourcesAPI.getSourcesSearch(search, e.selected, pageSize);
            dispatch(setSource(res.data));
            toggleIsFetching(false);
        }
        fetchAuthors();
    }


    React.useEffect(() => {
        if(debouncedSearch[0] !== '') {
            toggleIsFetching(true);
            const fetchPublications = async () => {
                const res = await SourcesAPI.getSourcesSearch(search, 0, pageSize);
                toggleIsFetching(false);
                dispatch(setSource(res.data));
            }
            fetchPublications();
        }
        else {
            toggleIsFetching(true);
            const fetchPublications = async () => {
                const res = await SourcesAPI.getSources(0, pageSize)
                toggleIsFetching(false);
                dispatch(setSource(res.data));
            }
            fetchPublications();
        }
    }, [pageSize, debouncedSearch[0]]);


    return <div className={s.container}>
        <input className={c.search} placeholder='Поиск' type="text" value={search} onChange={onSearchChange}/>
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
        {isFetching === true ? <Preloader/> :
            <div className={s.block}>
                {sources.map(source => <div>
                    <div className={s.source}>
                        <div>{source.source_type.name}</div>
                        <div><NavLink to={'/source/' + source.id}
                        >{source.name}</NavLink></div>
                    </div>
                </div>)
                }
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

export default Sources;
