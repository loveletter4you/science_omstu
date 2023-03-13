import React from "react";
import {fetchFeedback} from "../../store/slices/FeedbackSlice";
import {useDispatch, useSelector} from "react-redux";
import ReactPaginate from "react-paginate";
import s from "./Feedback.module.css"
import {useCookies} from "react-cookie";
import Preloader from "../Preloader/Preloader";
import {Navigate} from "react-router-dom";

const Feedback = () => {
    const signIn = useSelector(state => state.signIn)
    const [cookies, _] = useCookies(['token'])
    const {feedbacks, currentPage, pageSize, count} = useSelector(state => state.feedbacks);
    const dispatch = useDispatch();
    let pageCount = Math.ceil(count / pageSize);

    const handlePageClick = (e) => {
        try {
            dispatch(fetchFeedback({page: e.selected, pageSize, token: cookies.token}))
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
        try {
            dispatch(fetchFeedback({page: 0, pageSize, token: cookies.token}))
        } catch (e) {
            console.log(e);
        }

    }, [pageSize]);

    return <div>
        {feedbacks.isFetching === true ? <Preloader/> :
            <div>
                {signIn.isAuth ? <div>
                    {feedbacks.map(f => <div className={s.block}>
                        <div>Имя: {f.name}</div>
                        <div>Почта: {f.mail}</div>
                        <div>Сообщение: {f.message}</div>
                        <div>Дата: {f.date}</div>
                        <div>{f.solved ? 'Решено' : 'Не решено'}</div>
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
                    /></div> : <Navigate to={"/publication"}/>}
            </div>
        }
    </div>
}

export default Feedback;
