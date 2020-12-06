import React, {Component} from "react";
import {getCustomers} from "../utils/api";
import {List, Spin} from "antd";

export default class CustomerManage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            customerList : []
        };
    }

    componentDidMount() {
        document.title = '员工管理'
        getCustomers({employCode : global.employCode, status : -2}).then(
            (res) => {
                console.log(res)
                this.setState({loading: false, customerList: res})
            },
            () => {
                this.setState({loading: false})
            }
        );

    }

    render() {
        const {loading, customerList} = this.state;
        return (
            <Spin spinning = {loading} size="large" tip="Loading...">
                <List
                    size="large"
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={customerList}
                    renderItem={item => <List.Item>{item.name}</List.Item>}
                />
            </Spin>
        );
    }
}
