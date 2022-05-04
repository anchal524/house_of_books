import React from "react";
import "./App.css";
import logo from "./img/books.gif";
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import BookDetails from "./components/BooksDetails";
import NewAdditions from "./components/NewAdditions";
import BooksList from "./components/BooksList";
import Home from "./components/Home";
import Library from "./components/Library";
import MostPopular from "./components/MostPopular";
import RecentBooks from "./components/RecentBooks";


const App = () => {
    return (
        <Router>
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} className='App-logo' alt='logo' />
                    <h1 className='App-title'>
                        Welcome to the House of books!
                    </h1>
                    <Link className='showlink' to='/books'>
                        Books
                    </Link>
                    <Link className='showlink' to='/books/newAdditions'>
                        New Additions
                    </Link>
                    <Link className='showlink' to='/library'>
                        Library
                    </Link>
                    <Link className='showlink' to='/books/mostPopular'>
                        Popular Books
                    </Link>
                    <Link className='showlink' to='/books/recents'>
                        Recently Viewed
                    </Link>
                </header>
                <br />
                <br />
                <div className='App-body'>
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                        <Route exact path='/books' element={<BooksList />} />
                        <Route
                            exact
                            path='/books/:id'
                            element={<BookDetails />}
                        />
                        <Route
                            exact
                            path='/books/newAdditions'
                            element={<NewAdditions />}
                        />
                        <Route exact path='/library' element={<Library />} />
                        <Route
                            exact
                            path='/books/mostPopular'
                            element={<MostPopular />}
                        />
                        <Route
                            exact
                            path='/books/recents'
                            element={<RecentBooks />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
