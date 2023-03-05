import React, {useEffect} from "react";
import './App.css';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import {Navigate, Route, Routes} from "react-router-dom";
import Authors from "./Components/Authors/Authors";
import Author from "./Components/Author/Author";
import Publications from "./Components/Publications/Publications";
import SignIn from "./Components/Auth/SignIn";
import Publication from "./Components/Publication/Publication";
import Sources from "./Components/Sources/Sources";
import Source from "./Components/Source/Source";
import AuthorsPublications from "./Components/Author/AuthorsPublications";
import Feedback from "./Components/Feedback/Feedback";
import {useCookies, withCookies} from 'react-cookie';
import Error404 from "./Components/Errors/Erorr404";
import {setIsAuth} from "./store/slices/SignInSlice";
import {useDispatch} from "react-redux";
import {useColorTheme} from "./Components/Theme/Theme";

function App(props) {
    const [cookies, setCookies, removeCookies] = useCookies(['token']);
    const [cookiesTheme, setCookiesTheme] = useCookies(['theme']);
    const {colorTheme, toggleColorTheme} = useColorTheme();

    const dispatch = useDispatch();
    useEffect(() => {
        if(cookies.token){
            dispatch(setIsAuth(true));
        }
        if(cookiesTheme.theme !== colorTheme){
            toggleColorTheme();
        }
    }, [])

    return <div className='app-wrapper'>
        <main className="main">
            <div className="app-wrapper__container">
                <Header/>
                <div className='app-wrapper-content'>
                    <Routes>
                        <Route exact path='/author/:id'
                               element={<Author/>}/>
                        <Route exact path='/author'
                               element={<Authors/>}/>
                        <Route exact path='/publication'
                               element={<Publications/>}/>
                        <Route exact path='/publication/:id'
                               element={<Publication/>}/>
                        <Route exact path='/login'
                               element={<SignIn/>}/>
                        <Route exact path='/source'
                               element={<Sources/>}/>
                        <Route exact path='/source/:id'
                               element={<Source/>}/>
                        <Route exact path='/author/:id/publications'
                               element={<AuthorsPublications/>}/>
                        <Route exact path='/admin/feedbacks'
                               element={<Feedback/>}/>
                        <Route path='*' element={<Error404/>}/>

                    </Routes>
                </div>
                <Footer/>
            </div>
        </main>
    </div>
}

export default withCookies(App);
