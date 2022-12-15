import React from "react";
import './App.css';
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import AuthorsContainer from "./Components/Authors/AuthorsContainer";
import AllAuthorsContainer from "./Components/AllAuthors/AllAuthorsContainer";
import {Route, Routes} from "react-router-dom";
import AllAuthors from "./Components/AllAuthors/AllAuthors";

function App(props) {
    return <div className='app-wrapper'>
        <div className="app-wrapper__container">
            <Header/>
            <div className='app-wrapper-content'>
                <AllAuthors/>
                {/*<Routes>*/}
                {/*    <Route path='/author/:id'*/}
                {/*           element={<AuthorsContainer/>}/>*/}
                {/*    <Route path='/authors'*/}
                {/*           element={<AllAuthorsContainer/>}/>*/}
                {/*</Routes>*/}
            </div>
            <Footer/>
        </div>
    </div>
}

export default App;
