import React from "react";
import './App.css';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import {Route, Routes} from "react-router-dom";
import Authors from "./Components/Authors/Authors";
import Author from "./Components/Author/Author";
import Publications from "./Components/Publications/Publications";
import Auth from "./Components/Auth/Auth";
import SignUp from "./Components/Auth/SignUp";
import Publication from "./Components/Publication/Publication";
import AuthorsOfPublication from "./Components/Publications/AuthorsOfPublication";
import Sources from "./Components/Sources/Sourses";
import Source from "./Components/Source/Sourse";

function App(props) {
    return <div className='app-wrapper'>
        <main className="main">
        <div className="app-wrapper__container">
            <Header/>
            <div className='app-wrapper-content'>
                <Routes>
                    <Route path='/author/:id'
                           element={<Author/>}/>
                    <Route path='/authors'
                           element={<Authors/>}/>
                    <Route path={'/publication/:id/authors'}
                           element={<AuthorsOfPublication/>}/>
                    <Route path='/publications'
                           element={<Publications/>}/>
                    <Route path='/publication/:id'
                           element={<Publication/>}/>
                    <Route path = '/login'
                           element={<Auth/>}/>
                    <Route path = '/registration'
                           element={<SignUp/>}/>
                    <Route path = '/sources'
                           element={<Sources/>}/>
                    <Route path = '/source/:id'
                           element={<Source/>}/>
                </Routes>
            </div>
            <Footer/>
        </div>
        </main>
    </div>
}

export default App;
