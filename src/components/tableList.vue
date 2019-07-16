<template>
    <div class="table-list">
        <div class="table-title"
             v-show="tableName">{{tableName}}</div>
        <div class="table-content">
            <el-table ref="tableTemplate"
                      highlight-current-row
                      :data="tableData"
                      v-loading="loading"
                      border
                      style="width: 100%;"
                      @row-click="rowClick"
                      @selection-change="handleSelectionChange">
                <!-- column:
                        key: 字段名
                        displayName: 表头信息
                        width：单元格的宽度
                        min-width: 单元格的最小宽度
                        align：该列的排列顺序
                        sortable： 该列的排序方式
                        className： 该列特有的className
                        type: 特殊列（链接、操作、按钮、自定义）/link, operate, image、customize
                            链接：link
                            操作：operation
                            图片：image
                            单选框：radio
                            自定义：slot
                            其他

                        text: type有值时，自定义单元格内容
                        ellipsis： 该列是否超出设定宽度后，省略显示
                -->
                <el-table-column :selectable="selectable"
                                 type="selection"
                                 v-if="column.type === 'selection'"
                                 v-for="(column, colIndex) in colNameMap"
                                 :key="`table_selection_${colIndex}`"
                                 :formatter="formatter"
                                 :label="column.displayName"
                                 :width="column.width"
                                 :min-width="column.minWidth"
                                 :align="column.align"
                                 :sortable="column.sortable"
                                 :class-name="column.className">
                </el-table-column>
                <el-table-column v-if="column.type !== 'selection'"
                                 v-for="(column, colIndex) in colNameMap"
                                 :key="`table_${colIndex}`"
                                 :formatter="formatter"
                                 :label="column.displayName"
                                 :width="column.width"
                                 :min-width="column.minWidth"
                                 :align="column.align"
                                 :sortable="column.sortable"
                                 :sort-orders="column.sortOrders"
                                 :sort-by="column.sortable ? column.key : ''"
                                 :class-name="column.className"
                                 :fixed="column.fixed || false">
                    <template slot-scope="props">
                        <div v-if="column.type === 'link'"
                             class="table-item-wrapper"
                             @click="cellClick(props)">
                            <!-- 一列固定文字的-->
                            <a href="javascript:void(0)"
                               v-if="column.text"
                               :class="{'content':column.ellipsis}"
                               :title="column.text">
                                {{column.text}}
                            </a>
                            <a :href="props.row[column.key]"
                               v-else
                               :class="{content:column.ellipsis}"
                               :title="props.row[column.key]">
                                {{props.row[column.key]}}
                            </a>
                            <a href="javascript:void(0)"></a>
                        </div>
                        <div v-else-if="column.type === 'operation'"
                             class="table-item-wrapper">
                            <el-button v-show="column.operations && column.operations.length > 0"
                                       v-for="(item, index) in column.operations"
                                       :key="index"
                                       size="small"
                                       type="text"
                                       @click="operateClick(props, item)">
                                {{item}}
                            </el-button>
                            <el-button v-show="!column.operations || column.operations.length === 0"
                                       type="text"
                                       @click="operateClick(props)">
                                {{props.row[column.key]}}
                            </el-button>
                        </div>
                        <img v-else-if="column.type === 'image'"
                             @click="operateImg(props)"
                             class="table-content-img"
                             :src="props.row[column.key]">
                        <input v-else-if="column.type === 'radio'"
                               type="radio"
                               :checked="props.row[column.key]" />
                        <div v-else
                             @click="cellClick(props)"
                             :class="{'content':column.ellipsis}">
                            {{props.row[column.key]}}
                        </div>
                    </template>
                </el-table-column>
                <!-- 自定义类型 -->
                <slot v-show="customize"
                      name="customize"></slot>
            </el-table>
        </div>
        <div class="total-num">总数：{{totalNum}}条</div>
        <div class="pagination"
             v-show="showPagination">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="pageValue"
                           :page-sizes="pageSizes"
                           :page-size="pageSize"
                           layout="sizes, prev, pager, next"
                           :total="totalNum"
                           ref="pagination">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tableList',
    props: {
        showPagination: {
            type: Boolean,
            default: true
        },
        loading: Boolean,
        tableName: String,
        totalNum: Number,
        tableData: {
            type: Array,
            default: () => []
        },
        colNameMap: {
            type: Array,
            default: () => []
        },
        pageSizes: {
            type: Array,
            default: () => [10, 25, 50, 100]
        },
        pageSize: {
            type: Number,
            default: 10
        },
        currentPage: {
            type: Number,
            default: 1
        },
        // 选择项方法
        selectable: {
            type: Function,
            default: (row, index) => {
                return true
            }
        },
        // 数据格式处理方法
        formatter: {
            type: Function,
            default: () => { }
        },
        // 是否自定义列
        customize: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pageValue: 1
        }
    },
    watch: {
        currentPage(val) {
            this.pageValue = val
        }
    },
    methods: {
        // 切换一页显示数量
        handleSizeChange(val) {
            this.$emit('handleSizeChange', val)
        },
        // 切换页码
        handleCurrentChange(val) {
            this.pageValue = val
            this.$emit('handleCurrentChange', val)
        },
        // 点击除去type === 'operation'的单元格
        cellClick(val) {
            this.$emit('cellClick', val)
        },
        // 点击type === 'operation'的单元格
        operateClick(props, operation) {
            this.$emit('operateClick', props, operation)
        },
        operateImg(props) {
            this.$emit('operateImg', props)
        },
        // 点击一行
        rowClick(row) {
            this.$emit('rowClick', row)
        },
        // 多选
        handleSelectionChange(list) {
            this.$emit('selectionChange', list)
        }
    }
}
</script>

<style lang="less">
.table-list {
    .table-title {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #f2f2f3;
        background: #fff;
        font-weight: bold;
        // background: #fff;
        margin-bottom: 20px;
        padding-left: 20px;
    }
    .table-content {
        background: #fff;
        padding: 15px;
    }
    .content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        td {
            display: block;
            color: #20a0ff;
        }
    }
    .total-num {
        background: #fff;
        padding: 0 10px 10px 10px;
        color: #333;
        font-size: 14px;
    }
    .pagination {
        background: #fff;
        padding: 10px 0;
    }
    .table-content-img {
        width: 100%;
        height: auto;
    }
    .cell {
        padding: 0;
        overflow: inherit;
        word-break: break-all;
    }
    .table-item-wrapper {
        width: 100%;
        overflow: inherit;
        word-break: break-all;
        .el-button {
            width: 100%;
            height: 100%;
            padding: 0;
            display: block;
            white-space: unset;
            > span {
                display: block;
                width: 100%;
                height: 100%;
                word-break: break-all;
            }
        }
    }
}
</style>
