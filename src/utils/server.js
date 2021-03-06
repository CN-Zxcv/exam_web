import axios from 'axios'
import {message} from 'antd';
import cookie from 'react-cookies'
import router from "../router";
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "https://www.hrn.net.cn/api";
/**
 * http request 拦截器
 */
axios.interceptors.request.use(
    config => {
        config.data = JSON.stringify(config.data);
        config.headers = {
            "Content-Type": "application/json",
            "authorization" :  cookie.load("authorization")
        };
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    data => {
        let res = data.data
        if (res.msgCode === '0') {
            if(data.config.url === '/login/login'){
                let inFifteenMinutes = new Date(new Date().getTime() + 2 * 3600 * 1000);//2小时
                cookie.save("authorization", res.returnContent.token,{ expires: inFifteenMinutes });
            }
            return Promise.resolve(res.returnContent);
        } else if (res.msgCode === 'E90001' || res.msgCode === 'ERROR_CODE_90002'){
            //登录已失效 用户未登录
            message.info('E90001')
            return Promise.reject(res.msgCode);
        } else if (res.msgCode === 'E90003'){
            //权限不足
            message.info(res.msgValue)
            return Promise.reject(res.msgCode);
        } else {
            message.info(res.msgValue)
            return Promise.reject(res.msgCode);
        }
    },
    err => {
        msg(err);
        return Promise.reject(err);
    }
);

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        }).then((response) => {
            resolve(response);
        })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(
            (response) => {
                resolve(response);
            },
            (err) => {
                reject(err);
            }
        );
    });
}

//统一接口处理，返回数据
export default function http(type, url, param) {
    return new Promise((resolve, reject) => {
        switch (type) {
            case "get":
                console.log("begin a get request,and url:", url);
                get(url, param)
                    .then(function (response) {
                        resolve(response);
                    })
                    .catch(function (error) {
                        console.log("get request GET failed.", error);
                        reject(error);
                    });
                break;
            case "post":
                console.log("begin a POST request,and url:", url);
                post(url, param)
                    .then(function (response) {
                        resolve(response);
                    })
                    .catch(function (error) {
                        console.log("get request POST failed.", error);
                        reject(error);
                    });
                break;
            default:
                break;
        }
    });
}

//失败提示
function msg(err) {
    if (err) {
        if(err.response){
            switch (err.response.status) {
                case 401:
                    message.info("未授权，请登录")
                    console.log("未授权，请登录");
                    cookie.remove("name");
                    cookie.remove("employCode");
                    cookie.remove("authorization");
                    setTimeout( () => {
                    window.open("/")
                },500)
                    break;

                case 505:
                    message.info("登录已失效")
                    console.log("登录已失效");
                    cookie.remove("name");
                    cookie.remove("employCode");
                    cookie.remove("authorization");
                    setTimeout( () => {
                        window.open("/")
                    },500)
                    break;

                case 600:
                    message.info("权限不足")
                    console.log("权限不足");
                    break;

                default:
                    message.info("服务器连接失败")
                    console.log("服务器连接失败");
                    break;
            }
        } else {
            err.response.status = 500
            message.info("服务器连接失败")
            console.log("服务器连接失败");
        }
    }
}

