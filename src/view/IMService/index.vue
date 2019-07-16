<template>
    <layout id="customer-service">
        <div class="content-title">
            <span>医学顾问会话</span>
        </div>
        <div class="chat-wrapper">
            <ul class="chat-operation">
                <li>
                    <span>未读信息</span>
                    <span class="unread-count"
                          v-show="unreadNum > 0">
                        {{unreadNum > 99 ? '99+' : unreadNum}}
                    </span>
                </li>
            </ul>
            <div class="chat-list">
                <ul class="chat-tab">
                    <li :class="{'active': tabIndex === 0}"
                        @click="changeTab(0)">回复列表</li>
                    <li :class="{'active': tabIndex === 1}"
                        @click="changeTab(1)">患者列表</li>
                </ul>
                <div class="member-search"
                     v-show="tabIndex === 1">
                    <img src="/static/img/search.svg"
                         @click="searchPatient()">
                    <input type="text"
                           @keyup.enter="searchPatient()"
                           placeholder="搜索病人姓名或手机号"
                           v-model="searchText">
                </div>
                <!-- 患者列表 -->
                <ul class="chat-list-wrapper patlist"
                    v-show="tabIndex === 1"
                    v-infinite-scroll="patLoadMore"
                    infinite-scroll-disabled="patLoading"
                    infinite-scroll-distance="10">
                    <li v-for="(item, index) in patientList"
                        :key="'p0_'+index"
                        class="chat-item"
                        @click="checkedMember(item)"
                        :class="{'item-active': currentMember && currentMember.user_id === item.user_id}">
                        <img :src="item.user_avt">
                        <div class="post-info">
                            <span>{{item.user_name || item.nick_name || '未注册'}}</span>
                            <div class="patient-info">
                                <span v-show="item.birthday">{{item.birthday | age}}岁</span>
                                <!-- todo 缺字段：关注医生及医生所在医院 -->
                                <span>{{item.current_doctor_id}}</span>
                            </div>
                        </div>
                    </li>
                    <div class="chat-done">{{patLoading ? '加载完毕' : '加载中....'}}</div>
                </ul>
                <!-- 回复列表 -->
                <ul v-show="tabIndex === 0"
                    class="chat-list-wrapper">
                    <li class="chat-item"
                        v-for="(item, index) in replyList"
                        @click="checkedMember(item)"
                        :class="{'item-active': currentMember && Number(currentMember.theme_id) === Number(item.theme_id)}"
                        :key="'p1_'+index">
                        <div class="unread-num"
                             v-show="item.recent_nums > 0">{{item.recent_nums > 99 ? '99+' : item.recent_nums}}</div>
                        <img :src="item.user_avt">
                        <div class="post-info">
                            <span>{{item.user_name || item.nick_name || '未注册'}}</span>
                            <div class="patient-info">
                                <span class="post-value">{{item.post_type === 'text' ? item.post : (item.post_type === 'article' ? '[链接]' : '[图片]')}}</span>
                                <span>{{item.recent_time * 1000 | formatTime}}</span>
                            </div>
                        </div>
                    </li>
                    <div class="chat-none"
                         v-show="!replyList || replyList.length === 0">暂无更多数据</div>
                </ul>
            </div>
            <div class="chat-response">
                <div class="response-list">
                    <div class="response-title"
                         @click="jumpToDeatails()">
                        <span>用户详情</span>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <!-- <el-collapse v-show="currentMember"
                                 v-model="openDetails">
                        <el-collapse-item title="用户详情"
                                          name="patientDetails">
                            <div class="info-collapse">
                                <span>姓名:{{patientDetails.user_name || '暂无'}}</span>
                                <span>BMI: {{patientDetails.bmi || '暂无'}}</span>
                                <span>备孕时长：{{patientDetails.long || '暂无'}}</span>
                                <span>年龄：{{patientDetails.age || '暂无'}}</span>
                                <span>试管次数：{{patientDetails.times || '暂无'}}</span>
                                <span>家族病史：{{patientDetails.family_his || '暂无'}}</span>
                                <span>既往病史：{{patientDetails.his || '暂无'}}</span>
                            </div>
                        </el-collapse-item>
                    </el-collapse> -->
                    <div v-show="currentMember && tabIndex === 0"
                         class="chat-details"
                         :class="{'hidden': stopScroll}"
                         ref="scrollList">
                        <ul class=""
                            ref="loadmore">
                            <span class="none-chat"
                                  v-show="chatLoading">{{chatLoading === 'loading' ? '加载中...' : '没有更多记录'}}</span>
                            <li v-for="(item, index) in chatDetailsList"
                                :key="'chat_'+index"
                                class="details-item">
                                <div class="chat-time"
                                     v-show="item.showTime">{{item.create_time | formatChatTime}}</div>
                                <!-- 患者 -->
                                <div class="chat-item"
                                     v-if="!item.isself">
                                    <img class="chat-avator"
                                         :src="item.user_avt">
                                    <div class="im-content">
                                        <div class="im-user">{{item.user_name}}</div>
                                        <div class="im-text">
                                            <div class="ctrl"
                                                 v-show="item.post_type === 'text'"
                                                 v-html="item.post"></div>
                                            <img v-show="item.post_type === 'image'"
                                                 :src="item.post"
                                                 @click="showBig(item)"
                                                 class="post-img">
                                            <i class="triangle"></i>
                                            <img class="post-loading"
                                                 v-show="!item.sended"
                                                 src="/static/img/loading.png">
                                            <img class="post-error"
                                                 v-show="item.sended === 'loading'"
                                                 src="/static/img/loaded-error.png">
                                        </div>
                                    </div>
                                </div>
                                <!-- 医学顾问 -->
                                <div class="chat-item self"
                                     v-else>
                                    <div class="im-content">
                                        <div class="im-user">{{item.user_name}}</div>
                                        <div class="im-text">
                                            <div class="ctrl"
                                                 v-show="item.post_type === 'text'"
                                                 v-html="item.post"></div>
                                            <img v-show="item.post_type === 'image'"
                                                 :src="item.post"
                                                 @click="showBig(item)"
                                                 class="post-img">
                                            <div v-show="item.post_type === 'article'">
                                                <div class="article-desc">{{item.post}}</div>
                                                <a :href="item.href"
                                                   class="article-link">{{item.hreftext}}</a>
                                            </div>
                                            <i class="triangle"></i>
                                            <img class="post-loading"
                                                 v-show="item.sended === 'loading'"
                                                 src="/static/img/loading.png">
                                            <img class="post-error"
                                                 v-show="item.sended === 'error'"
                                                 src="/static/img/loaded-error.png">
                                        </div>
                                    </div>
                                    <img class="chat-avator"
                                         :src="item.user_avt">
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 发起会话按钮 -->
                <div class="response-content"
                     v-show="tabIndex === 1 && currentMember">
                    <button class="start-chat"
                            @click="wsCreateChat(currentMember.user_id)">发起会话</button>
                </div>
                <!-- 编辑区 -->
                <div class="response-content"
                     v-show="tabIndex === 0 && currentMember">
                    <div class="upload-img">
                        <div class="response-editor">
                            <img class=""
                                 src="/static/img/img.svg">
                            <upload @uploadImg="uploadImage"></upload>
                        </div>
                        <el-popover class="response-editor"
                                    ref="textPopover"
                                    placement="top"
                                    width="400"
                                    trigger="click">
                            <el-table :data="quickReplyList"
                                      @row-click="checkTextSend"
                                      header-cell-class-name="editor-thead">
                                <el-table-column property="content"
                                                 label="快捷回复语句列表"></el-table-column>
                            </el-table>
                            <div class="editor-next"
                                 @click="textNextPage()"> {{textLoaded === 'loaded' ? '暂无更多数据' : (textLoaded === 'static' ? '点击查看下一页' : '加载中...') }}</div>
                            <img slot="reference"
                                 src="/static/img/send-text.svg">
                        </el-popover>
                        <div class="response-editor">
                            <el-popover class="response-editor"
                                        ref="linkPopover"
                                        placement="top"
                                        width="400"
                                        trigger="click">
                                <el-table :data="quickLinkList"
                                          @row-click="checkLinkSend">
                                    <el-table-column property="href_text"
                                                     label="快捷回复链接列表"></el-table-column>
                                </el-table>
                                <div class="editor-next"
                                     @click="linkNextPage()">{{linkLoaded === 'loaded' ? '暂无更多数据' : (linkLoaded === 'static' ? '点击查看下一页' : '加载中...')}}</div>
                                <img slot="reference"
                                     src="/static/img/send-link.svg">
                            </el-popover>
                        </div>
                    </div>
                    <textarea autofocus="autofocus"
                              v-model="chatText"
                              ref="textarea"
                              placeholder="温馨提示：快捷键enter为发送键，control键为换行键"
                              @keyup.17="onchangeline"
                              @keyup.enter="sendTextMessage()"></textarea>
                    <button @click="sendTextMessage()"
                            v-show="tabIndex === 0 && chatText">发送</button>
                </div>
            </div>
        </div>
        <preview class="bigimg-wrapper"
                 @previewCloseHandle="previewCloseHandle"
                 :showPreview="showBigImg"
                 :imgUrl="currentImg"></preview>
        <preview class="bigimg-wrapper"
                 @previewCloseHandle="previewOperateCloseHandle"
                 :showPreview="showSendMessage"
                 :imgUrl="chatImgUrl">
            <div slot="title"
                 class="bigimg-title">{{sendMessageType === 'image' ? '确定发送该图片么？' : (sendMessageType === 'link' ? '确定发送该链接模版么？' : '')}}</div>
            <div slot="footer">
                <el-button type="primary"
                           plain
                           @click="showSendMessage = false">取消</el-button>
                <el-button type="primary"
                           @click="sendImgMessage()">确定</el-button>
            </div>
        </preview>
    </layout>
