import React from "react";
import {fetchFeedback} from "../../store/slices/FeedbackSlice";
import {useDispatch, useSelector} from "react-redux";
import ReactPaginate from "react-paginate";
import style from "./Feedback.module.css"
import {useCookies} from "react-cookie";
import Preloader from "../Preloader/Preloader";
import {Navigate} from "react-router-dom";
import Admin from "../Admin/Admin";

const Feedback = () => {
    const signIn = useSelector(state => state.signIn)
    const [cookies, _] = useCookies(['token'])
    const {feedbacks, pageSize, count} = useSelector(state => state.feedbacks);
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
        <Admin/>
        {feedbacks.isFetching === true ? <Preloader/> :
            <div>
                {signIn.isAuth ? <div>
                    {feedbacks.map((feedback, index) => <div key = {index} className={style.block}>
                        <div>Имя: {feedback.name}</div>
                        <div>Почта: {feedback.mail}</div>
                        <div>Сообщение: {feedback.message}</div>
                        <div>Дата: {feedback.date}</div>
                        <div>{feedback.solved ? 'Решено' : 'Не решено'}</div>
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
