import React, {Component} from "react";
import '../css/CustomerMenu.css';
import {getMenus} from "../utils/api";
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import {Layout, Menu, Spin, Icon, Dropdown, message} from 'antd';
import CustomerManage from "./CustomerManage";
import PaperManage from "./PaperManage";

const { SubMenu } = Menu;
const {Content, Footer, Sider} = Layout;
const menu = (
    <Menu onClick={handleUserMenuClick}>
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

function handleUserMenuClick(e) {
    if (e.key === "1") {
        message.info("修改密码");
    } else {
        message.info("退出登录");
    }

    console.log('click', e);
}

export class CustomerMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            menuList: [],
            theme: 'green',
            current: '0',
            defaultOpen: '0',
            current_icon: 'home',
            current_name: 'home',
            collapsed: false,
        };
    }

    componentDidMount() {
        document.title = '欢迎';
        getMenus({employCode: global.employCode, menuType: "2"}).then(
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
            () => {
                this.setState({loading: false})
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
                defaultOpenKeys={['7']}
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
                                        <Link to={sub.className}>
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
                                <Link to={s.className}>
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


    render() {
        const {loading, menuList, current_icon, current_name, collapsed} = this.state

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
                           width={180}
                    >
                        <div className="logo">
                            <Icon type="profile" style={{
                            color: 'rgba(255,255,255,1)',
                            display: this.state.collapsed ? 'none' : 'block'
                        }}/>
                            <span className="logo-text" style={{
                                fontSize: this.state.collapsed ? 10 : 15,
                                marginLeft:  this.state.collapsed ? -5 : 5
                            }}>平煤考试系统</span>
                        </div>
                        {this.menuList(menuList)}
                    </Sider>
                    <div className="layout" style={{marginLeft: collapsed? 80 :180}}>
                        <div className="header">
                            <div className="crumb"><Icon type={current_icon ? current_icon : "home" }/> {current_name}</div>
                            <Dropdown.Button overlay={menu} icon={<Icon type="user"/>}
                                             onClick={this.handleUserClick}>
                                {global.name}
                            </Dropdown.Button>
                        </div>

                        <div className="content">

                            <Route exact key="1" path="/CustomerManage" component={CustomerManage}/>
                            <Route exact key="2" path="/PaperManage" component={PaperManage}/>

                        </div>
                        <div className="footer">EXAM ©2020 Created by HRN</div>
                    </div>
                </Layout>
            </Router>
        }
    }

}



