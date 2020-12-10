import React, {Component} from "react";
import {getCustomers} from "../utils/api";
import {List, Spin} from "antd";

export default class CustomerManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerList: []
        };
    }

    componentDidMount() {
        document.title = '员工管理'
        getCustomers({employCode: global.employCode, status: -2}).then(
            (res) => {
                console.log(res)
                this.setState({loading: false, customerList: res})
            },
            () => {
                this.setState({loading: false})
            }
        );

    }

    getItem = (item, index) => {
        return (<div className="customer-item">
            {index + 1 + "、" + item.name}
        </div>)

    }

    render() {
        const {loading, customerList} = this.state;

        return <List className="list" dataSource={customerList} loading={loading}
                     renderItem={this.getItem}>
        </List>


    }
}
