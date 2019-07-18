import axios from 'axios'

// 自定义配置
const customAxios = axios.create({
    timeout: 20000,
    withCredentials: true
})
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 接口请求统一参数配置
axios.interceptors.request.use(
    conf => {
        if (conf.method === 'get') {
            conf.params = conf.data
        }
        return Object.assign({}, conf, {})
    },
    err => Promise.reject(err)
)

export default customAxios
