import {
    mapActions
} from 'vuex'

import {
    IM_API_ROOT
} from '../config'

let ws = null
// let themeId = 0
let timer = null

const globalIM = {
    methods: {
        ...mapActions(['manuallyLoginOut']),
        initWebSocket() {
            ws = this.$store.state.imStore.ws || new WebSocket(IM_API_ROOT)
            ws.onoepn = this.wsOnpen
            ws.onmessage = this.wsOnMessage
            ws.onclose = this.wsOnClose
            if (!this.$store.state.imStore.ws) {
                this.$store.dispatch('setWs', ws)
                this.wsLoginChat()
            }
        },
        // 开启
        wsOnpen() {
            // this.$vux.loading.hide()
        },
        // 接收数据
        wsOnMessage(res) {
            // this.$vux.loading.hide()
            const data = JSON.parse(res.data)
            if (data.status && data.status === -1) {
                this.$notify({
                    title: '会话超时，请重新登录'
                })
                this.$store.dispatch('setWs', null)
                this.$store.dispatch('manuallyLoginOut').then(() => {
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                })
                return
            }
            if (data.action === 'themelist') {
                this.$store.dispatch('getThemeList', data.data)
            } else if (data.action === 'push_logout') {
                this.$store.dispatch('setWs', null)
                this.$notify({
                    title: '当前已有其他人登录此账号'
                })
                this.manuallyLoginOut().then(() => {
                    this.$router.push({
                        path: '/login',
                        query: {
                            redirect: this.$route.path
                        }
                    })
                })
            }
        },
        // 发送数据(数据格式是json字符串)
        wsOnSend(sendMessage) {
            sendMessage.token = window.localStorage.token
            ws.send(JSON.stringify(sendMessage))
        },
        // 关闭
        wsOnClose(res) {
            // this.initWebSocket()
        },
        wsHandler(sendMessage) {
            // CONNECTING === 0 连接还没开启。
            // OPEN === 1 连接已开启并准备好进行通信。
            // CLOSING === 2 连接正在关闭的过程中。
            // CLOSED === 3 连接已经关闭，或者连接无法建立。
            if (ws.readyState === ws.OPEN) {
                this.wsOnSend(sendMessage)
                clearTimeout(timer)
            } else if (ws.readyState === ws.CONNECTING) {
                timer = setTimeout(() => {
                    this.wsHandler(sendMessage)
                }, 500)
            } else if (ws.readyState === ws.CLOSED) {
                clearTimeout(timer)
            }
        },
        // // 登陆会话
        wsLoginChat() {
            const sendMessage = {
                class: 'User',
                action: 'kflogin',
                data: {
                    userid: Number(window.localStorage.getItem('userId'))
                    // udid: md5(window.navigator.userAgent) // eslint-disable-line
                }
            }
            this.wsHandler(sendMessage)
        },
        // 获取回复列表
        wsGetChatList() {
            const sendMessage = {
                class: 'Chat',
                action: 'themelist',
                data: {
                    prodcode: window.localStorage.getItem('product_code')
                }
            }
            this.wsHandler(sendMessage)
        }
    }
}
export {
    globalIM
}
