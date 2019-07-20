<template>
    <div class="navbar">
        <el-menu :default-active="currentRoute"
                 background-color="#545c64"
                 text-color="#a7b1c2"
                 active-text-color="#1ab394"
                 :router="true"
                 :unique-opened="false"
                 :collapse-transition="false">
            <el-menu-item index="/college/list"
                          class="submenu-item"
                          :class="{'active': currentRoute === '/college/list'}">
                <i class="el-icon-home"></i>
                <span class="menu-text">学院列表</span>
            </el-menu-item>
            <el-menu-item index="/column/list"
                          class="submenu-item"
                          :class="{'active': currentRoute === '/column/list'}">
                <i class="el-icon-home"></i>
                <span class="menu-text">学校栏目列表</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'navbar',
    props: {
        collapse: Boolean
    },
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['menusList']),
        currentRoute() {
            return '/' + this.$router.currentRoute.path.replace(/\//, '')
        },
        menus() {
            console.log(33333, this.$store.state.homeStore.menusList)
            return this.$store.state.homeStore.menusList
        }
    },
    methods: {
        ...mapActions(['getMenus'])
    },
    mounted() {
        this.getMenus()
    }
}
</script>

<style lang="less">
.navbar {
    width: 220px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .el-menu-item.is-active {
        color: #1ab394;
        font-weight: bold;
    }
    .el-menu-item.active {
        color: #1ab394;
    }
    .el-menu-item-group__title {
        padding: 0;
    }
    .el-menu--vertical {
        .el-menu-item-group__title {
            padding: 0;
        }
    }
    i {
        display: inline-block;
        margin-right: 5px;
        width: 20px;
        height: 16px;
        text-align: center;
        font-size: 18px;
        vertical-align: middle;
        color: #909399;
    }
    .submenu-item {
        .menu-text {
            font-weight: bold;
            font-size: 16px;
            color: #a7b1c2;
        }
        .el-icon-home {
            background: url('../../../static/img/home.svg') no-repeat;
            background-size: 100% 100%;
        }
        .el-icon-im {
            background: url('../../../static/img/cs.svg') no-repeat;
            background-size: 100% 100%;
        }
        .el-icon-patient {
            background: url('../../../static/img/patient-list.svg') no-repeat;
            background-size: 100% 100%;
        }
        &.active {
            .menu-text {
                font-weight: bold;
                font-size: 16px;
                color: #1ab394;
            }
            .el-icon-home {
                background: url('../../../static/img/home-active.svg') no-repeat;
                background-size: 100% 100%;
            }
            .el-icon-im {
                background: url('../../../static/img/cs-active.svg') no-repeat;
                background-size: 100% 100%;
            }
            .el-icon-patient {
                background: url('../../../static/img/patient-list-active.svg')
                    no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
</style>
