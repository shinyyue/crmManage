import axios from 'axios'

// 自定义配置
const customAxios = axios.create({
    timeout: 20000
})
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

export default customAxios
