import React from "react";
import './App.css';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import {Route, Routes} from "react-router-dom";
import Authors from "./Components/Authors/Authors";
import Author from "./Components/Author/Author";
import Publications from "./Components/Publications/Publications";
import SignIn from "./Components/Auth/SignIn";
import SignUp from "./Components/Auth/SignUp";
import Publication from "./Components/Publication/Publication";
import Sources from "./Components/Sources/Sourses";
import Source from "./Components/Source/Sourse";
import AuthorsPublications from "./Components/Author/AuthorsPublications";
import Feedback from "./Components/Feedback/Feedback";
import { withCookies } from 'react-cookie';

function App(props) {

    return <div className='app-wrapper'>
        <main className="main">
        <div className="app-wrapper__container">
            <Header/>
            <div className='app-wrapper-content'>
                <Routes>
                    <Route path='/author/:id'
                           element={<Author/>}/>
                    <Route path='/author'
                           element={<Authors/>}/>
                    <Route path='/publication'
                           element={<Publications/>}/>
                    <Route path='/publication/:id'
                           element={<Publication/>}/>
                    <Route path = '/login'
                           element={<SignIn/>}/>
                    <Route path = '/registration'
                           element={<SignUp/>}/>
                    <Route path = '/source'
                           element={<Sources/>}/>
                    <Route path = '/source/:id'
                           element={<Source/>}/>
                    <Route path='/author/:id/publications'
                           element={<AuthorsPublications/>}/>
                    <Route path= '/admin/feedbacks'
                            element={<Feedback/>}/>
                </Routes>
            </div>
            <Footer/>
        </div>
        </main>
    </div>
}

export default withCookies(App);
