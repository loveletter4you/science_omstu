import React from 'react';
import s from  './Publications.module.css';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setData} from "../../store/slices/publicationsSlice";
import ReactPaginate from "react-paginate";

const Publications = () => {

    const {publications,currentPage,pageSize,total_publications } = useSelector(state => state.publications);
    const dispatch = useDispatch();

    let pageCount = Math.ceil(total_publications / pageSize);

    const handlePageClick = (e) => {
        const fetchPublications = async () => {
            const res = await axios.get(`/api/publications?page=${e.selected}&limit=20`);
            dispatch(setData(res.data));
        }
        fetchPublications();
    }

    React.useEffect(() => {
        const fetchPublications = async () => {
            const res = await axios.get(`/api/publications?page=0&limit=20`);
            dispatch(setData(res.data));
        }
        fetchPublications();
    }, []);

    return (
        <div>
            <input className={s.input} placeholder='Search' type="text"/>
            {publications === undefined ? 'Подожди пж' :publications.map(p => <div >
                <div key={p.id} className={s.block}>
                    <div>{p.type.name}</div>
                    <div>{p.title}</div>
                    <div>{p.source.Name}</div>
                    <div>{p.publication_date}</div>
                </div>
            </div>)}

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

export default Publications;