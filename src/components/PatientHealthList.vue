<template>
    <div class="healthList">
        <el-row>
            <el-col :span="24">
                <el-button type="primary"
                           class="message-editor"
                           @click="healthEditor()"
                           v-show="!editHealth">编辑</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20"
                class="male-message">
            <el-col :spann="12"
                    :xs="24"
                    :sm="12"
                    class="male-line">
                <h5 class="male-title">女方基本信息</h5>
                <div class="message-list">
                    <div>
                        <span>姓名：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.name || '-'}}</span>
                        <el-input v-show="editHealth"
                                  class="male-name"
                                  placeholder="请填写"
                                  v-model="editPDetails.name"></el-input>
                    </div>
                    <div>
                        <span>手机号：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.phone || '-'}}</span>
                        <el-input v-show="editHealth"
                                  class="male-name"
                                  placeholder="请填写"
                                  v-model="editPDetails.phone"></el-input>
                    </div>
                    <div>
                        <span>出生日期：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.birth || '-'}}</span>
                        <el-date-picker v-show="editHealth"
                                        v-model="editPDetails.birth"
                                        :default-value="editPDetails.birth"
                                        type="date"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div>
                        <span>身高：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.height || '-'}}</span>
                        <el-input v-show="editHealth"
                                  class="male-name"
                                  placeholder="请填写"
                                  v-model="editPDetails.height"></el-input>
                        <label for="">cm</label>
                    </div>
                    <div>
                        <span>体重：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.weight || '-'}}</span>
                        <el-input class="male-name"
                                  placeholder="请填写"
                                  v-show="editHealth"
                                  v-model="editPDetails.weight"></el-input>
                        <label for="">kg</label>
                    </div>
                    <div>
                        <span>居住地：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.place_pro}} {{pDetails && pDetails.place_county}} {{pDetails && pDetails.place_city}}</span>

                    </div>
                    <div>
                        <span>详细地址：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.address || '-'}}</span>
                        <el-input class="male-name"
                                  placeholder="请填写"
                                  v-show="editHealth"
                                  v-model="editPDetails.address"></el-input>
                    </div>
                </div>
                <h5 class="male-title">女方健康信息</h5>
                <div class="message-list">
                    <div>
                        <span>备孕时长：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.yun_time || '-'}}</span>
                        <el-cascader :options="readyPregnentTime"
                                     v-show="editHealth"
                                     v-model="editPDetails.yun_time_new"></el-cascader>
                    </div>
                    <div>
                        <span>月经周期：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.period_cycle || '-'}}</span>
                        <el-select v-model="editPDetails.period_cycle"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in mensesList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>月经天数：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.period_day || '-'}}</span>
                        <el-select v-model="editPDetails.period_day"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in mensesDateList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>上次月经时间：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.last_period_time || '-'}}</span>
                        <el-date-picker v-model="editPDetails.last_period_time"
                                        type="date"
                                        placeholder="选择日期"
                                        v-show="editHealth">
                        </el-date-picker>
                    </div>
                    <div>
                        <span>现有子女数：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.children_num || '-'}}个</span>
                        <el-select v-model="editPDetails.children_num"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in childrenNumList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>过往怀孕次数：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.last_yun_num || '-'}}</span>
                        <el-select v-model="editPDetails.last_yun_num"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in lastPregnentNumList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>试管次数：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.tubebaby}}次</span>
                        <el-select v-model="editPDetails.tubebaby"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in pregnentNumList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>早产次数：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.pre_produce || '-'}}次</span>
                        <el-select v-model="editPDetails.pre_produce"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in pregnentNumList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>流产次数：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.fall_produce || '-'}}次</span>
                        <el-select v-model="editPDetails.fall_produce"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in pregnentNumList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>受孕方式：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.pregnant_type || '-'}}</span>
                        <el-select v-model="editPDetails.pregnant_type"
                                   v-show="editHealth">
                            <el-option v-for="(item, index) in pregnentTypeList"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>既往病史：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.medical_history || '-'}}</span>
                    </div>
                    <div>
                        <span>家族病史：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.family_history || '-'}}</span>
                        <el-checkbox-group v-model="editPDetails.family_history_new"
                                           v-show="editHealth">
                            <el-checkbox :label="item.option_id"
                                         v-for="item in familyDeseaseList"
                                         :key="item.option_id">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-col>
            <el-col :spann="12"
                    :xs="24"
                    :sm="12">
                <h5 class="male-title">男方基本信息</h5>
                <div class="message-list">
                    <div>
                        <span>姓名：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.man_name || '-'}}</span>
                        <el-input class="male-name"
                                  placeholder="请填写"
                                  v-show="editHealth"
                                  v-model="editPDetails.man_name"></el-input>
                    </div>
                    <div>
                        <span>手机号：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.man_phone || '-'}}</span>
                        <el-input class="male-name"
                                  placeholder="请填写"
                                  v-show="editHealth"
                                  v-model="editPDetails.man_phone"></el-input>
                    </div>
                    <div>
                        <span>出生日期：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.man_birth || '-'}}</span>
                        <el-date-picker v-model="editPDetails.man_birth"
                                        :default-value="editPDetails.man_birth"
                                        type="date"
                                        placeholder="选择日期"
                                        v-show="editHealth">
                        </el-date-picker>
                    </div>
                    <div>
                        <span>身高：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.man_height || '-'}}</span>
                        <el-input class="male-name"
                                  placeholder="请填写"
                                  v-show="editHealth"
                                  v-model="editPDetails.man_height"></el-input>
                        <label for="">cm</label>
                    </div>
                    <div>
                        <span>体重：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.man_weight || '-'}}</span>
                        <el-input class="male-name"
                                  placeholder="请填写"
                                  v-show="editHealth"
                                  v-model="editPDetails.man_weight"></el-input>
                        <label for="">kg</label>
                    </div>
                </div>
                <h5 class="male-title">男方健康信息</h5>
                <div class="message-list">
                    <div>
                        <span>男方既往病史：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.man_medical_history || '-'}}</span>
                    </div>
                    <div>
                        <span>男方家族病史：</span>
                        <span v-show="!editHealth">{{pDetails && pDetails.man_family_history || '-'}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="change-hospital">
            <el-col :span="24">
                <div class="message-list">
                    <span>转诊记录：</span>
                    <span></span>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="message-list">
                    <span>转诊时间：</span>
                    <span></span>
                </div>
            </el-col>
            <el-col :span="24"
                    class="save-message"
                    v-show="editHealth">
                <el-button type="primary"
                           @click="saveEdit()">保存</el-button>
                <el-button type="danger"
                           @click="cancleEdit()">取消</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'healthlist',
    props: {
        pId: '',
        pDetails: ''
    },
    data() {
        return {
            editPDetails: {},
            editHealth: false, // 健康档案显示（false）／编辑（true）
            familyDeseaseList: [],
            familyDeseaseIdList: [],
            pregnentTypeList: []
        }
    },
    watch: {
        pDetails(obj) {
            if (obj) {
                const birthTmp = Number(obj.birth)
                const manBirthTmp = Number(obj.man_birth)
                if (birthTmp) {
                    obj.birth = new Date(birthTmp * 1000).format('yyyy-MM-dd')
                    obj.man_birth = new Date(manBirthTmp * 1000).format('yyyy-MM-dd')
                }
                const index = obj.yun_time && obj.yun_time.indexOf('年')
                if (index > 0) {
                    obj.yun_time_new = [obj.yun_time.substring(0, index + 1), obj.yun_time.substring(index + 1, obj.yun_time.length)]
                } else {
                    obj.yun_time_new = obj.yun_time || []
                }

                obj.current_tags = obj.tag || []

                if (obj.family_history) {
                    obj.family_history_new = obj.family_history.split(',')
                    // const list = []
                    // obj.family_history_text = ''
                    // if (obj.family_history_new.length > 0) {
                    //     obj.family_history_new.forEach(item => {
                    //         item = Number(item)
                    //         const itemDetails = this.familyDeseaseList.find((fItem) => {
                    //             return fItem.option_id === item
                    //         })
                    //         if (itemDetails) {
                    //             obj.family_history_text += itemDetails.name + '、'
                    //             list.push(itemDetails)
                    //         }
                    //     })
                    //     obj.family_history_new = list
                    // }
                }
                this.editPDetails = Object.assign({}, obj)
            }
        }
    },
    computed: {
        childrenNumList() {
            const list = []
            for (let i = 0; i < 11; i++) {
                list.push(i)
            }
            return list
        },
        lastPregnentNumList() {
            const list = []
            for (let i = 0; i < 11; i++) {
                list.push(i + '次')
            }
            return list
        },
        pregnentNumList() {
            const list = []
            for (let i = 0; i < 11; i++) {
                list.push(i)
            }
            return list
        },
        readyPregnentTime() {
            let list = []
            for (let i = 0; i < 9; i++) {
                let children = []
                for (let j = 0; j < 13; j++) {
                    children.push({
                        value: j + '月',
                        label: j + '月'
                    })
                }
                list[i] = {
                    value: i + '年',
                    label: i + '年',
                    children: children
                }
            }
            return list
        },
        mensesList() {
            const list = []
            for (let i = 1; i < 46; i++) {
                list.push(i + '天')
            }
            list.push('不规律')
            return list
        },
        mensesDateList() {
            const list = []
            for (let i = 1; i < 15; i++) {
                list.push(i + '天')
            }
            list.push('不规律')
            return list
        }
    },
    methods: {
        // 点击编辑
        healthEditor() {
            this.editHealth = true
            this.editPDetails = Object.assign({}, this.pDetails)
        },
        // 点击取消编辑
        cancleEdit() {
            this.editHealth = false
        },
        // 保存编辑
        saveEdit() {
            this.editPDetails.birth = new Date(this.editPDetails.birth).getTime() / 1000
            this.editPDetails.man_birth = new Date(this.editPDetails.man_birth).getTime() / 1000
            this.editPDetails.yun_time = this.editPDetails.yun_time_new.join('')
            this.editPDetails.family_history = this.editPDetails.family_history_new.join(',')
            const data = {
                data: this.editPDetails
            }
            this.$store.dispatch('updatePatientInfo', data).then((res) => {
                if (res.status === 0) {
                    this.$notify({
                        message: '保存成功'
                    })
                    this.editHealth = false
                    this.$emit('saveSuccess')
                } else {
                    this.$notify.error({
                        message: '保存失败'
                    })
                }
            })
        },
        getFamilyDeseaseList() {
            const data = {
                data: {
                    type: 'family_history'
                }
            }
            this.$store.dispatch('getFamilyDeseaseList', data).then((res) => {
                if (res.status === 0) {
                    res.data.unshift({
                        name: '无',
                        option_id: -1
                    })
                    this.familyDeseaseList = res.data
                    this.familyDeseaseIdList = res.data.map((item) => {
                        return item.option_id.toString()
                    })
                }
            })
        }
    },
    mounted() {
        this.getFamilyDeseaseList()
    }
}
</script>

<style lang="less">
.healthList {
    .male-title {
    }
    .male-line {
        border-right: 1px solid #ccc;
    }
    .message-list {
        .male-name {
            max-width: 200px;
        }
        > div {
            padding: 6px 0;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            > span:first-child {
                display: inline-block;
                min-width: 100px;
                text-align: right;
            }
            > span:last-child {
                display: inline-block;
                flex: 1;
            }
        }
    }
}
</style>
