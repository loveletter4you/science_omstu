import React, {useState}  from "react";
import {setData} from "../../store/slices/FeedbackSlice";
import {useDispatch, useSelector} from "react-redux";
import ReactPaginate from "react-paginate";
import {FeedbackAPI} from "../api";
import s from "./Feedback.module.css"
import {useCookies} from "react-cookie";
import Preloader from "../Preloader/Preloader";

const Feedback = () => {
    const signIn = useSelector(state => state.signIn)
    const [cookies, setCookies, removeCookies] = useCookies(['token'])
    const {feedbacks, currentPage, pageSize, count} = useSelector(state => state.feedbacks);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);
    const [isFetching, toggleIsFetching] = useState(false);

    const handlePageClick = (e) => {
        toggleIsFetching(true);
        try {
            const fetchFeedback = async () => {
                const res = await FeedbackAPI.getFeedback(e.selected, pageSize, cookies.token);
                dispatch(setData(res.data));
                toggleIsFetching(false);
                console.log(cookies.token)
            }
            fetchFeedback();
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
            toggleIsFetching(true);
            try {
                const fetchFeedback = async () => {
                    const res = await FeedbackAPI.getFeedback(0, pageSize, cookies.token);
                    toggleIsFetching(false);
                    dispatch(setData(res.data));
                }
                fetchFeedback();
            }catch (e){
                console.log(e);
            }

    }, [pageSize]);


    return <div>
        {isFetching === true ? <Preloader/> :
        <div>
        {signIn.isAuth? <div>
            {feedbacks.map(f=> <div className={s.block}>
                <div>Имя: {f.name}</div>
                <div>Почта: {f.mail}</div>
                <div>Сообщение: {f.message}</div>
                <div>Дата: {f.date}</div>
            </div>)}

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
            /> </div>: null}
        </div>
        }
    </div>
}

export default Feedback;
