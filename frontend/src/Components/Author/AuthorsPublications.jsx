import React from "react";
import {NavLink} from "react-router-dom";
import ReactPaginate from "react-paginate";
import {setData} from "../../store/slices/PublicationsSlice";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import s from "../Publications/Publications.module.css";
import {getAuthorPublication} from "../api";

const AuthorsPublications = (props) => {

    const dispatch = useDispatch();
    const {publications, pageSize, count} = useSelector(state => state.publications);
    let pageCount = Math.ceil(count / pageSize);

    const handlePageClick = (e) => {
        const fetchPublications = async () => {
            const res = await axios.get(`/api/author/${props.id}/publications?page=${e.selected}&limit=${pageSize}`);
            dispatch(setData(res.data));
        }
        fetchPublications();
    }

    React.useEffect(() => {
        const fetchPublications = async () => {
            const res = await axios.get(`/api/author/${props.id}/publications?page=0&limit=${pageSize}`);
            dispatch(setData(res.data));
        }
        fetchPublications();
    }, []);

    return <div>
        <div className={s.block}>
            {publications === undefined ? 'Подождите пожалуйста' : publications.map(p => <div>
                <div key={p.id} className={s.blocks}>
                    <div>{p.publication_type.name}</div>
                    <div>{p.source.name}</div>
                    <NavLink to={"/publication/" + p.id}>
                        <div>{p.title}</div>
                    </NavLink>
                    <div>{p.publication_date}</div>
                    <div>{p.publication_authors.map(a=> <div>
                            <NavLink to={'/author/' + a.author.id}>{a.author.name} {a.author.surname}</NavLink>
                        </div>
                    )}</div>
                </div>
            </div>)}
        </div>

        {<ReactPaginate
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
        />}
    </div>
}

export default AuthorsPublications;
