import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import c from "../Search/Search.module.css";
import ReactPaginate from "react-paginate";
import {fetchSources, fetchSourcesSearch} from "../../store/slices/SourcesSlice";
import s from "./Sources.module.css"
import {setSize} from "../../store/slices/SourcesSlice";
import {NavLink} from "react-router-dom";
import {useDebounce} from "use-debounce";
import Preloader from "../Preloader/Preloader";

const Sources = () => {

    const {sources, pageSize, count, isFetching} = useSelector(state => state.sources);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const onSearchChange = (e) => {
        const {value} = e.target;
        setSearch(value);
    }

    const handlePageClick = (e) => {
        dispatch(fetchSourcesSearch({search, page: e.selected, pageSize}));
    }

    React.useEffect(() => {
        if (debouncedSearch[0] !== '') {
            dispatch(fetchSourcesSearch({search, page: 0, pageSize}));
        } else {
            dispatch(fetchSources({page: 0, pageSize}));
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
