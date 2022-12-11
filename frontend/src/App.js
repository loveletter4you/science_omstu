import React from "react";
import './App.css';
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthorsContainer from "./Components/Authors/AuthorsContainer";
import {Provider} from "react-redux";
import store from "./Redux/redux-store";
import AllAuthorsContainer from "./Components/AllAuthors/AllAuthorsContainer";

function App(props) {
    return <BrowserRouter>
        <Provider store={store}>
        <div className='app-wrapper'>
            <Header/>
            <Navbar/>
            <div className='app-wrapper-content'>
                <Routes>
                    <Route path='/author/:id'
                           element={<AuthorsContainer/>}/>
                    <Route path='/authors'
                           element={<AllAuthorsContainer/>}/>
                </Routes>
            </div>
            <Footer/>
        </div>
        </Provider>
    </BrowserRouter>
}

export default App;
