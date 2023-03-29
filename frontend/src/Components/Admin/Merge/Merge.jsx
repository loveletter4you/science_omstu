import React from "react";
import Admin from "../Admin";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthor} from "../../../store/slices/AuthorsSlice";
import {fetchAuthorConfirmed} from "../../../store/slices/AuthorsConfirmedFalseSlice";
import style from "./Merge.module.css"
import Preloader from "../../Preloader/Preloader";
import Error404 from "../../Errors/Erorr404";

const Merge = () => {
    const {register, formState: {errors}, handleSubmit} = useForm();
    const {authors, count} = useSelector(state => state.authors);
    const authorConfirmed = useSelector(state => state.authorsConfirmedFalse);
    const dispatch = useDispatch();
    const signIn = useSelector(state => state.signIn)

    React.useEffect(() => {
        try {
            dispatch(fetchAuthor({page: 0, pageSize: count}))
            dispatch(fetchAuthorConfirmed({page: 0, pageSize: authorConfirmed.count, confirmed: false}))
        } catch (e) {
            console.log(e);
        }
    },[])
    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <div>
            {signIn.isAuth ?
            <div>
                {authorConfirmed.isFetching === true && authors.isFetching === true ? <Preloader/> :
                    <div>
                        <Admin/>
                        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                            <div><select className={style.select} placeholder="Имя подтвержденного пользователя"
                                         id="authorName1" {...register("authorName1", {required: true})}
                                         aria-invalid={errors.authorName1 ? "true" : "false"}>
                                {authors.map((author, index) =>
                                    <option value={author.id}
                                            key={index}>{author.surname} {author.name} {author.patronymic} ({author.id})</option>
                                )}
                            </select>
                            </div>
                            {errors.authorName1?.type === 'required' && <p role="alert">Это поле обязательно</p>}
                            <div>
                                <select className={style.select}
                                        placeholder="Имя не подтвержденного пользователя" {...register("authorName2", {required: true})}
                                        aria-invalid={errors.authorName2 ? "true" : "false"}>
                                    {authorConfirmed.authors.map((author, index) =>
                                        <option value={author.id}
                                                key={index}>{author.surname} {author.name} {author.patronymic} ({author.id})</option>
                                    )}
                                </select>
                            </div>
                            {errors.authorName2?.type === 'required' && <p role="alert">Это поле обязательно</p>}
                            <input className={style.button} type="submit"/>
                        </form>
                    </div>
                }
            </div> : <Error404/>}
        </div>
    )
}

export default Merge;