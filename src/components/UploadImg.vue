<template>
    <div class="upload">
        <input @change="uploadimg"
               type="file"
               accept="image/*"
               class="upload-input" />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'upload',
    props: {
        isImgOrBase64: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        ...mapActions(['uploadImg']),
        uploadimg(e) {
            const files = e.target.files
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    // 图片压缩
                    const that = this
                    this.compressImage(files[i], 0.5, code => {
                        that.uploadImage(code, files[i].type)
                    })
                }
            }
        },
        compressImage(file, quality, callback) {
            // quality 设置为0.3
            const reader = new FileReader()
            reader.onload = function(event) {
                let result = event.target.result
                if (file.size > 204800 && file.type !== 'image/gif' && quality < 1) {
                    const img = new Image()
                    img.src = result
                    img.onload = function() {
                        // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                        // let initSize = img.src.length
                        let width = img.width
                        let height = img.height

                        let ratio
                        if ((ratio = width * height / 4000000) > 1) {
                            ratio = Math.sqrt(ratio)
                            width /= ratio
                            height /= ratio
                        } else {
                            ratio = 1
                        }
                        const canvas = document.createElement('canvas')
                        canvas.width = width
                        canvas.height = height
                        // 铺底色
                        const ctx = canvas.getContext('2d')
                        ctx.fillStyle = '#fff'
                        ctx.fillRect(0, 0, canvas.width, canvas.height)
                        // 如果图片像素大于100万则使用瓦片绘制
                        let count = 0
                        if ((count = width * height / 1000000) > 1) {
                            count = ~~(Math.sqrt(count) + 1)
                            // 计算要分成多少块瓦片
                            // 计算每块瓦片的宽和高
                            let nw = ~~(width / count)
                            let nh = ~~(height / count)
                            let tCanvas = document.createElement('canvas')
                            tCanvas.width = nw
                            tCanvas.height = nh
                            for (let i = 0; i < count; i++) {
                                for (let j = 0; j < count; j++) {
                                    let tctx = tCanvas.getContext('2d')
                                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)

                                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
                                }
                            }
                            tCanvas.width = tCanvas.height = 0
                        } else {
                            ctx.drawImage(img, 0, 0, width, height)
                        }
                        // 进行最小压缩
                        let ndata = canvas.toDataURL('image/jpeg', quality)
                        // console.log('压缩前：' + initSize)
                        // console.log('压缩后：' + ndata.length)
                        // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
                        canvas.width = canvas.height = 0
                        callback(ndata)
                    }
                } else {
                    // 小于200K不需要压缩 直接返回
                    callback(result)
                }
            }
            reader.readAsDataURL(file)
        },
        uploadImage(result, type) {
            let formdata = new FormData()
            // result为base64编码
            if (type === 'image/png') {
                formdata.append('upfile', this.createBlob(result), 'image.png')
            } else if (type === 'image/jpeg') {
                formdata.append('upfile', this.createBlob(result), 'image.jpeg')
            } else if (type === 'image/jpg') {
                formdata.append('upfile', this.createBlob(result), 'image.jpg')
            } else {
                this.$notify.error({
                    message: '仅支持上传jpg、jpeg、png格式的图片'
                })
                return
            }
            this.$emit('uploadImg', result, formdata)
            if (this.isImgOrBase64) {
                this.uploadImg(formdata)
                    .then(res => {
                        if (res.status === 0) {
                            this.$emit('uploadImg', res.data[0].url)
                        } else {
                            this.$notify.error({
                                message: '上传图片失败'
                            })
                            this.$emit('onerror', res)
                        }
                    })
                    .catch(() => {
                        this.$emit('onerror')
                    })
            }
        },
        createBlob(result) {
            const arr = result.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: mime })
        }
    }
}
</script>

<style lang="less">
.upload {
    cursor: pointer;
    .upload-input {
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>
