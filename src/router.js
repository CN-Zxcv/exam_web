import React from 'react'
import {BrowserRouter as Router , Route , Switch} from 'react-router-dom'
import { createBrowserHistory } from "history";
import Login from "./components/Login";
import {CustomerMenu} from "./components/CustomerMenu";
import CustomerManage from "./components/CustomerManage";
import PaperManage from "./components/PaperManage";



export default class AppRoute extends React.Component{
    render(){
        return(
            <Router history={createBrowserHistory}>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/CustomerMenu" component={CustomerMenu} />
                </Switch>
            </Router>
        )
    }
}
