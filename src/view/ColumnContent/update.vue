<template>
    <layout id="column_content_update">
        <div>添加栏目</div>
        <el-form ref="form"
                 :model="form"
                 label-width="120px">
            <el-form-item label="标题"
                          prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="内容"
                          prop="content">
                <el-input v-model="form.content"></el-input>
            </el-form-item>
            <el-form-item label="栏目内容类型"
                          prop="columnType">
                <el-select v-model="form.columnType"
                           placeholder="请选择栏目内容类型">
                    <el-option label="区域一"
                               value="shanghai"></el-option>
                    <el-option label="区域二"
                               value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传图片"
                          prop="columnType">
                <el-input v-model="form.columnType"></el-input>
            </el-form-item>
            <el-form-item label="文章"
                          prop="columnType">
                <el-input v-model="form.columnType"></el-input>
            </el-form-item>
            <el-form-item label="上传视频"
                          prop="columnType">
                <el-input v-model="form.columnType"></el-input>
            </el-form-item>
        </el-form>
    </layout>
</template>

<script>
export default {
    data() {
        return {
            form: {}
        }
    }
}
</script>

<style lang="less">
</style>