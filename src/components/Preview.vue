<template>
    <!-- todo: visible.sync的意义 -->
    <el-dialog :visible="showPreview" class="preview" :center="true" :modal="true" @close="closeHandle" width="80%">
        <div slot="title">
            <slot name="title"></slot>
        </div>
        <img ref="img" class="preview-img" v-show="scale === 1" :src="imgUrl">
        <canvas ref="canvas" v-show="scale !== 1"></canvas>
        <div slot="footer">
            <div class="preview-operate">
                <img @click="showBig()" class="prwview-btn preview-big" src="/static/img/showbig.png">
                <img @click="showSmall()" class="prwview-btn preview-decrease" src="/static/img/showsmall.png">
            </div>
            <slot name="footer"></slot>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'preview',
    data() {
        return {
            scale: 1
        }
    },
    props: {
        imgUrl: '',
        showPreview: false,
        ratio: 0.3
    },
    methods: {
        closeHandle() {
            this.scale = 1
            this.$emit('previewCloseHandle')
        },
        showBig() {
            this.scale += 0.3
            this.canvasInit(this.$refs.img, this.scale)
        },
        showSmall() {
            this.scale -= 0.3
            this.canvasInit(this.$refs.img, this.scale)
        },
        canvasInit(originImg, ratio) {
            const canvas = this.$refs.canvas
            const context = canvas.getContext('2d')

            // 获取图片
            const img = new Image()
            img.src = this.imgUrl

            img.onload = () => {
                context.clearRect(0, 0, img.width, img.height)
                canvas.width = img.width * ratio
                canvas.height = canvas.width * (img.height / img.width)
                context.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
        }
    }
}
</script>

<style lang="less">
.el-dialog__body {
  max-height: 600px;
  overflow: auto;
}
.preview {
  .preview-operate {
    margin-bottom: 10px;
  }
  .prwview-btn {
    margin: 10px 10px 0;
  }
}
</style>
