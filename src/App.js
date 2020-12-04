import React, {Component} from 'react';
import {Input, Button, Icon} from 'antd';
import './App.css';
import logo from "./logo.svg";
import {login} from "./utils/api";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      employCode : null,
      passWord : null,
      loading: false,
    };
  }

  componentDidMount() {
    document.title = '登录'
  }

  handleSubmit = e => {
    this.setState({loading: true});
    const {employCode, passWord} = this.state;
    let _this = this;
    login({employCode, passWord}).then(
        (res) => {
            console.log(res)
            _this.setState({loading: false})
            global.name = res.name;
            global.employCode = res.employCode;
            _this.props.history.push(`CustomerMenu`)
        },
        () => {
            _this.setState({loading: false})
        }
    );
  };

  render() {
    const {employCode, passWord, loading} = this.state;

    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Input
                disabled={loading}
                placeholder="请输入工号"
                allowClear
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.30)' }} />}
                value={employCode}
                onChange={(e) => this.setState({employCode: e.currentTarget.value})}
                style={{color: "#555555", fontSize : 14}}
            />
            <Input type="password"
                   disabled={loading}
                   allowClear
                   placeholder="请输入密码"
                   prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                   value={passWord}
                   onChange={(e) => this.setState({passWord: e.currentTarget.value})}
                   style={{marginTop : 10}}
            />
            <span className="Span-input">
                        <a href="" style={{marginRight : 50, color: "#8a8a8a", fontSize : 14}}>忘记密码</a>
                        <a href="" style={{color: "#8a8a8a", fontSize : 14}}>注册!</a>
                    </span>

            <Button type="primary"
                    block
                    className="login-form-button"
                    onClick={this.handleSubmit.bind(this)}
                    loading={this.state.loading}
            >
              登录
            </Button>

          </header>
          <a href="http://beian.miit.gov.cn/" target="_blank" rel="noreferrer" style={{color: "#555555", fontSize : 14}}>沪ICP备2020035082号-1</a>
        </div>
    );
  }
}

export default App;
