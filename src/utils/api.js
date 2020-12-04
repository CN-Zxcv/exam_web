import http from "./server"

/**
 * 获取首页列表
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

export {
    login
}
