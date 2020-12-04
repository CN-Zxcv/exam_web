import axios from 'axios'
import {message} from 'antd';

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
            return Promise.resolve(res.returnContent);
        } else {
            message.info(res.msgValue)
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
export default function http(fecth, url, param) {
    return new Promise((resolve, reject) => {
        switch (fecth) {
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
    if (err && err.response) {
        switch (err.response.status) {
            case 401:
                message.info("未授权，请登录")
                console.log("未授权，请登录");
                break;
            case 403:
                message.info("拒绝访问")
                console.log("拒绝访问");
                break;

            case 404:
                message.info("请求地址出错")
                console.log("请求地址出错");
                break;
            case 408:
                alert("请求超时");
                break;

            case 500:
                message.info("服务器内部错误")
                console.log("服务器内部错误");
                break;

            default:
                message.info("服务器连接失败")
                console.log("服务器连接失败");
                break;
        }
    }
}

