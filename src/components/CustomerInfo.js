import React, {Component} from "react";
import {customerInfo} from "../utils/api";
import {Descriptions} from "antd";
import '../css/CustomerInfo.css';

export default class CustomerManage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            customer : {}
        };
    }

    componentDidMount() {
        document.title = '我的信息'
        customerInfo({}).then(
            (res) => {
                console.log(res)
                this.setState({customer: res})
            },
            (error) => {
                if (error === 'E90001') {
                    this.props.history.replace('/')
                }
            }
        );
    }

    render() {
        const {customer} = this.state
        return <div className="content">
            <div className="content-info">
                <Descriptions
                    title="我的信息"
                    column={{ xxl: 2, xl: 1, lg: 3, md: 3, sm: 2, xs: 1 }}
                    bordered
                >
                    <Descriptions.Item label="姓名" span={1}>{customer.name}</Descriptions.Item>
                    <Descriptions.Item label="工号" span={2}>{customer.employCode}</Descriptions.Item>
                    <Descriptions.Item label="类型" span={2}>{customer.typeDesc}</Descriptions.Item>
                    <Descriptions.Item label="车间" span={2}>{customer.workshop}</Descriptions.Item>
                    <Descriptions.Item label="岗位" span={2}>{customer.job}</Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    }
}
