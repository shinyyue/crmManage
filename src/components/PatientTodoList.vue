<template>
    <el-row class="patient-record">
        <!-- 历史记录列表 -->
        <el-col :span="12"
                :xs="24"
                :sm="12"
                class="record-list-wrapper">
            <tableList @handleSizeChange="handleSizeChange"
                       @handleCurrentChange="handleCurrentChange"
                       :loading="loading"
                       :tableData="todoList"
                       :totalNum="totalNum"
                       :colNameMap="colNameMap"
                       :currentPage="currentPage"
                       :pageSizes="[20]"
                       :pageSize="currentPageSize"
                       ref="allPatientTable"></tableList>
        </el-col>
        <!-- 日历 -->
        <el-col :span="12"
                :xs="24"
                :sm="12"
                class="calendar-wrapper">
            <calendar ref="canlendar"
                      :startdateone="startTime"
                      :enddateone="endTime"
                      :outeggtime="outEggTime"
                      :sepcialday="sepcial_days"></calendar>
        </el-col>
    </el-row>
</template>

<script>
import Calendar from './Calendar/body.vue'

export default {
    name: 'todolist',
    data() {
        return {
            todoList: [],
            currentPage: 1,
            currentPageSize: 20,
            totalNum: 0,
            demoEvents: [],
            startTime: '',
            endTime: '',
            outEggTime: '',
            sepcial_days: [],
            colNameMap: [{
                displayName: '待办事项名称',
                key: 'title',
                align: 'center',
                type: 'linnk'
            }, {
                displayName: '代办类型',
                key: 'content',
                align: 'center'
            }, {
                displayName: '路径',
                key: 'sendTime',
                align: 'center'
            }, {
                displayName: '提醒时间',
                key: 'sender',
                align: 'center'
            }, {
                displayName: '添加时间',
                key: 'sender',
                align: 'center'
            }],
            loading: false
        }
    },
    props: {
        tabType: '',
        pId: ''
    },
    methods: {
        handleSizeChange() { },
        handleCurrentChange() { },
        handleDayChange() {
        }
    },
    components: {
        [Calendar.name]: Calendar
    },
    mounted() {
        // const data = {
        //     data: {
        //         patient_id: this.pId,
        //         page: this.currentPage,
        //         count: this.currentPageSize
        //     }
        // }
        // this.$store.dispatch('getTodoList', data).then((res) => {
        //     console.log(111, res)
        //     this.todoList = res.data
        // })
    }
}
</script>

<style lang="less">
@media screen and (min-width: 768px) {
    .__vev_calendar-wrapper {
        // box-shadow: #ccc -7px -7px 4px;
        box-shadow: -4px -7px 5px #bdbdbd;
    }
    .__vev_calendar-wrapper .cal-wrapper {
        width: 100%;
        padding: 0px;
        border: 1px solid rgba(153, 153, 153, 0.4);
    }
}
.patient-record {
    .cal-wrapper {
        width: 100%;
        box-shadow: 2px 4px 5px #bdbdbd;
    }
    .events-wrapper {
        display: none;
    }
    .record-list-wrapper {
        padding: 0px 20px 20px 0;
        .record-collapse {
            margin: 20px 0;
        }
    }
    .calendar-wrapper {
        padding: 0 10px;
        border: 1px solid rgba(153, 153, 153, 0.5);
        box-shadow: rgba(153, 153, 153, 1) 0px 7px 15px;
    }
    .table-list .table-content {
        padding: 0;
    }
}
</style>
