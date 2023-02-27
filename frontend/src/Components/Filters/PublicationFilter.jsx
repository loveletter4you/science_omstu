import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import s from "../Filters/PublicationFilter.module.css";
import {setSize} from "../../store/slices/PublicationsSlice";
import {setValue} from "../../store/slices/SortSlice";


const PublicationFilter = () => {
    const [seeFiltered, setSeeFiltered] = useState(false);
    const filteredValue = useSelector((state) => state.sort);
    const dispatch = useDispatch();

    const [Active, setActive] = useState(false);

    const toggle = () => {
        setActive(!Active);
    }

    return <div className={s.container}>
        <div className={s.burger} onClick={toggle}>
            <span></span>
        </div>
        <div className={Active ? s.menu + " " + s.active : s.menu}>
            <div onClick={() => {
                if (seeFiltered === true) setSeeFiltered(false)
            }} className={s.block}>
                <div className={s.size}>
                    Отображать по:
                    <ul>
                        <li onClick={() => {
                            dispatch(setSize(20));
                        }}>20
                        </li>
                        <li onClick={() => {
                            dispatch(setSize(40));
                        }}>40
                        </li>
                        <li onClick={() => {
                            dispatch(setSize(80));
                        }}>80
                        </li>
                    </ul>
                </div>
                {/*<div className={s.sort}>
                    <div className={s.sort__label}>
                        <b onClick={() => setSeeFiltered(true)}>Сортировка по: {filteredValue.seeFiltered}</b>
                    </div>

                    {seeFiltered === false ? '' : <div className={s.sort__popup}>
                        <nav>
                            <ul>
                                <li onClick={() => dispatch(setValue('Популярности'))}>Популярности</li>
                                <li onClick={() => dispatch(setValue('Публикациям'))}>Публикациям</li>
                                <li onClick={() => dispatch(setValue('Алфавиту'))}>Алфавиту</li>
                            </ul>
                        </nav>
                    </div>
                    }
                </div>*/}
            </div>
        </div>
    </div>
}

export default PublicationFilter;
