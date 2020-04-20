<template>
    <div class="block" v-bind:style="computeStyle()" v-on:mousedown="mousedownFunc($event)" v-on:mouseup="mouseupFunc">
        {{content}}
    </div>
</template>
<script>
export default {
    props: {
        blockId: {
            type: [String],
            default: function () {
                return ''
            }
        },
        col: {
            type: [Number],
            default: function () {
                return 0
            }
        },
        row: {
            type: [Number],
            default: function () {
                return 0
            }
        },
        size: {
            type: [String],
            // mini 1 x 1 大小
            // small 2 x 2 大小
            // medium 4 x 2 大小
            // large 4 x 2 大小
            default: function () {
                return 'small'
            }
        },
        unitSize: {
            type: [Number],
            default: function () {
                return 100
            }
        },
        groupIndex: {
            type: [Number],
            default: function () {
                return 0
            }
        },
        content: {
            type: [Number, String],
            default: function () {
                return ''
            }
        },
        // 是否缩小
        narrow: {
            type: [Boolean],
            default: function () {
                return false
            }
        }
    },
    data: function () {
        return {
            // enable: true,
            mousedownEnable: false,
            x: 0,
            y: 0,
            transitionDuring: 0.3,
            transitionEnable: true
        }
    },
    methods: {
        // setPosition: function () {},
        setCol: function (col) {
            this.col = col
        },
        setRow: function (row) {
            this.row = row
        },
        // setEnable: function (enable) {
        //     this.enable = enable
        // },
        computeStyle: function () {
            const style = {}
            switch (this.size) {
            case 'mini':
                style.width = `${this.unitSize * 1}px`
                style.height = `${this.unitSize * 1}px`
                style.lineHeight = `${this.unitSize * 1}px`
                style.fontSize = `${this.unitSize * 1 / 2}px`
                break
            case 'small':
                style.width = `${this.unitSize * 2}px`
                style.height = `${this.unitSize * 2}px`
                style.lineHeight = `${this.unitSize * 2}px`
                style.fontSize = `${this.unitSize * 2 / 2}px`
                break
            case 'medium':
                style.width = `${this.unitSize * 4}px`
                style.height = `${this.unitSize * 2}px`
                style.lineHeight = `${this.unitSize * 2}px`
                style.fontSize = `${this.unitSize * 2 / 2}px`
                break
            case 'large':
                style.width = `${this.unitSize * 4}px`
                style.height = `${this.unitSize * 4}px`
                style.lineHeight = `${this.unitSize * 4}px`
                style.fontSize = `${this.unitSize * 4 / 2}px`
                break
            default:
                style.width = `${this.unitSize * 2}px`
                style.height = `${this.unitSize * 2}px`
                style.lineHeight = `${this.unitSize * 2}px`
                style.fontSize = `${this.unitSize * 2 / 2}px`
            }
            if (this.narrow) {
                style.transform = `scale(${0.9})`
                style.opacity = 0.75
            }
            if ((this.$parent.activeBlockId === this.blockId) && this.blockId) {
                // console.log(123123)
                // this.x = this.col * this.unitSize
                // this.y = (this.row + this.groupIndex + 1) * this.unitSize
                style.left = `${this.x}px`
                style.top = `${this.y}px`
                // style.transition = 'none'
            } else {
                style.left = `${this.col * this.unitSize}px`
                style.top = `${(this.row + this.groupIndex + 1) * this.unitSize}px`
                // const transitionTime = 0.3
                // style.transition = `transform ${transitionTime}s, top ${transitionTime}s, left ${transitionTime}s`
            }
            style.transition = this.transitionEnable ? `all ${this.transitionDuring}s` : 'none'
            return style
        },
        mousedownFunc: function (event) {
            this.$emit('setActiveBlockId', this.blockId)
            this.$emit('setDragEnable', true)
            this.$emit('setDragData', event)
            this.x = this.col * this.unitSize
            this.y = (this.row + this.groupIndex + 1) * this.unitSize
            this.transitionEnable = false
        },
        mouseupFunc: function () {
            this.$emit('setActiveBlockId', null)
            this.$emit('setDragEnable', false)
            this.transitionEnable = true
        },
        setPosition: function (x, y) {
            this.x = x
            this.y = y
        }
    }
}
</script>
<style lang="stylus" scoped>
.block {
    border: 1px solid red;
    position: absolute;
    text-align: center;
}
</style>
