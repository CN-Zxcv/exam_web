import React, {Component} from "react";

export default class PaperManage extends Component{

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        document.title = '试卷管理'
    }

    render() {
        return (
            <div>
                PaperManage
            </div>
        );
    }
}
