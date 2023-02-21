import React from 'react';
import s from './Publications.module.css';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setData} from "../../store/slices/PublicationsSlice";
import ReactPaginate from "react-paginate";
import {setValue} from "../../store/slices/SortSlice";
import {NavLink, useParams} from "react-router-dom";
import Search from "../Search/Search";
import {setSize} from "../../store/slices/PublicationsSlice";
import PublicationFilter from "../Filters/PublicationFilter";


const Publications = () => {


    const {publications, currentPage, pageSize, total_publications} = useSelector(state => state.publications);
    const dispatch = useDispatch();

    let pageCount = Math.ceil(total_publications / pageSize);

    const handlePageClick = (e) => {
        const fetchPublications = async () => {
            const res = await axios.get(`/api/publication?page=${e.selected}&limit=${pageSize}`);
            dispatch(setData(res.data));
        }
        fetchPublications();
    }

    React.useEffect(() => {
        const fetchPublications = async () => {
            const res = await axios.get(`/api/publication?page=0&limit=${pageSize}`);
            dispatch(setData(res.data));
        }
        fetchPublications();
    }, [pageSize]);


    return (<div className={s.container}>
            <PublicationFilter/>
            <Search/>
            <div className={s.block}>
            {publications === undefined ? 'Подождите пожалуйста' : publications.map(p => <div>
                <div key={p.id} className={s.blocks}>
                    <div>{p.type.name}</div>
                    <NavLink to={"/publication/" + p.id}>
                        <div>{p.title}</div>
                    </NavLink>
                    <div>{p.source.Name}</div>
                    <div>{p.publication_date}</div>
                </div>
            </div>)}
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

export default Publications;
