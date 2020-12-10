import React, {Component} from 'react';
import {Input, Button, Icon} from 'antd';
import '../css/Login.css';
import logo from "../res/logo.svg";
import {login} from "../utils/api";
import cookie from 'react-cookies'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            employCode: null,
            passWord: null,
            loading: false,
        };
    }

    componentDidMount() {
        document.title = '登录'
        const authorization = cookie.load("authorization")
        if(authorization){
            this.props.history.replace('CustomerMenu')
        }
    }

    handleSubmit = e => {
        this.setState({loading: true});
        const {employCode, passWord} = this.state;
        login({employCode, passWord}).then(
            (res) => {
                console.log(res)
                this.setState({loading: false})
                let inFifteenMinutes = new Date(new Date().getTime() + 2 * 3600 * 1000);//2小时
                cookie.save("name", res.name, { expires: inFifteenMinutes });
                cookie.save("employCode", res.employCode, { expires: inFifteenMinutes });
                this.props.history.replace('CustomerMenu')
            },
            () => {
                this.setState({loading: false})
            }
        );
    };

    render() {
        const {employCode, passWord, loading} = this.state;
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <Input
                        disabled={loading}
                        placeholder="请输入工号"
                        allowClear
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.30)'}}/>}
                        value={employCode}
                        onChange={(e) => this.setState({employCode: e.currentTarget.value})}
                        style={{color: "#555555", fontSize: 14}}
                    />
                    <Input type="password"
                           disabled={loading}
                           allowClear
                           placeholder="请输入密码"
                           prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                           value={passWord}
                           onChange={(e) => this.setState({passWord: e.currentTarget.value})}
                           style={{marginTop: 10}}
                    />
                    <span className="Span-input">
                        <a href="" style={{marginRight: 50, color: "#8a8a8a", fontSize: 14}}>忘记密码</a>
                        <a href="" style={{color: "#8a8a8a", fontSize: 14}}>注册!</a>
                    </span>

                    <Button type="primary"
                            block
                            className="login-form-button"
                            onClick={this.handleSubmit.bind(this)}
                            loading={this.state.loading}
                    >
                        登录
                    </Button>

                </div>
                <a href="http://beian.miit.gov.cn/" target="_blank" rel="noreferrer"
                   style={{color: "#555555", fontSize: 14}}>沪ICP备2020035082号-1</a>
            </div>
        );
    }
}

export default Login;
