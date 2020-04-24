<template>
    <div class="home">
        <div class="container" v-on:mousemove="mousemoveFunc($event)">
            <!-- <template class="group" v-for="(groupItem, groupIndex) in menu">
                <div class="groupTitle" v-bind:key="groupIndex">{{groupItem.title}}</div>
                <block
                    v-bind:ref="`${item.id}`"
                    v-for="(item, index) in groupItem.list"
                    v-bind:blockId="item.id"
                    v-bind:key="`${groupIndex}-${index}`"
                    v-bind:col="item.col"
                    v-bind:row="item.row"
                    v-bind:size="item.size"
                    v-bind:groupIndex="groupIndex"
                    v-bind:content="item.content"
                    v-bind:narrow="!!activeBlockId && activeBlockId != item.id"
                    v-on:setActiveBlockId="setActiveBlockId"
                    v-on:setDragData="setDragData"
                    v-on:setDragEnable="setDragEnable"
                ></block>
            </template> -->
            <block
                v-for="(item, index) in blocks"
                v-bind:ref="`${item.id}`"
                v-bind:key="index"
                v-bind:col="item.col"
                v-bind:row="item.row"
                v-bind:size="item.size"
                v-bind:content="item.content"
                v-bind:blockId="item.id"
                v-on:setActiveBlockId="setActiveBlockId"
                v-on:setDragData="setDragData"
                v-on:setDragEnable="setDragEnable"
                v-on:setCol="setCol"
                v-on:setRow="setRow"
                v-on:moveOtherBlock="moveOtherBlock"
            ></block>
        </div>
        <!-- <button v-on:click="testFunc">测试按钮</button> -->
    </div>
</template>

<script>
import block from '@/components/block.vue'

export default {
    name: 'Home',
    data: function () {
        return {
            // blockList: [{
            //     col: 0,
            //     row: 0
            // }]
            // menu: [{
            //     title: '标题0',
            //     list: [{
            //         id: '0-0',
            //         col: 0,
            //         row: 0,
            //         size: 'mini',
            //         content: '0-0'
            //     }, {
            //         id: '0-1',
            //         col: 1,
            //         row: 0,
            //         size: 'mini',
            //         content: '0-1'
            //     }, {
            //         id: '0-2',
            //         col: 3,
            //         row: 0,
            //         size: 'small',
            //         content: '0-2'
            //     }]
            // }],
            blocks: [{
                id: '0',
                col: 0,
                row: 0,
                size: 'mini',
                content: '0'
            }, {
                id: '1',
                col: 1,
                row: 0,
                size: 'mini',
                content: '1'
            }, {
                id: '2',
                col: 2,
                row: 0,
                size: 'small',
                content: '2'
            }, {
                id: '3',
                col: 4,
                row: 0,
                size: 'mini',
                content: '3'
            }, {
                id: '4',
                col: 4,
                row: 1,
                size: 'small',
                content: '4'
            }, {
                id: '5',
                col: 3,
                row: 3,
                size: 'small',
                content: '5'
            }, {
                id: '6',
                col: 5,
                row: 3,
                size: 'small',
                content: '6'
            }],
            activeBlockId: null,
            dragData: {
                enable: false,
                // prevClientX: 0,
                // prevClientY: 0
                prevOffsetX: 0,
                prevOffsetY: 0
            }
        }
    },
    components: {
        block
    },
    methods: {
        testFunc: function () {
            // this.$refs.block.setCol(1)
        },
        setActiveBlockId: function (blockId) {
            this.activeBlockId = blockId
        },
        setDragEnable: function (enable) {
            this.dragData.enable = enable
        },
        setDragData: function (event) {
            // this.dragData.prevClientX = event.clientX
            // this.dragData.prevClientY = event.clientY
            this.dragData.prevOffsetX = event.offsetX
            this.dragData.prevOffsetY = event.offsetY
        },
        mousemoveFunc: function (event) {
            if (this.dragData.enable) {
                const block = this.$refs[this.activeBlockId][0]
                block.setPosition(event.clientX - this.dragData.prevOffsetX, event.clientY - this.dragData.prevOffsetY)
            }
        },
        setCol: function (obj) {
            const temp = this.blocks.find(item => item.id === obj.id)
            temp.col = obj.col
        },
        setRow: function (obj) {
            const temp = this.blocks.find(item => item.id === obj.id)
            temp.row = obj.row
        },
        moveOtherBlock: function () {}
    }
}
</script>
<style lang="stylus">
.home {
    height: 100%;
    .container {
        width: 800px;
        height: 800px;
        background-color: rgba(0, 0, 0, 0.1);
        position: relative;
    }
}
</style>
