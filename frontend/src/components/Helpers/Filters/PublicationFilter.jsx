
import React, {useState} from "react";
import {FilterAPI} from "../../../store/api";
import {useDispatch, useSelector} from "react-redux";
import {getPublicationType, getSourceRatingTypes} from "../../../store/slices/FilterSlices";
import {useForm} from "react-hook-form";
import {fetchAuthorSearch} from "../../../store/slices/AuthorsSlice";
import {useDebounce} from "use-debounce";
import {fetchPublicationsSearch, setFilter} from "../../../store/slices/PublicationsSlice";
import style from './PublicationFilter.module.css'

const PublicationFilter = () => {

    const {register, formState: {errors}, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const {publicationType, sourceRatingTypes} = useSelector(state => state.filter)
    const [search, setSearch] = useState('');
    const {authors, count} = useSelector(state => state.authors);
    const debouncedSearch = useDebounce(search, 500);
    const {publications, pageSize} = useSelector(state => state.publications);
    let date = new Date().toLocaleDateString('en-ca')

    const onSearchChange = (e) => {
        const {value} = e.target
        setSearch(value)
    }

    React.useEffect(() => {
        const getType = async () => {
            const res = await FilterAPI.getPublicationType();
            dispatch(getPublicationType(res.data.publication_types))
        }
        const getSourceRating = async () => {
            const res = await FilterAPI.getSourceRatingTypes();
            dispatch(getSourceRatingTypes(res.data.source_rating_types))
        }

        getType();
        getSourceRating();

    }, [])

    React.useEffect(() => {
        try {
            dispatch(fetchAuthorSearch({search, page: 0, pageSize: count}))
        } catch (e) {
            console.log(e);
        }
    }, [debouncedSearch[0]])

    const onSubmit = (data) => {

        if (data.publicationType === '') {
            data.publicationType = null
        }
        if (data.authorName === '') {
            data.authorName = null
        }
        if (data.SourceRating === '') {
            data.SourceRating = null
        }
        if (data.beforeTime === '') {
            data.beforeTime = `2013-06-12`
        }
        if (data.afterTime === '') {
            data.afterTime = date
        }
        dispatch(setFilter(data))

        const sendFilters = async () => {
            try {
                dispatch(fetchPublicationsSearch({
                    search: null, publication_type_id: data.publicationType,
                    author_id: data.authorName, source_rating_type_id: data.SourceRating, from_date: data.beforeTime,
                    to_date: data.afterTime, page: 0, pageSize
                }));
            } catch (e) {
                console.log(e)
            }
        }
        sendFilters();
    }

    return <div className={style.filter}>
        <div>Фильтры</div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="time">Период времени</label>
                    <div>
                        От: <input className={style.date} {...register("beforeTime")} type={"date"}/>
                    </div>
                    <div>
                        До: <input className={style.date} {...register("afterTime")} type={"date"}/>
                    </div>
                </div>
                <div>
                    <label htmlFor="publicationType">Тип публикации: </label>
                    <select className={style.dataName} {...register("publicationType")}>
                        <option>{null}</option>
                        {publicationType.map((type, index) =>
                            <option key={index} value={type.id}>{type.name}</option>
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="SourceRating">Рейтинг:</label>
                    <select className={style.dataName} {...register("SourceRating")}>
                        <option>{null}</option>
                        {sourceRatingTypes.map((type, index) =>
                            <option key={index} value={type.id}>{type.name}</option>
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="authorName">Автор:</label>
                    <input className={style.dataName} list="authorName" placeholder={"Введите имя автора"} type="search" value={search}
                           onChange={onSearchChange}/>
                    <select className={style.dataName} id="authorName" {...register("authorName")}>
                        <option>{null}</option>
                        {authors.map((author, index) =>
                            <option value={author.id} key={index}>
                                {author.surname} {author.name} {author.patronymic}
                            </option>
                        )}
                    </select>
                </div>
                <div>
<<<<<<< Updated upstream
                    <input className={style.dataName} type={"submit"} value={"Применить"}/>
=======
                    <input className={style.dataName} type={"submit"} value={'Применить'}/>
>>>>>>> Stashed changes
                </div>
            </form>
        </div>
    </div>
}

export default PublicationFilter;