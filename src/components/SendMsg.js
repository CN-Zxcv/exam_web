import '../css/SendMsg.css';
import React, {Component} from 'react';
import {Input, Button, Icon, Select, message, Popconfirm} from 'antd';
import {getCustomers, sendMsg} from "../utils/api";
import cookie from 'react-cookies'

const {TextArea} = Input;

const {Option} = Select;

export class SendMsg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            title: null,
            content: null,
            customerList: [],
            employCodeList: [],
        };
    }

    componentDidMount() {
        document.title = '推送消息'
        getCustomers({status: -2}).then(
            (res) => {
                console.log(res)
                this.setState({customerList: res})
            },
            (error) => {
                if (error === 'E90001') {
                    this.props.history.replace('/')
                }
            }
        );
    }

    handleSubmit = e => {
        const {loading, title, content, employCodeList} = this.state;
        let codeList = []
        employCodeList.map(item => {
            codeList.push(item.key)
        })
        this.setState({loading: true});
        sendMsg({title, content, employCodeList: codeList}).then(
            (res) => {
                this.setState({loading: false})
                message.info("消息推送成功")
            },
            () => {
                this.setState({loading: false})
            }
        );
    };

    fetchUser = char => {

    }

    handleChange = value => {
        this.setState({
            employCodeList: value,
        });
    };

    render() {
        const {loading, title, content, employCodeList, customerList} = this.state;
        return (
            <div className="content">
                <div className="content-msg">
                    <Input
                        disabled={loading}
                        placeholder="请输入标题"
                        allowClear
                        prefix={<Icon type="edit" style={{color: 'rgba(0,0,0,.30)'}}/>}
                        value={title}
                        onChange={(e) => this.setState({title: e.currentTarget.value})}
                        style={{color: "#555555", fontSize: 14}}
                    />
                    <TextArea disabled={loading}
                              allowClear
                              placeholder="请输入内容"
                              autoSize={{ minRows: 4, maxRows: 10 }}
                              value={content}
                              onChange={(e) => this.setState({content: e.currentTarget.value})}
                              style={{marginTop: 10}}
                    />

                    <Select
                        mode="multiple"
                        labelInValue
                        value={employCodeList}
                        placeholder="消息接收员工,空表示全部员工"
                        //notFoundContent={fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                        style={{width: '100%', marginTop: 10}}
                    >
                        {customerList.map(d => (
                            <Option key={d.employCode}>{d.name}</Option>
                        ))}
                    </Select>

                    <Popconfirm
                        placement="bottom"
                        title={employCodeList.length === 0 ? "确定推送消息给所有人？" : "确定推送消息给这些人？"} okText="推送" cancelText="取消"
                        onConfirm={this.handleSubmit.bind(this)}>
                        <Button type="danger"
                                block
                                className="login-form-button"
                            //onClick={this.handleSubmit.bind(this)}
                                loading={this.state.loading}
                                style={{marginTop: 10}}
                        >
                            发送
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        );
    }
}

