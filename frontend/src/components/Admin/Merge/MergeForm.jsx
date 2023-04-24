import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthorSearch} from "../../../store/slices/AuthorsSlice";
import style from "./Merge.module.css"
import {useDebounce} from "use-debounce";
import {postMergeAuthors} from "../../../store/api";
import {useCookies} from "react-cookie";


const MergeForm = (props) => {
    const {register, formState: {errors}, handleSubmit} = useForm();
    const {authors,count} = useSelector(state => state.authors);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [cookies, ] = useCookies(['isAuth'])
    const onSearchChange = (e) => {
        const {value} = e.target
        setSearch(value)
    }

    React.useEffect(() => {
        try {
            dispatch(fetchAuthorSearch({search, page: 0, pageSize: count}))
        } catch (e) {
            console.log(e);
        }
    }, [debouncedSearch[0]])
    const onSubmit = (data) => {
        const postMerge = async () => {
            console.log(data.authorName)
            try {
                const res = await postMergeAuthors(props.authorId, data.authorName)
                console.log(res)
            } catch (e) {
                console.log(e)
            }
        }
        postMerge();
    }
    return (
        <div>
            <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="authorName">Имя не подтвержденного автора:</label>
                    <input list = "authorName" type="search" value={search} onChange={onSearchChange}/>
                    <select className={style.select}
                            id="authorName" {...register("authorName", {required: true})}
                            aria-invalid={errors.authorName ? "true" : "false"}>
                        {authors.map((author, index) =>
                            <option value={author.id} key={index}>
                                {author.surname} {author.name} {author.patronymic}
                            </option>
                        )}
                    </select>
                </div>
                {errors.authorName?.type === 'required' && <p role="alert">Это поле обязательно</p>}
                <input className={style.button} type="submit"/>
            </form>
        </div>
    )
}

export default MergeForm;