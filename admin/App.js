import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Books from './components/books'
import Authors from './components/authors'
import Dictors from './components/dictors'
import Genres from './components/genres'
import Users from './components/users'
import Publishers from './components/publishers'
import ScrollToTop from './components/scrolltotop'
import './App.css';
import './css/contextmenu.css'
import Settings from "./components/settings"
import Login from "./components/login"
import Import from "./components/import"
import { useHistory } from 'react-router-dom';
import UserMenu from './components/usermenu';
//const history = useHistory();
import logo from './images/logo.png';
import Dictionaries from './components/dictionaries.js'
import Stat from './components/stats/Stat.js';
import { getUser, isAdmin } from './lib/api';
import Bookshelfs from './components/bookshelfs';
import Bookshelf from './components/bookshelf';
import Invoices from './components/Invoices';
import PremiumPlans from './components/PremiumPlans';

function App() {
    const [logged, setLogged] = React.useState(false);
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            setLogged(true);
        }
    })

    function login() {
        setLogged(true);
    }

    function logout() {
        localStorage.removeItem('token')
        setLogged(false);
    }

    if (!isAdmin() || window.location.href.match(/\/login/)) {
        return (
            <Router>
                <Route component={props=><Login login={login} {...props}/>} />
            </Router>
        )
    }

    return (
      <Router>
          <ScrollToTop>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <Link aria-label={'В начало'} to="/"><img className="logo" src={logo}/></Link>
                        <ul>
                            {getUser().levels_id === 0 && <>
                                <li>
                                    <Link to="/kitobplus-admin/books">Книги</Link>
                                </li>
                                <li>
                                    <Link to="/kitobplus-admin/import">Импорт</Link>
                                </li>
                                <li>
                                    <Link to="/kitobplus-admin/invoices">Оплаты</Link>
                                </li>
                                <li>
                                    <Link to="/kitobplus-admin/plans">Тарифы</Link>
                                </li>
                            </>}
                            <li>
                                <Link to="/kitobplus-admin/users">{getUser().levels_id === 0 ? 'Пользователи' : (getUser().levels_id === 3 ? 'Учащиеся' : 'Читатели')}</Link>
                            </li>
                            <li>
                                <Link to="/kitobplus-admin/stat">Статистика</Link>
                            </li>
                            {getUser().levels_id === 0 &&
                                <li>
                                    <Link to="/kitobplus-admin/dictionaries">Справочники</Link>
                                </li>
                            }
                        </ul>
                    </nav>
                    <div className="user">
                        <UserMenu/>
                    </div>
                </header>
                <Switch>
                    <Route path="/kitobplus-admin/users" component={props=><Users logout={logout} {...props}/>} />
                    <Route path="/kitobplus-admin/stat" component={props=><Stat logout={logout} {...props}/>}/>
                    {getUser().levels_id === 0 && <>
                        <Route path="/kitobplus-admin/books" component={props=><Books logout={logout} {...props}/>} />
                        <Route path="/kitobplus-admin/dictionaries" component={props=><Dictionaries logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/publishers" component={props=><Publishers logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/genres" component={props=><Genres logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/invoices" component={props=><Invoices logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/plans" component={props=><PremiumPlans logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/import" component={props=><Import logout={logout} {...props}/>} />
                        <Route path="/kitobplus-admin/settings" component={props=><Settings logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/bookshelf_history/users_id/:users_id" component={props=><Bookshelf logout={logout} is_history={1} {...props}/>}/>
                        <Route path="/kitobplus-admin/bookshelf_history/books_id/:books_id" component={props=><Bookshelf logout={logout} is_history={1} {...props}/>}/>
                        <Route path="/kitobplus-admin/bookshelf/users_id/:users_id" component={props=><Bookshelf logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/bookshelf/books_id/:books_id" component={props=><Bookshelf logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/bookshelfs/users_id/:users_id" component={props=><Bookshelfs logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/bookshelfs/books_id/:books_id" component={props=><Bookshelfs logout={logout} {...props}/>}/>
                        <Route path="/kitobplus-admin/person/:table/:id/:name" component={props=><Books logout={logout} {...props}/>}/>
                    </>}
                </Switch>
            </div>
          </ScrollToTop>
      </Router>
  );
}

export default App;
