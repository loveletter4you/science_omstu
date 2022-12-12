import React from "react";
import {NavLink} from "react-router-dom";
import s from "./AllAuthors.module.css"
import ReactPaginate from "react-paginate";
import Paginator from "./Paginator.css"

const AllAuthors = (props) => {
    let pageCount = Math.ceil( props.totalAuthors / props.pageSize);
    let pages = [];
    for (let i = 0; i < pageCount; i++) {
        pages.push(i);
    }
    const handlePageClick = (e) => {
        props.onPageChange(e.selected +1)
    }
    return <div>
        <div className={s.item}>
            {props.authors.map(a => <div key={a.id}>
                <NavLink to={'/author/' + a.id}>
                    <div className={s.line}><div className={s.first}>{a.surname} &nbsp;</div></div>
                    <div className={s.line}><div className={s.first}>{a.name} &nbsp;</div></div>
                        <div className={s.line}><div className={s.first}>{a.patronymic} &nbsp;</div></div>
                </NavLink></div>)}
        </div>
        <div className={s.number}>

            <ReactPaginate
                breakLabel="..."
                nextLabel="->"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<-"
                renderOnZeroPageCount={null}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
            />
        </div>
    </div>
}


export default AllAuthors;