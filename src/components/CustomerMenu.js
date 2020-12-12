import React, {Component} from "react";
import '../css/CustomerMenu.css';
import {changePassword, getMenus} from "../utils/api";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {Layout, Menu, Spin, Icon, Dropdown, message, Modal, Input} from 'antd';
import CustomerManage from "./CustomerManage";
import PaperManage from "./PaperManage";
import NotFound from "./NotFound";
import cookie from "react-cookies";
import {SendMsg} from "./SendMsg";
import CustomerInfo from "./CustomerInfo";

const { SubMenu } = Menu;
const {Sider} = Layout;
export class CustomerMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            menuList: [],
            theme: 'light',
            current: '0',
            defaultOpen: '0',
            current_icon: 'home',
            current_name: 'home',
            collapsed: false,
            visible: false,
            originPassword : "",
            newPassword: "",
            confirmPassword: "",
            confirmLoading: false
        };
    }

    getMenu = () =>{
        return(
            <Menu onClick={this.handleUserMenuClick}>
                <Menu.Item key="1">
                    <Icon type="unlock"/>
                    修改密码
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="export"/>
                    退出登录
                </Menu.Item>
            </Menu>
        );
    }

    handleUserMenuClick = (e) => {
        if (e.key === "1") {
            this.showModal();
        } else {
            cookie.remove("name");
            cookie.remove("employCode");
            cookie.remove("authorization");
            this.props.history.replace('/')
        }

        console.log('click', e);
    }

    componentDidMount() {
        document.title = '欢迎';
        getMenus({menuType: "2"}).then(
            (res) => {
                if(res != null && res.length > 0){
                    this.setState({
                        defaultOpen: res[0].id + "",
                    });
                    if (res[0].subMenus != null && res[0].subMenus.length > 0) {
                        this.setState({
                            current: res[0].subMenus[0].id + "",
                            current_icon: res[0].subMenus[0].icon,
                            current_name: res[0].subMenus[0].name
                        });
                    } else {
                        this.setState({
                            current: res[0].id + "",
                            current_icon: res[0].icon,
                            current_name: res[0].name
                        });
                    }
                }
                this.setState({loading: false, menuList: res})
            },
            (error) => {
                this.setState({loading: false})
                if(error === 'E90001'){
                    this.props.history.replace('/')
                }
            }
        );
    }

    onCollapse = collapsed => {
        this.setState({collapsed});
    };

    handleClick = e => {
        const {menuList} = this.state
        let curMenu = {}
        menuList.map((s, index) => {
            if(s.id + "" === e.key){
                curMenu = s
            }
            if (s.subMenus != null && s.subMenus.length > 0) {
                s.subMenus.map((sub, subIndex) => {
                    if(sub.id + "" === e.key){
                        curMenu = sub
                    }
                })
            }
        });
        this.setState({
            current: e.key,
            current_icon: curMenu.icon,
            current_name: curMenu.name
        });
        console.log(e)
    };

    handleUserClick = e => {
        message.info("个人信息");
    };

    menuList = (menus) => {
        return (
            <Menu
                className="menu"
                mode="inline"
                theme={this.state.theme}
                selectedKeys={[this.state.current]}
                defaultOpenKeys={[this.state.defaultOpen]}
                defaultSelectedKeys={[this.state.current]}
                onClick={this.handleClick}
            >

                {menus.map((s, index) => {
                    if (s.subMenus != null && s.subMenus.length > 0) {
                        const subMenus = s.subMenus
                        return (

                            <SubMenu
                                key={s.id}
                                title={<span><Icon type={s.icon ? s.icon : "home" }/><span>{s.name}</span></span>}
                            >
                                {subMenus.map((sub, subIndex) => {
                                   return <Menu.Item key={sub.id}>
                                        <Link to={sub.className} replace>
                                            <Icon type={sub.icon ? sub.icon : "file" }/>
                                            <span>{sub.name}</span>
                                        </Link>
                                    </Menu.Item>
                                })
                                }
                            </SubMenu>

                        )
                    } else {
                        return (
                            <Menu.Item key={s.id}>
                                <Link to={s.className} replace>
                                    <Icon type={s.icon ? s.icon : "home" }/>
                                    <span>{s.name}</span>
                                </Link>
                            </Menu.Item>
                        )
                    }
                })}
            </Menu>
        )
    }

    showModal = () => {
        this.setState({
            visible: true,
            originPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    onPassWordChange = () => {
        const {originPassword, newPassword, confirmPassword} = this.state
        if(originPassword === ""){
            message.info("原密码不能为空")
            return
        }
        if(newPassword === ""){
            message.info("新密码不能为空")
            return
        }
        if(confirmPassword === ""){
            message.info("确认密码不能为空")
            return
        }
        if(originPassword === newPassword){
            message.info("新旧密码不能相同")
            return
        }
        if(confirmPassword !== newPassword){
            message.info("新密码与确认密码不一致")
            return
        }
        this.setState({confirmLoading: true})
        changePassword({originPassword, newPassword, confirmPassword}).then(
            (res) => {
                this.hideModal()
                this.setState({confirmLoading: false})
                message.info("修改成功，请重新登录！")
                cookie.remove("name");
                cookie.remove("employCode");
                cookie.remove("authorization");
                this.props.history.replace('/')
            },
            (error) => {
                this.setState({confirmLoading: false})
                if(error === 'E90001'){
                    this.props.history.replace('/')
                }
            }
        );
    };

    render() {
        const {loading, menuList, current_icon, current_name, collapsed, originPassword, newPassword, confirmPassword, confirmLoading} = this.state

        if (loading) {
            return <Spin size="large" tip="Loading...">
                <div className="loading"/>
            </Spin>
        } else {
            return <Router>
                <Layout className="root">
                    <Sider className="sider"
                           collapsible collapsed={this.state.collapsed}
                           onCollapse={this.onCollapse}
                           width={160}
                           theme={this.state.theme}
                    >
                        <div className="logo">
                            <Icon type="profile" style={{
                            color: 'rgba(255,255,255,1)',
                            display: this.state.collapsed ? 'none' : 'block'
                        }}/>
                            <span className="logo-text" style={{
                                fontSize: this.state.collapsed ? 10 : 14,
                                marginLeft:  this.state.collapsed ? -5 : 5
                            }}>平煤考试系统</span>
                        </div>
                        {this.menuList(menuList)}
                    </Sider>
                    <div className="layout" style={{marginLeft: collapsed? 80 :160}}>
                        <div className="header">
                            <div className="crumb"><Icon type={current_icon ? current_icon : "home" }/> {current_name}</div>
                            <div className="button-head">
                                <Dropdown.Button overlay={this.getMenu} icon={<Icon type="user"/>}
                                                 onClick={this.handleUserClick}>
                                    {cookie.load("name")}
                                </Dropdown.Button>
                            </div>
                        </div>

                        <div className="content">
                            <Switch>
                                <Route exact key="1" path="/CustomerManage" component={CustomerManage}/>
                                <Route exact key="2" path="/PaperManage" component={PaperManage}/>
                                <Route exact key="3" path="/SendMsg" component={SendMsg}/>
                                <Route exact key="4" path="/CustomerInfo" component={CustomerInfo}/>
                                <Route path="/*" component={NotFound}/>
                            </Switch>
                        </div>
                        <div className="footer">EXAM ©2020 Created by HRN</div>
                    </div>
                </Layout>

                <Modal
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.onPassWordChange}
                    onCancel={this.hideModal}
                    okText="修改"
                    cancelText="取消"
                    width={350}
                    confirmLoading = {confirmLoading}
                >
                    <Input
                        type="password"
                        disabled={loading}
                        placeholder="请输入原密码"
                        maxLength={16}
                        allowClear
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.30)'}}/>}
                        value={originPassword}
                        onChange={(e) => this.setState({originPassword: e.currentTarget.value})}
                        style={{color: "#555555", fontSize: 14}}
                    />

                    <Input
                        type="password"
                        disabled={loading}
                        placeholder="请输入新密码"
                        maxLength={16}
                        allowClear
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.30)'}}/>}
                        value={newPassword}
                        onChange={(e) => this.setState({newPassword: e.currentTarget.value})}
                        style={{color: "#555555", fontSize: 14, marginTop: 15}}
                    />

                    <Input
                        type="password"
                        disabled={loading}
                        maxLength={16}
                        placeholder="请再次输入新密码"
                        allowClear
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.30)'}}/>}
                        value={confirmPassword}
                        onChange={(e) => this.setState({confirmPassword: e.currentTarget.value})}
                        style={{color: "#555555", fontSize: 14, marginTop: 15}}
                    />
                </Modal>
            </Router>
        }
    }

}



