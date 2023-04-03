import React from "react";
import Admin from "../Admin";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthor} from "../../../store/slices/AuthorsSlice";
import {fetchAuthorConfirmed} from "../../../store/slices/AuthorsConfirmedFalseSlice";
import style from "./Merge.module.css"
import Preloader from "../../Helpers/Preloader/Preloader";
import Error404 from "../../Helpers/Errors/Erorr404";
import MergeForm from "./MergeForm";

const Merge = () => {
    const {register, formState: {errors}, handleSubmit} = useForm();
    const {authors, count} = useSelector(state => state.authors);
    const authorConfirmed = useSelector(state => state.authorsConfirmedFalse);
    const dispatch = useDispatch();
    const signIn = useSelector(state => state.signIn)


    return (
        <div>
            {signIn.isAuth ?
            <div>
                {authorConfirmed.isFetching === true && authors.isFetching === true ? <Preloader/> :
                    <div>
                        <Admin/>
                       <MergeForm/>
                    </div>
                }
            </div> : <Error404/>}
        </div>
    )
}

export default Merge;