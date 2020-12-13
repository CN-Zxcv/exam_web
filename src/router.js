import React from 'react'
import {BrowserRouter as Router , Route , Switch} from 'react-router-dom'
import { createBrowserHistory } from "history";
import Login from "./components/Login";
import {CustomerMenu} from "./components/CustomerMenu";

export default class AppRoute extends React.Component{
    render(){
        return(
            <Router history={createBrowserHistory}>
                <Switch>
                    <Route exact path="/CustomerMenu" component={CustomerMenu} />
                    <Route path="/*" component={Login}/>
                </Switch>
            </Router>
        )
    }
}
