import http from "./server"

/**
 * 登录
 */
function login(param){
    return new Promise((resolve, reject) => {
        http("post",'/login/login', param).then(res => {
            resolve (res);
        },error => {
            reject(error)
        })
    })
}

/**
 * 获取首页列表
 */
function getMenus(param){
    return new Promise((resolve, reject) => {
        http("post",'/common/menu', param).then(res => {
            resolve (res);
        },error => {
            reject(error)
        })
    })
}

/**
 * 获取首页列表
 */
function getCustomers(param){
    return new Promise((resolve, reject) => {
        http("post",'/common/customerlist', param).then(res => {
            resolve (res);
        },error => {
            reject(error)
        })
    })
}

/**
 * 发送推送消息
 */
function sendMsg(param){
    return new Promise((resolve, reject) => {
        http("post",'/common/sendmsg', param).then(res => {
            resolve (res);
        },error => {
            reject(error)
        })
    })
}

/**
 * 修改密码
 */
function changePassword(param){
    return new Promise((resolve, reject) => {
        http("post",'/common/changepassword', param).then(res => {
            resolve (res);
        },error => {
            reject(error)
        })
    })
}

/**
 * 用户信息
 */
function customerInfo(param){
    return new Promise((resolve, reject) => {
        http("post",'/common/customerinfo', param).then(res => {
            resolve (res);
        },error => {
            reject(error)
        })
    })
}


export {
    login,
    getMenus,
    getCustomers,
    sendMsg,
    changePassword,
    customerInfo
}
