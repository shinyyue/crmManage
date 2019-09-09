<template>
    <div id="login_page">
        <transition name="form-fade"
                    mode="in-out">
            <section class="form-contianer"
                     v-show="showLogin">
                <div class="manage_tip">
                    <h2 class="title">栏目管理平台</h2>
                </div>
                <div class="login-tab">
                    <span class="tab-item"
                          :class="{'active': loginType === 0}"
                          @click="changeLoginType('manager')">登录</span>
                </div>
                <el-form :model="loginForm"
                         :rules="rules"
                         ref="loginForm"
                         class="loginForm">
                    <el-form-item prop="username">
                        <span class="fa-tips">
                            <i class="fa fa-user"></i>
                        </span>
                        <el-input class="area"
                                  type="text"
                                  placeholder="用户名"
                                  v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <span class="fa-tips">
                            <i class="fa fa-lock"></i>
                        </span>
                        <el-input class="area"
                                  type="password"
                                  placeholder="密码"
                                  v-model="loginForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                                   @click="submitForm('loginForm')"
                                   class="submit_btn">登录</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </transition>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            showLogin: false,
            loginType: 0 
        }
    },
    methods: {
        ...mapActions(['getLoginIn']),
        changeLoginType(tag) {
            if (tag === 'manager') {
                this.$set(this, 'loginType', 0)
            } else {
                this.$set(this, 'loginType', 1)
            }
        },
        submitForm(loginForm) {
            this.$refs[loginForm].validate(valid => {
                if (valid) {
                    const data = {
                        password: this.loginForm.password,
                        snoOrJno: this.loginForm.username
                    }
                    this.getLoginIn(data).then(res => {
                        if (res.code === 200) {
                            localStorage.setItem('userId', res.data.vsMpUser.id)
                            localStorage.setItem(
                                'userName',
                                res.data.vsMpUser.userName
                            )
                            this.$router.push({
                                path: '/college/list'
                            })
                        } else {
                            this.$notify.error({
                                message: res.msg
                            })
                        }
                    })
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请输入正确的用户名密码',
                        offset: 100
                    })
                    return false
                }
            })
        }
    },
    mounted() {
        this.showLogin = true
    }
}
</script>

<style lang="less">
#login_page {
    position: relative;
    width: 100%;
    height: 100%;
    background: url('/static/img/body-bg-image.png') no-repeat center center;
    background-size: 100% 100%;
    min-width: 1140px;
    .loginForm {
        padding: 20px;
        border-radius: 3px;
        box-shadow: 5px 5px 10px #01144c;
        .fa-tips {
            position: absolute;
            top: 0px;
            left: 10px;
            z-index: 20;
            color: #ff7c1a;
            font-size: 18px;
        }
        .login-tips {
            font-size: 12px;
            color: #676a6c;
        }
    }
    .manage_tip {
        margin-bottom: 20px;
        .title {
            // font-family: cursive;
            font-weight: normal;
            font-size: 26px;
            color: #333;
        }
        .logo {
            width: 60px;
            height: 60px;
        }
    }
    .login-tab {
        text-align: left;
        padding-left: 20px;
        height: 30px;
        line-height: 30px;
        background: #fff;
        border-bottom: 2px solid transparent;
        .tab-item {
            display: inline-block;
            padding: 0 20px;
            text-align: center;
            margin-right: 20px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            &.active {
                background: #faf9f9;
                border-bottom: 2px solid #1ab293;
            }
        }
    }
    .form-contianer {
        width: 370px;
        background: rgba(255, 255, 255, 0.7);
        position: absolute;
        top: 20%;
        left: 34%;
        border-radius: 5px;
        text-align: center;
        .submit_btn.el-button {
            width: 100%;
            font-size: 16px;
            letter-spacing: 20px;
            background-color: #1ab394;
            border-color: #1ab394;
        }
    }
    .tiparea {
        text-align: left;
        font-size: 12px;
        color: #4cbb15;
        .tip {
            margin-left: 54px;
        }
    }

    .form-fade-enter-active,
    .form-fade-leave-active {
        transition: all 1s;
    }
    .form-fade-enter,
    .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }
    .loginForm {
        .el-button--primary {
            background-color: #ff7c1a;
            border: 1px solid #ff7c1a;
        }
    }
}
</style>
