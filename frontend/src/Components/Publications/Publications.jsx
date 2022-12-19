import React from 'react';
import s from  './Publications.module.css';

const Publications = () => {

    const [publications, setPublications] = React.useState([
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
        {
            name:'Статья',
            autor: 'Автор',
            year: '2022',
            sourse: 'https://ru.wikipedia.org/wiki/Википедия:Статья'
        },
    ]);

    return (
        <div className={s.container}>
            {publications.map(p => <div className={s.block}>
                <div className={s.block__item}>
                    <p>{p.name}</p>
                    <p>{p.autor}</p>
                    <a href={p.sourse} target="_blank">Источник</a>
                </div>
                <div className={s.block__item}>
                    <p>{p.year}</p>
                </div>
            </div>)}
        </div>
    );
};

export default Publications;