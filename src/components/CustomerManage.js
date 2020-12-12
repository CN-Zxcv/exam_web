import React, {Component} from "react";
import {getCustomers, sendMsg} from "../utils/api";
import {Tag, Table, Divider, Popconfirm, message} from "antd";
import '../css/CustomerManage.css';

function handleSubmit(status) {
    console.log(status)
}

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: '工号',
        dataIndex: 'employCode',
        key: 'employCode',
    },
    {
        title: '车间',
        dataIndex: 'workshop',
        key: 'workshop',
    },
    {
        title: '岗位',
        dataIndex: 'job',
        key: 'job',
    },
    {
        title: '类型',
        key: 'typeDate',
        dataIndex: 'typeDate',
        render: typeDate => (
            <Tag color={typeDate.color} key={typeDate.type}>
                {typeDate.desc}
            </Tag>
        )
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
                record.status === -1 ?
                <span>
                    <Popconfirm
                     placement="bottom"
                     title={"确定恢复员工？" + record.name + "？"} okText="恢复" cancelText="取消"
                     onConfirm={handleSubmit(1)}>
                        <a>恢复</a>
                    </Popconfirm>
                </span>
                :
                <span>
                      <Popconfirm
                          placement="bottom"
                          title={"确定" + record.status === 0 ? "启用" : "停用" + "员工？" + record.name + "？"} okText={record.status === 0 ? "启用" : "停用"} cancelText="取消"
                          onConfirm={handleSubmit(record.status === 0 ? 1 : 0)}>
                        <a>{record.status === 0 ? "启用" : "停用"}</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <Popconfirm
                        placement="bottom"
                        title={"确定删除员工？" + record.name + "？"} okText="删除" cancelText="取消"
                        onConfirm={handleSubmit(-1)}>
                        <a>删除</a>
                    </Popconfirm>
                </span>
        ),
    },
];


export default class CustomerManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerList: []
        };
    }

    componentDidMount() {
        document.title = '员工管理'
        getCustomers({status: -2}).then(
            (res) => {
                let customerList = []
                res.map((item, index) => {
                    let customer = item
                    customer.typeDate = {color: customer.typeColor, type: customer.type, desc: customer.typeDesc}
                    customer.index = index + 1 + ""
                    customerList.push(customer)
                });
                this.setState({loading: false, customerList: customerList})
            },
            (error) => {
                this.setState({loading: false})
                if (error === 'E90001') {
                    this.props.history.replace('/')
                }
            }
        );

    }

    render() {
        const {loading, customerList} = this.state;

        return <Table loading={loading} columns={columns} dataSource={customerList}/>


    }
}
