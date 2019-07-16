<template>
    <div class="layout">
        <el-row class="main-wrapper">
            <el-col class="main-left">
                <Navbar :collapse="isCollapse"></Navbar>
            </el-col>
            <el-col class="main-right">
                <div class="main-right-top">
                    <span>管理平台</span>
                    <div class="right-top">
                        <span> 欢迎你, {{userName}}</span>
                        <div class="right-top"
                             @click="loginOut()">
                            <img class="right-logout"
                                 src="/static/img/logout.svg" />
                            <span>退出</span>
                        </div>
                    </div>
                </div>
                <el-main class="main-right-wrapper">
                    <slot>
                        <router-view />
                    </slot>
                </el-main>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Navbar from '../components/Navbar'
import 'element-ui/lib/theme-chalk/display.css'

export default {
    name: 'layout',
    props: {
        pageTitle: ''
    },
    components: {
        Navbar
    },
    data() {
        return {
            isCollapse: false,
            docWidth: document.body.clientWidth
        }
    },
    computed: {
        userName() {
            return window.localStorage.getItem('userName')
        }
    },
    watch: {
        docWidth(val) {
            if (val <= 768) {
                this.isCollapse = true
            } else {
                this.isCollapse = false
            }
            return val
        }
    },
    methods: {
        loginOut() {
            this.$store.dispatch('manuallyLoginOut')
            this.$router.push({
                path: '/login',
                query: {
                    redirect: this.$route.path
                }
            })
        }
    },
    mounted() {
        const that = this
        if (this.docWidth <= 768) {
            this.isCollapse = true
        } else {
            this.isCollapse = false
        }
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                that.docWidth = window.screenWidth
            })()
        }
    }
}
</script>

<style lang="less">
.layout {
    height: 100%;
    height: 100%;
    .main-wrapper {
        height: 100%;
        .main-left {
            width: 220px;
            height: 100%;
            background: rgb(84, 92, 100);
            .el-menu {
                height: 100%;
            }
        }
        .main-right {
            // calc属性的兼容问题对chrome和safri较友好。
            width: calc(100% - 220px);
            height: 100%;
            position: relative;
            .main-right-top {
                height: 50px;
                line-height: 50px;
                background: #fff;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                .right-top {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    .right-logout {
                        width: 30px;
                        height: 30px;
                        padding: 5px;
                        margin-left: 30px;
                    }
                }
            }
            .main-right-wrapper {
                height: calc(100% - 50px);
                background: #f2f2f2;
                overflow: auto;
                .page-title {
                    padding: 10px 0 10px 10px;
                    background: #fff;
                    font-weight: bold;
                    border-bottom: 1px solid #f2f2f3;
                }
            }
        }
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 220px;
            min-height: 400px;
        }
    }
    @media screen and (max-width: 768px) {
        .main-wrapper {
            .main-left {
                width: 64px;
            }
            .main-right {
                width: calc(100% - 64px);
            }
        }
    }
}
</style>
