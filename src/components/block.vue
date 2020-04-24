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
        content: {
            type: [String],
            default: function () {
                return ''
            }
        }
    },
    data: function () {
        return {
            x: 0,
            y: 0
        }
    },
    methods: {
        // setPosition: function () {},
        // setCol: function (col) {
        //     this.col = col
        // },
        // setRow: function (row) {
        //     this.row = row
        // },
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
            // if (this.narrow) {
            //     style.transform = `scale(${0.9})`
            //     style.opacity = 0.75
            // }
            // if ((this.$parent.activeBlockId === this.blockId) && this.blockId) {
            //     // console.log(123123)
            //     // this.x = this.col * this.unitSize
            //     // this.y = (this.row + this.groupIndex + 1) * this.unitSize
            //     style.left = `${this.x}px`
            //     style.top = `${this.y}px`
            //     // style.transition = 'none'
            // } else {
            //     style.left = `${this.col * this.unitSize}px`
            //     style.top = `${(this.row + this.groupIndex + 1) * this.unitSize}px`
            //     // const transitionTime = 0.3
            //     // style.transition = `transform ${transitionTime}s, top ${transitionTime}s, left ${transitionTime}s`
            // }
            // style.transition = this.transitionEnable ? `all ${this.transitionDuring}s` : 'none'
            if ((this.$parent.activeBlockId === this.blockId) && this.blockId) {
                style.left = `${this.x}px`
                style.top = `${this.y}px`
                style.transition = 'none'
            } else {
                style.left = `${this.col * this.unitSize}px`
                style.top = `${(this.row) * this.unitSize}px`
                const transitionTime = 0.3
                style.transition = `transform ${transitionTime}s, top ${transitionTime}s, left ${transitionTime}s`
            }
            return style
        },
        mousedownFunc: function (event) {
            this.$emit('setActiveBlockId', this.blockId)
            this.$emit('setDragEnable', true)
            this.$emit('setDragData', event)
            this.x = this.col * this.unitSize
            this.y = this.row * this.unitSize
            // this.transitionEnable = false
        },
        mouseupFunc: function () {
            this.$emit('setActiveBlockId', null)
            this.$emit('setDragEnable', false)
            this.transitionEnable = true
        },
        setPosition: function (x, y) {
            this.x = x
            this.y = y
            // this.compute
        },
        computeCol: function () {
            const col = Math.round(this.x / this.unitSize)
            if (col !== this.col) {
                this.$emit('setCol', {
                    id: this.blockId,
                    col
                })
                // if (col > this.col) {
                //     const moveLine = {
                //         rowStart: this.row,
                //         rowEnd: this.row + ({
                //             mini: 1,
                //             small: 2,
                //             medium: 2,
                //             large: 4
                //         })[this.size],
                //         col: this.col + ({
                //             mini: 1,
                //             small: 2,
                //             medium: 4,
                //             large: 4
                //         })[this.size]
                //     }
                //     this.$emit('moveOtherBlock', moveLine)
                // }
            }
        },
        computeRow: function () {
            const row = Math.round(this.y / this.unitSize)
            if (row !== this.row) {
                this.$emit('setRow', {
                    id: this.blockId,
                    row
                })
            }
        }
    },
    watch: {
        x: function (newVal) {
            this.computeCol()
        },
        y: function (newVal) {
            this.computeRow()
        }
    }
}
</script>
<style lang="stylus" scoped>
.block {
    border: 1px solid red;
    position: absolute;
    text-align: center;
    user-select: none;
}
</style>
