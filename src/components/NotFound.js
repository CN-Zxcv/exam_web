import React, {Component} from "react";
import Empty from "antd/es/empty";

export default class CustomerManage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            customerList : []
        };
    }

    componentDidMount() {
        document.title = '页面不存在'
    }

    render() {
        return <Empty style={{marginTop : 200}} image={Empty.PRESENTED_IMAGE_SIMPLE} description= "404 页面不存在" />
    }
}
