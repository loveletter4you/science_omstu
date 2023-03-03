import React, {useState}  from "react";
import {setData} from "../../store/slices/FeedbackSlice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useCookies } from 'react-cookie';

const Feedback = () => {
    const signIn = useSelector(state => state.signIn)

    const {feedbacks, currentPage, pageSize, count} = useSelector(state => state.feedbacks);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);
    const [isFetching, toggleIsFetching] = useState(false);
    const [cookies, _] = useCookies(['token']);
    const headers = {
        'Authorization': 'Bearer ' + cookies.token["access_token"]
    }
    const handlePageClick = (e) => {
        toggleIsFetching(true);
        const fetchFeedback = async () => {
            const res = await axios.get(`/api/admin/feedbacks&page=${e.selected}&limit=${pageSize}`, {
                headers: headers
            });
            dispatch(setData(res.data));
            toggleIsFetching(false);
        }
        fetchFeedback();
    }

    React.useEffect(() => {

            toggleIsFetching(true);
            const fetchFeedback = async () => {
                const res = await axios.get(`/api/admin/feedbacks?page=0&limit=${pageSize}`, {
                    headers: headers
                });
                toggleIsFetching(false);
                dispatch(setData(res.data));
            }
        fetchFeedback();

    }, [pageSize]);


    return <div>
        {cookies.token["access_token"] === signIn.token?<div><div>
            {feedbacks.map(f=> <div>
                <div>{f.name}</div>
                <div>{f.mail}</div>
                <div>{f.message}</div>
                <div>{f.data}</div>
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
            /></div> : null}
    </div>
}

export default Feedback;
