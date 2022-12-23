import React, {useState} from 'react';
import s from './Publications.module.css';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setAuthor, setData} from "../../store/slices/publicationsSlice";
import ReactPaginate from "react-paginate";
import {setValue} from "../../store/slices/sortSlice";
import {setPublic} from "../../store/slices/authorSlice";
import {NavLink, useParams} from "react-router-dom";
import AuthorsOfPublication from "./AuthorsOfPublication";


const Publications = () => {

    const [seeFiltered, setSeeFiltered] = React.useState(false);
    const filteredValue = useSelector((state) => state.sort);
    //const authors = publications.authors;
    const {publications, currentPage, pageSize, total_publications} = useSelector(state => state.publications);
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
        <div onClick={() => {
            if (seeFiltered === true) setSeeFiltered(false)
        }}>
            <input className={s.input} placeholder='Search' type="text"/>
            <div className={s.sort}>
                <div className={s.sort__label}>
                    <b onClick={() => setSeeFiltered(true)}>Сортировка по: {filteredValue.seeFiltered}</b>
                </div>
                {seeFiltered === false ? '' : <div className={s.sort__popup}>
                    <ul>
                        <li onClick={() => dispatch(setValue('популярности'))}>популярности</li>
                        <li onClick={() => dispatch(setValue('публикациям'))}>публикациям</li>
                        <li onClick={() => dispatch(setValue('алфавиту'))}>алфавиту</li>
                    </ul>
                </div>
                }
            </div>

           {publications === undefined ? 'Подожди пж' : publications.map(p =>  <div>
                <div key={p.id} className={s.block}>
                    <div>{p.type.name}</div>
                    <NavLink to={"/publication/" + p.id}><div>{p.title}</div></NavLink>
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