</template>

<script>
import moment from 'moment'
import Upload from '../../components/UploadImg'
import Preview from '../../components/Preview'
import { mapActions } from 'vuex'
import { IM_API_ROOT } from '../../config'
import vue from 'vue'
import {
    InfiniteScroll
} from 'mint-ui'

export default {
    components: {
        [Upload.name]: Upload,
        [Preview.name]: Preview,
        InfiniteScroll
    },
    directives: {
        InfiniteScroll
    },
    filters: {
        age(val) {
            if (!val) {
                return
            }
            const now = moment()
            const birth = moment(new Date(val * 1000))
            return now.diff(birth, 'year')
        },
        birth(val) {
            if (!val) {
                return
            }
            const birth = moment(new Date(val * 1000))
            const now = moment()
            return now.diff(birth, 'year')
        },
        bmi(val) {
            if (!val) {
                return
            }
            if (
                val.height &&
                val.weight &&
                !isNaN(Number(val.height)) &&
                !isNaN(Number(val.weight))
            ) {
                return (val.weight / Math.pow(val.height / 100, 2)).toFixed(2)
            }
            return '暂无'
        },
        formatChatTime(val) {
            const date = new Date(val * 1000).format('yyyy年MM月dd日')
            const now = new Date().format('yyyy年MM月dd日')
            if (date === now) {
                const nowTime = new Date(val * 1000).format('hh')
                return (
                    (nowTime > 12 ?
                        `下午 ${nowTime - 12}` :
                        `上午 ${nowTime}`) +
                    ':' +
                    new Date(val * 1000).format('mm')
                )
            } else {
                const hours = new Date(val * 1000).format('hh')
                return (
                    new Date(val * 1000).format('yyyy年MM月dd日') +
                    ' ' +
                    (hours > 12 ? `下午${hours - 12}` : `上午${hours}`) +
                    ':' +
                    new Date(val * 1000).format('mm')
                )
            }
        },
        formatTime(val) {
            if (!val) {
                return
            }
            const today = moment(new Date(val)).format('YYYY年MM月DD日')
            const time = moment(new Date()).format('YYYY年MM月DD日')
            return time === today ?
                moment(new Date(val)).format('HH:mm') :
                moment(new Date(val)).format('MM月DD日')
        }
    },
    data() {
        return {
            showBigImg: false,
            currentImg: '',
            tabIndex: 0,
            patientList: [],
            replyList: [],
            currentMember: null,
            timer: null,
            sendMessage: {},
            chatDetailsList: [],
            chatText: '',
            chatImgUrl: '',
            chatImgList: [],
            isSearching: false,
            searchText: '',
            searchResult: [],
            openDetails: ['patientDetails'],
            isCreateChat: false, // 是否发起会话成功
            unreadNum: 0,
            chatLoading: '',
            chatPage: 1,
            pageHeight: [
                {
                    page: 1,
                    height: 0
                }
            ],
            patientPage: 1,
            patientDetails: {},
            patLoading: false,
            scrollEl: null,
            scrollElHeight: 0,
            stopScroll: false,
            isChatAddOne: false, // 新增一条消息时，页面滚动到最底部的标识
            Notification: null, // Notification实例
            formdata: null, // 当前上传图片的数据
            showSendMessage: false,
            quickReplyList: [],
            quickLinkList: [],
            linkPageSize: 10,
            textPageSize: 10,
            textCurrentPage: 0,
            linkCurrentPage: 0,
            searchReplyText: '',
            textLoaded: 'static',
            linkLoaded: 'static',
            sendMessageType: 'text' // 发送的message类型： image/text/article
        }
    },
    computed: {
        ws() {
            if (this.$store.state.imStore) {
                return (
                    this.$store.state.imStore.ws || new WebSocket(IM_API_ROOT)
                )
            }
        },
        // 医学顾问头像
        kefuAvator() {
            if (this.$store.state.imStore) {
                return this.$store.state.imStore.kefuAvator
            }
        },
        themename() {
            return window.localStorage.getItem('product_code') === 'nanke' ?
                '亲，在男性生殖健康方面遇到什么问题了吗？可以找我聊一聊哦~ 您也可以从首页《问医生》来直接向您的绑定医生提问~' :
                '亲爱的，试管备孕的路上您遇到什么问题了吗？可以找我聊一聊哦~ 您也可以从首页《问医生》来直接向您的绑定医生提问~'
        }
    },
    watch: {
        chatText(val) {
            if (val.trim()) {
                this.$refs.textPopover.showPopper = true
            } else {
                this.$refs.textPopover.showPopper = false
            }
            this.textCurrentPage = 0
            this.quickReplyList = []
            this.searchReplyText = val.trim()
            this.getReplyTextList()
        },
        chatDetailsList: {
            deep: true,
            handler(list) {
                if (list && list.length > 0) {
                    this.$nextTick(() => {
                        this.scrollElHeight = this.scrollEl.scrollHeight
                    })
                    // 今天的聊天记录 两条记录时间间隔超过30分钟才显示时间； 非今天显示yyyy年MM月dd日
                    list.forEach((item, index) => {
                        item.showTime = true
                        const time = new Date(item.create_time * 1000).format(
                            'yyyy-MM-dd'
                        )
                        const now = new Date().format('yyyy-MM-dd')
                        if (index > 0) {
                            const lastTime = new Date(
                                list[index - 1].create_time * 1000
                            ).format('yyyy-MM-dd')
                            const lastDetailsTime = list[index - 1].create_time
                            if (time !== now) {
                                item.showTime = !(time === lastTime)
                            } else {
                                item.showTime =
                                    item.create_time - lastDetailsTime > 30 * 60
                            }
                        }
                    })
                }
            }
        },
        scrollElHeight(val) {
            const index = this.pageHeight.findIndex(item => {
                return item.page === this.chatPage
            })
            if (index === -1) {
                this.pageHeight.push({
                    page: this.chatPage,
                    height: val
                })
            } else {
                this.pageHeight[index].height = val
            }
            if ((val > 0 && this.chatPage === 1) || this.isChatAddOne) {
                // scrollTop = scrollHeight (文本高度) -  clientHeight (视口高度)
                this.$refs.scrollList.scrollTop =
                    val - this.$refs.scrollList.clientHeight
            } else if (!this.isChatAddOne && this.chatPage > 1) {
                // 滚动到本次与上一次加载之前的高度之差 - 一次会话的高度（可以固定 80)
                const diffHeight =
                    this.pageHeight[this.chatPage - 1].height -
                    this.pageHeight[this.chatPage - 2].height
                this.$refs.scrollList.scrollTop = diffHeight - 70
            }
        }
    },
    methods: {
        ...mapActions(['uploadImg', 'manuallyLoginOut', 'getPatientLists']),
        // 关闭已经发送出去的图片及收到的图片弹框
        previewCloseHandle() {
            this.showBigImg = false
        },
        // 关闭确认发送图片／链接弹框
        previewOperateCloseHandle() {
            this.showSendMessage = false
        },
        // 监听shift + enter按键,换行功能
        onchangeline() {
            if (this.chatText) {
                this.chatText += '\r\n'
            }
        },
        showBig(item) {
            this.showBigImg = true
            this.currentImg = item.post || this.chatImgUrl
        },
        // 患者列表加载更多
        patLoadMore() {
            // 已经加载完毕
            if (this.patLoading || this.tabIndex === 0) {
                return
            }
            this.patientPage++
            this.getList()
        },
        searchPatient() {
            this.resetPatientLoad()
            this.isSearching = true
            this.getList()
        },
        resetPatientLoad() {
            this.patientPage = 1
            this.patLoading = false
            this.patientList = []
        },
        changeTab(index) {
            this.tabIndex = index
            this.currentMember = null
            this.resetPatientLoad()
            if (index === 1) {
                this.getList()
            }
        },
        getList() {
            this.sendMessage = {
                class: 'User',
                action: 'reglist',
                data: {
                    page: this.patientPage,
                    condation: this.searchText.trim(),
                    prodcode: window.localStorage.getItem('product_code')
                }
            }
            this.wsHandler()
        },
        getPatientInfo() {
            this.sendMessage = {
                class: 'User',
                action: 'info',
                data: {
                    userid: this.currentMember.user_id
                }
            }
            this.wsHandler()
        },
        checkedMember(member) {
            this.$refs.textarea.focus()
            // 清空聊天信息
            this.chatText = ''
            this.currentMember = member
            this.openDetails = this.tabIndex === 1 ? ['patientDetails'] : []
            this.getPatientInfo()
            if (this.tabIndex === 0) {
                this.chatDetailsList = []
                this.chatLoading = ''
                this.chatPage = 1
                this.stopScroll = true
                // 点击回复列表里的某一个患者时，请求医学顾问与该患者的聊天记录
                this.wsGetChatDetailsList()
                // 清空被选中用户的未读消息数量
                if (member.recent_nums > 0) {
                    this.wsClearUnread()
                }
                let num = 0
                this.replyList.forEach(item => {
                    if (Number(item.theme_id) === Number(member.theme_id)) {
                        item.recent_nums = 0
                    }
                    num += item.recent_nums
                })
                this.unreadNum = num
            } else {
                this.patientPage = 1
            }
        },
        // 创建会话
        startChatHandle() {
            // 回到回复列表
            const member = this.currentMember
            this.tabIndex = 0
            this.openDetails = []
            this.chatDetailsList = []
            this.chatLoading = ''
            this.chatPage = 1
            const index = this.replyList.findIndex(p => {
                return Number(p.theme_id) === Number(member.theme_id)
            })
            if (index < 0) {
                this.replyList.unshift(member)
            } else {
                // 如果将要会话的患者已经出现在会话里面的话，则拿出放到列表的最前面, 并清空未读数量
                this.wsClearUnread()
                if (member.recent_nums > 0) {
                    this.wsClearUnread()
                }
                let num = 0
                this.replyList.forEach(item => {
                    if (Number(item.theme_id) === Number(member.theme_id)) {
                        item.recent_nums = 0
                    }
                    num += item.recent_nums
                })
                this.unreadNum = num
                const p = this.replyList.splice(index, 1)
                if (p && p.length > 0) {
                    this.replyList = [p[0], ...this.replyList]
                }
            }
            this.wsGetChatDetailsList()
        },
        // 接收数据
        wsOnMessage(res) {
            const data = JSON.parse(res.data)
            if (data.status && data.status === -1) {
                this.$notify({
                    title: '会话超时，请重新登录'
                })
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
            if (data.action === 'create') {
                this.isCreateChat = true
                this.currentMember = data.data
                this.currentMember.user_id = this.currentMember.user_id || (this.$route.query && this.$route.query.patientId)
                this.currentMember.recent_nums = 0
                this.startChatHandle()
            } else if (data.action === 'send') {
                this.chatDetailsList.some(item => {
                    if (Number(item.chat_id) === Number(data.data.chat_id)) {
                        item.sended = 'loaded'
                    }
                })
                this.chatImgUrl = ''
                // todo 重复梳理代码
                if (this.replyList && this.replyList.length > 0) {
                    let num = 0
                    this.replyList.forEach((item, index) => {
                        if (
                            Number(item.theme_id) ===
                            Number(this.currentMember.theme_id)
                        ) {
                            const p = this.replyList.splice(index, 1)
                            if (p && p.length > 0) {
                                this.replyList = [p[0], ...this.replyList]
                            }

                            // 更新该患者的对话
                            item.post_type = this.sendMessageType
                        }
                        num += item.recent_nums
                    })
                    this.unreadNum = num
                }
                // 清空发送框
                this.chatText = ''
            } else if (data.action === 'push_list') {
                if (data.data && data.data.length === 1) {
                    this.checkNotify(data.data[0])
                    this.isChatAddOne = true
                    data.data.map(item => {
                        item.sended = 'loaded'
                    })
                    // 接收到患者发送的数据后，先判断当前聊天界面是不是该患者，不是的话，需要在列表里找到他，更新他的未读信息和未读条数
                    const newMessage = data.data[0]
                    if (
                        this.currentMember &&
                        Number(newMessage.theme_id) ===
                            Number(this.currentMember.theme_id)
                    ) {
                        // 收到当前聊天的用户的信息
                        const index = this.replyList.findIndex(item => {
                            return (
                                Number(item.theme_id) ===
                                Number(newMessage.theme_id)
                            )
                        })
                        if (index >= 0) {
                            this.replyList[index].post = newMessage.post
                            this.replyList[index].post_type =
                                newMessage.post_type
                            this.wsClearUnread()
                        }
                        this.chatDetailsList.push(newMessage)
                    } else {
                        // 收到非当前聊天的用户的信息
                        // todo 重复梳理代码
                        if (this.replyList && this.replyList.length > 0) {
                            let num = 0
                            this.replyList.forEach((item, index) => {
                                if (
                                    Number(item.theme_id) ===
                                    Number(newMessage.theme_id)
                                ) {
                                    const p = this.replyList.splice(index, 1)
                                    if (p && p.length > 0) {
                                        this.replyList = [
                                            p[0],
                                            ...this.replyList
                                        ]
                                    }
                                    // 更新该患者的对话
                                    item.recent_nums++
                                    item.post = newMessage.post
                                    item.post_type = newMessage.post_type
                                }
                                num += item.recent_nums
                            })
                            this.unreadNum = num
                        }
                        const index = this.replyList.findIndex(item => {
                            return (
                                Number(item.theme_id) ===
                                Number(newMessage.theme_id)
                            )
                        })
                        if (index < 0) {
                            newMessage.recent_nums = 1
                            this.replyList.unshift(newMessage)
                        }
                    }
                }
            } else if (data.action === 'list') {
                this.isChatAddOne = false
                this.stopScroll = false
                if (data.data && data.data.length < data.page.count) {
                    this.chatLoading = 'loaded'
                } else {
                    this.chatLoading = ''
                }
                data.data.map(item => {
                    item.sended = 'loadedd'
                })
                this.chatDetailsList = [...data.data, ...this.chatDetailsList]
            } else if (data.action === 'themelist') {
                let num = 0
                this.replyList = data.data
                if (this.replyList && this.replyList.length > 0) {
                    this.replyList.forEach(item => {
                        num += item.recent_nums
                    })
                    this.unreadNum = num
                }
            } else if (data.action === 'clear') {
            } else if (data.action === 'reglist') {
                if (data.data && data.data.length < data.page.count) {
                    this.patLoading = true
                }
                if (this.isSearching) {
                    this.patientList = data.data
                } else {
                    this.patientList = [...this.patientList, ...data.data]
                }
                this.isSearching = false
            } else if (data.action === 'info') {
                this.patientDetails = data.data
            } else if (data.action === 'push_logout') {
                this.$notify({
                    title: '当前已有其他人登录此账号'
                })
                this.manuallyLoginOut().then(res => {
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
        wsOnSend() {
            this.sendMessage.token = window.localStorage.token
            this.ws.send(JSON.stringify(this.sendMessage))
        },
        // 关闭
        wsOnClose(res) {
            this.$notify.error({
                title: '连接已断开，请刷新页面重试'
            })
            // this.initWebSocket()
        },
        wsOnerror(res) {
            // console.log('onerror', res)
        },
        wsHandler() {
            // CONNECTING === 0 连接还没开启。
            // OPEN === 1 连接已开启并准备好进行通信。
            // CLOSING === 2 连接正在关闭的过程中。
            // CLOSED === 3 连接已经关闭，或者连接无法建立。
            if (this.ws.readyState === this.ws.OPEN) {
                this.wsOnSend()
                clearTimeout(this.timer)
            } else if (this.ws.readyState === this.ws.CONNECTING) {
                this.timer = setTimeout(() => {
                    this.wsHandler()
                }, 500)
            } else if (this.ws.readyState === this.ws.CLOSED) {
                this.$notify.error({
                    title: '',
                    message: '连接已关闭，请刷新页面重试...'
                })
                clearTimeout(this.timer)
            }
        },
        // 创建会话
        wsCreateChat(targetId) {
            this.sendMessage = {
                class: 'Chat',
                action: 'createThemByKf',
                token: window.localStorage.getItem('token'),
                data: {
                    themename: this.themename,
                    themetype: 4,
                    sponsorid: window.localStorage.getItem('userId'),
                    sponsortype: 'kefu',
                    targetid: targetId,
                    targettype: 'patient',
                    prodcode: window.localStorage.getItem('product_code')
                }
            }
            this.wsHandler()
        },
        // 发送消息
        wsSendMessage(tag, chatId, info) {
            let post = ''
            let href = ''
            let hreftext = ''
            if (tag === 'image') {
                post = this.chatImgUrl
            } else if (tag === 'text') {
                post = this.chatText
            } else if (tag === 'article') {
                post = info.content
                href = info.href
                hreftext = info.href_text
            }
            this.sendMessageType = tag
            this.isChatAddOne = true
            this.sendMessage = {
                class: 'Chat',
                action: 'sendByKf',
                data: {
                    themeid: this.currentMember.theme_id,
                    sponsorid: window.localStorage.getItem('userId'),
                    sponsortype: 'kefu',
                    posttype: tag,
                    post: post,
                    href: href,
                    hreftext: hreftext,
                    type: 2,
                    chat_id: chatId
                }
            }
            this.wsHandler()
        },
        // 获取医学顾问与某患者的聊天记录列表
        wsGetChatDetailsList() {
            this.sendMessage = {
                class: 'Chat',
                action: 'listByTheme',
                data: {
                    themeid: this.currentMember.theme_id,
                    userid: Number(window.localStorage.getItem('userId')),
                    usertype: 'kefu',
                    page: this.chatPage
                }
            }
            this.wsHandler()
        },
        // 获取回复列表
        wsGetChatList() {
            this.sendMessage = {
                class: 'Chat',
                action: 'themelist',
                data: {
                    prodcode: window.localStorage.getItem('product_code')
                }
            }
            this.wsHandler()
        },
        // 未读变为已读
        wsClearUnread() {
            this.sendMessage = {
                class: 'Chat',
                action: 'clear',
                data: {
                    themeid: this.currentMember.theme_id,
                    userid: Number(window.localStorage.getItem('userId')),
                    usertype: 'kefu'
                }
            }
            this.wsHandler()
        },
        // 发送文本消息
        sendTextMessage() {
            if (!this.chatText.trim()) {
                this.$notify.error({
                    message: '请输入发送内容'
                })
                return
            }
            const now = new Date().getTime()
            const sendMessage = {
                post: this.chatText,
                post_type: 'text',
                isself: 1,
                user_avt: window.localStorage.getItem('userAvt'),
                user_name: window.localStorage.getItem('userName'),
                create_time: new Date().getTime() / 1000,
                sended: 'loading',
                chat_id: now
            }
            this.chatDetailsList.push(sendMessage)
            this.wsSendMessage('text', now)
        },
        // 发送图片消息
        sendImgMessage() {
            this.showSendMessage = false
            const now = new Date().getTime()
            const sendMessage = {
                post: this.chatImgUrl,
                post_type: 'image',
                isself: 1,
                user_avt: window.localStorage.getItem('userAvt'),
                user_name: window.localStorage.getItem('userName'),
                create_time: new Date().getTime() / 1000,
                sended: 'loading',
                chat_id: now
            }
            this.chatDetailsList.push(sendMessage)
            vue.axios
                .post(
                    'https://api.func.futurefertile.com/file/upload?session_id=' +
                        now,
                    this.formdata
                )
                .then(res => {
                    if (res.status === 0) {
                        if (res.data && res.data.length > 0) {
                            this.chatImgUrl = res.data[0].url
                            this.wsSendMessage('image', res.session_id)
                        } else {
                            this.$vux.toast.text('上传图片失败')
                        }
                    } else {
                        const url = res.config.url
                        const index = url.indexOf('=')
                        if (index > -1) {
                            const chatId = url.substring(index + 1, url.length)
                            this.chatDetailsList.some(item => {
                                if (Number(item.chat_id) === Number(chatId)) {
                                    item.sended = 'error'
                                    return true
                                }
                            })
                        }
                    }
                })
                .catch(error => {
                    const url = error.config.url
                    const index = url.indexOf('=')
                    if (index > -1) {
                        const chatId = url.substring(index + 1, url.length)
                        this.chatDetailsList.some(item => {
                            if (Number(item.chat_id) === Number(chatId)) {
                                item.sended = 'error'
                                return true
                            }
                        })
                    }
                })
        },
        // 发送链接消息
        sendLinkMessage(info) {
            const now = new Date().getTime()
            const sendMessage = {
                post: info.content,
                post_type: 'article',
                hreftext: info.href_text,
                href: info.href,
                isself: 1,
                user_avt: window.localStorage.getItem('userAvt'),
                user_name: window.localStorage.getItem('userName'),
                create_time: new Date().getTime() / 1000,
                sended: 'loading',
                chat_id: now
            }
            this.chatDetailsList.push(sendMessage)
            this.wsSendMessage('article', now, info)
        },
        // 选中图片后触发该方法
        uploadImage(imgUrl, formdata) {
            if (imgUrl) {
                this.chatImgUrl = imgUrl
                this.formdata = formdata
                this.showSendMessage = true
                this.sendMessageType = 'image'
            }
        },
        // 新消息通知
        popNotice(message) {
            if (this.Notification.permission === 'granted') {
                let notification = new Notification('您有一条新消息：', {
                    body: `${message.user_name}: ${message.post}`,
                    icon: message.user_avt,
                    sound: '',
                    vibrate: '200'
                })
                notification.onclick = () => {
                    // 仅能打开浏览器，而无法跳转到某个界面
                    window.location.href =
                        'https://new.portal.futurefertile.com/im_index'
                }
            }
        },
        // 点击通知跳转到对应页面
        checkNotify(message) {
            if (this.Notification) {
                if (this.Notification.permission === 'granted') {
                    this.popNotice(message)
                } else if (this.Notification.permission !== 'denied') {
                    this.Notification.requestPermission(() => {
                        thatpopNotice(message) // eslint-disable-line
                    })
                }
            } else {
                // 不支持
                alert(
                    '您的浏览器不支持桌面通知，请使用chrome谷歌浏览器打开。若仍不支持，您需要升级谷歌浏览器版本。'
                )
            }
        },
        getReplyTextList() {
            // str为搜索条件
            const data = {
                data: {
                    str: this.searchReplyText || '',
                    page: this.textCurrentPage,
                    count: this.textPageSize
                }
            }
            this.textLoaded = 'loading'
            this.$store.dispatch('getReplyTextList', data).then(res => {
                if (res.data.list) {
                    this.quickReplyList = [
                        ...this.quickReplyList,
                        ...res.data.list
                    ]
                } else {
                    this.quickReplyList = this.quickReplyList
                }
                if (
                    (res.data.list &&
                        res.data.list.length < this.textPageSize) ||
                    !res.data.list
                ) {
                    this.textLoaded = 'loaded'
                } else {
                    this.textLoaded = 'static'
                }
                this.textPageSize = (res.data.page && res.data.page.count) || 10
            })
        },
        getReplyLinkList(str) {
            const data = {
                data: {
                    str: str || '',
                    page: this.linkCurrentPage,
                    count: this.linkPageSize
                }
            }
            this.linkLoaded = 'loading'
            this.$store.dispatch('getReplyLinkList', data).then(res => {
                if (res.data.list) {
                    this.quickLinkList = [
                        ...this.quickLinkList,
                        ...res.data.list
                    ]
                } else {
                    this.quickLinkList = this.quickLinkList
                }
                if (
                    (res.data.list &&
                        res.data.list.length < this.linkPageSize) ||
                    !res.data.list
                ) {
                    this.linkLoaded = 'loaded'
                } else {
                    this.linkLoaded = 'static'
                }
                this.linkTotalNum = (res.data.page && res.data.page.total) || 1
                this.linkPageSize = (res.data.page && res.data.page.count) || 10
            })
        },
        // 查看语句回复列表下一页
        textNextPage() {
            if (this.textLoaded === 'loaded') {
                return
            }
            this.textCurrentPage++
            this.getReplyTextList()
        },
        // 查看链接回复列表下一页
        linkNextPage() {
            if (this.linkLoaded === 'loaded') {
                return
            }
            this.linkCurrentPage++
            this.getReplyLinkList()
        },
        // 点击快速回复语句列表
        checkTextSend(row) {
            this.chatText = row.content
            this.$refs.textPopover.showPopper = false
        },
        // 点击快速回复链接列表
        checkLinkSend(row) {
            this.$confirm('确认发送该条快捷回复链接吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.sendLinkMessage(row)
            })
        },
        // 跳转到患者详情
        jumpToDeatails() {
            this.$router.push(`/patient_list/patient_details?id=${this.currentMember.user_id}`)
        }
    },
    mounted() {
        const that = this
        if (this.ws) {
            this.ws.onmessage = Object.assign(
                this.wsOnMessage,
                this.ws.onmessage
            )
        }
        this.Notification =
            window.Notification ||
            window.mozNotification ||
            window.webkitNotification
        this.scrollEl = this.$refs.loadmore
        this.$refs.scrollList.onscroll = function() {
            // eslint-disable-line
            if (
                this.scrollTop === 0 &&
                !that.chatLoading &&
                !that.stopScroll
            ) {
                that.chatLoading = 'loading'
                that.chatPage++
                setTimeout(() => {
                    that.wsGetChatDetailsList()
                }, 1000)
            }
        }
        this.wsGetChatList()
        if (this.$route.query && this.$route.query.patientId) {
            this.wsCreateChat(this.$route.query.patientId)
        }
        this.getReplyTextList()
        this.getReplyLinkList()
    },
    beforeRouteEnter(to, from, next) {
        // fix: 从患者列表发起会话时，会传参数进来，但是此时刷新页面，参数依然存在。。
        if (!from.name) {
            to.query.patientId = null
        }
        next()
    },
    beforeRouteLeave(to, from, next) {
        if (to.name === 'patientList') {
            to.query.currentPage = Number(from.query.currentPage)
            to.query.currentPageSize = Number(from.query.currentPageSize)
        }
        next()
    }
}
</script>

<style lang="less">
.editor-next {
    padding: 10px 10px 0;
    text-align: center;
    cursor: pointer;
}
#customer-service {
    .el-table th.is-leaf {
        display: none;
        text-align: center;
    }
    .el-table__row {
        width: 100%;
    }
    .el-dialog__body {
        text-align: center;
        padding: 10px;
    }
    .bigimg-wrapper {
        .bigimg-title {
            font-size: 20px;
        }
        .bigimg-btn {
            padding: 10px 20px;
            margin: 0 10px;
        }
    }
    .show-big-img {
        img {
            width: 100%;
        }
    }
    .content-title {
        width: 100%;
        padding-bottom: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .chat-tab {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        li {
            width: 50%;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #f2f2f3;
            // margin-right: 4px;
            border-bottom: 1px solid #fff;
            cursor: pointer;
            &.active {
                background: @default-color;
                color: #fff;
            }
        }
    }
    .chat-wrapper {
        width: 100%;
        height: calc(100% - 50px);
        border: 1px solid #ccc;
        background: #f2f2f3;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        .chat-operation {
            width: 100px;
            height: 100%;
            background: #fff;
            border-right: 1px solid #ccc;
            li {
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #f2f2f3;
                position: relative;
                .unread-count {
                    position: absolute;
                    top: -4px;
                    right: 0;
                    display: block;
                    line-height: 20px;
                    width: 20px;
                    height: 20px;
                    border-radius: 100%;
                    background: red;
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
        .chat-list {
            width: 220px;
            height: 100%;
            background: #fff;
            border-right: 1px solid #ccc;
            .chat-list-wrapper {
                height: calc(100% - 36px);
                overflow-x: hidden;
                overflow-y: auto;
                &.patlist {
                    height: calc(100% - 72px);
                }
            }
            .member-search {
                border-bottom: 1px solid #ccc;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                padding: 0 4px;
                img {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                }
                input {
                    display: block;
                    width: 100%;
                    padding: 10px 6px;
                    border: none;
                }
            }
            .chat-done {
                font-size: 12px;
                line-height: 30px;
                text-align: center;
            }
            .chat-none {
                text-align: center;
                font-size: 12px;
                line-height: 30px;
            }
            .chat-item {
                padding: 10px 10px;
                border-bottom: 1px solid #ccc;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
                position: relative;
                .unread-num {
                    position: absolute;
                    top: 0px;
                    left: 42px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    background: red;
                    color: #fff;
                    border-radius: 100%;
                    font-size: 10px;
                }
                .post-info {
                    // flex: 1;
                    width: calc(100% - 50px);
                }
                .patient-info {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                    color: #666;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    > span {
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        &.post-value {
                            flex: 1;
                        }
                    }
                }
                img {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                }
                &.item-active {
                    background: #ccc;
                }
                &:not(.item-active) {
                    background: #fff;
                }
            }
        }
        .chat-response {
            width: calc(100% - 320px);
            height: 100%;
            .response-list {
                height: 70%;
                border-bottom: 1px solid #ccc;
                position: relative;
                .info-collapse {
                    padding: 20px 10px 0 10px;
                    font-size: 14px;
                    line-height: 30px;
                    > span {
                        margin-right: 25px;
                    }
                }
                .response-title {
                    background: #fff;
                    height: 36px;
                    line-height: 36px;
                    padding: 0 10px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
            }
            .response-content {
                height: 30%;
                background: #fff;
                position: relative;
                .upload-img {
                    position: relative;
                    height: 38px;
                    padding: 6px;
                    width: 100%;
                    border: 1px solid #ccc;
                    text-align: left;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    .upload {
                        opacity: 0;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 38px;
                        height: 100%;
                    }
                    .response-editor {
                        height: 100%;
                        img {
                            width: 38px;
                            height: 100%;
                            margin-left: 15px;
                            cursor: pointer;
                        }
                    }
                }
                .chat-img {
                    width: auto;
                    height: 100px;
                    margin: 10px;
                    border: 1px solid #f2f2f3;
                }
                textarea {
                    width: calc(100% - 30px);
                    height: 100px;
                    outline: none;
                    border: none;
                    padding: 10px;
                    resize: none;
                }
                button {
                    padding: 4px 20px;
                    position: absolute;
                    bottom: 8px;
                    right: 10px;
                    color: #fff;
                    border: 1px solid @default-color;
                    background: @default-color;
                }
                .start-chat {
                    font-size: 14px;
                    border-radius: 6px;
                    width: 300px;
                    height: 40px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .chat-details {
                position: absolute;
                top: 36px;
                left: 0;
                right: 0;
                height: calc(100% - 36px);
                overflow-y: auto;
                overflow-x: hidden;
                &.hidden {
                    overflow-y: hidden;
                }
                ul {
                    padding: 20px;
                    .none-chat {
                        display: inline-block;
                        padding: 10px;
                        text-align: center;
                        width: 100%;
                    }
                }
            }
            .chat-time {
                text-align: center;
                font-size: 12px;
                padding: 10px 0 0 0;
            }
            .chat-item {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
                margin-bottom: 15px;
                .chat-avator {
                    margin-right: 10px;
                    width: 38px;
                    height: 38px;
                    border-radius: 100%;
                }
                .im-content {
                    .im-user {
                        line-height: 1;
                    }
                    .im-text {
                        margin-top: 5px;
                        background: #fff;
                        border-radius: 4px;
                        padding: 10px;
                        width: 200px;
                        word-break: break-all;
                        position: relative;
                        .ctrl {
                            white-space: pre-wrap;
                        }
                        .post-img {
                            max-width: 180px;
                        }
                        .triangle {
                            position: absolute;
                            left: -5px;
                            top: 4px;
                            width: 0;
                            height: 0;
                            border-top: 5px solid transparent;
                            border-bottom: 5px solid transparent;
                            // border-left: 10px solid #fff;
                            border-right: 5px solid #fff;
                        }
                        @keyframes rotate {
                            0% {
                                transform: rotate(0);
                            }
                            100% {
                                transform: rotate(360deg);
                            }
                        }
                        .post-loading {
                            width: 20px;
                            height: 20px;
                            position: absolute;
                            right: -30px;
                            bottom: 50%;
                            transform: translateY(50%);
                            animation: rotate 1s linear infinite;
                        }
                        .post-error {
                            width: 20px;
                            height: 20px;
                            position: absolute;
                            right: -30px;
                            bottom: 50%;
                        }
                    }
                }
                &.self {
                    justify-content: flex-end;
                    .chat-avator {
                        margin-right: 0;
                    }
                    .im-content {
                        margin-right: 10px;
                        .im-user {
                            text-align: right;
                        }
                        .im-text {
                            .article-desc {
                                line-height: 1.2;
                                margin: 4px 0;
                            }
                            .triangle {
                                width: 0;
                                right: 0;
                                border-top: 5px solid transparent;
                                border-bottom: 5px solid transparent;
                                border-left: 5px solid #fff;
                                border-right: unset;
                                left: unset;
                                right: -5px;
                                transform: rotate(0deg);
                            }
                            .post-loading {
                                width: 20px;
                                height: 20px;
                                position: absolute;
                                left: -30px;
                                right: unset;
                                bottom: 50%;
                                transform: translateY(50%);
                            }
                            .post-error {
                                width: 20px;
                                height: 20px;
                                position: absolute;
                                left: -30px;
                                right: unset;
                                bottom: 50%;
                            }
                        }
                    }
                }
            }
        }
    }
    .el-collapse {
        position: relative;
        z-index: 100;
    }
    .el-collapse-item__header {
        background: #fff;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        font-weight: normal;
        padding: 0 10px;
        border-bottom: 1px solid #ccc;
    }
    .el-collapse-item__wrap {
        width: 100%;
    }
    .el-collapse-item__arrow {
        line-height: 36px;
    }
}
</style>
