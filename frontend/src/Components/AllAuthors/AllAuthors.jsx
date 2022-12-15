import React from 'react';
import axios from "axios";

const AllAuthors = () => {

    const [authors, setAuthors] = React.useState();

    React.useEffect(() => {

        // axios.get(`https://638c7dcad2fc4a058a58ce8e.mockapi.io/item`).then(response => {
        //     console.log(response.data);
        // });

        const fetchAutors = async () => {

            const res = await axios.get(`//localhost/api/author/1`);
            console.log(res.data);
        }

        fetchAutors();
    },[]);


    return (
        <div>
            
        </div>
    );
};

export default AllAuthors;
