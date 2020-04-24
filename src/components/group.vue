<template>
    <div class="group">
        <div class="header" v-bind:style="computeGroupHeaderStyle()">
            标题{{id}}
            <span class="dragBtn" v-bind:style="computeDragBtnStyle()" v-on:mousedown="setDragEnable(true)"></span>
        </div>
        <div class="body" v-bind:style="computeContainerStyle()">
            <div class="block" v-for="(item, index) in blocks" v-bind:key="index" v-bind:style="computeBlockStyle(item)"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        id: {
            type: [String, Number],
            default: function () {
                return ''
            }
        },
        blocks: {
            type: [Array],
            default: function () {
                return []
            }
        },
        panelHeaderHeight: {
            type: [Number],
            default: function () {
                return 30
            }
        },
        blockUnitSize: {
            type: [Number],
            default: function () {
                return 50
            }
        }
    },
    data: function () {
        return {
            msg: 'group',
            dragEnable: false
            // rowCount: 0
        }
    },
    methods: {
        computeDragBtnStyle: function () {
            return {
                width: `${this.panelHeaderHeight}px`,
                height: `${this.panelHeaderHeight}px`
            }
        },
        computeGroupHeaderStyle: function () {
            return {
                width: '100%',
                height: `${this.panelHeaderHeight}px`
            }
        },
        computeContainerStyle: function () {
            return {
                height: this.dragEnable ? 0 : `${this.rowCount * this.blockUnitSize}px`,
                border: '1px solid red'
            }
        },
        setRowCount: function (val) {},
        computeBlockStyle: function (block) {
            return {
                width: `${block.width * this.blockUnitSize}px`,
                height: `${block.height * this.blockUnitSize}px`,
                left: `${block.col * this.blockUnitSize}px`,
                top: `${block.row * this.blockUnitSize}px`
            }
        },
        setDragEnable: function (dragEnable) {
            this.dragEnable = dragEnable
        }
    },
    computed: {
        rowCount: function () {
            let max = 1
            for (let i = 0; i < this.blocks.length; i++) {
                const temp = this.blocks[i].row + this.blocks[i].height
                max = max < temp ? temp : max
            }
            return max
        }
    }
}
</script>
<style lang="stylus" scoped>
.group {
    // position: absolute;
    width: 100%;
    position: relative;
    .header {
        // position: absolute;
        border: 1px solid;
        .dragBtn {
            right: 0;
            top: 0;
            position: absolute;
            background-color: red;
        }
    }
    .body {
        border: 1px solid;
        position: relative;
        transition: 0.2s;
        .block {
            position: absolute;
            border: 1px solid;
        }
    }
}
</style>
