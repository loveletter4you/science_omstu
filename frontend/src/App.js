import React from "react";
import './App.css';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import {Route, Routes} from "react-router-dom";
import AllAuthors from "./Components/AllAuthors/AllAuthors";
import Author from "./Components/Authors/Author";
import Publications from "./Components/Publications/Publications";

function App(props) {
    return <div className='app-wrapper'>
        <div className="app-wrapper__container">
            <Header/>
            <div className='app-wrapper-content'>
                <Routes>
                    <Route path='/author/:id'
                           element={<Author/>}/>
                    <Route path='/authors'
                           element={<AllAuthors/>}/>
                    <Route path='/publications'
                           element={<Publications/>}/>
                </Routes>
            </div>
            <Footer/>
        </div>
    </div>
}

export default App;
