<template>
    <div class="home4" v-on:mouseup="pageMouseup" v-on:mousemove="pageMousemove($event)">
        <template v-if="ready">
            <div class="group" v-for="(groupItem, groupIndex) in menu" v-bind:key="groupIndex" v-bind:style="computeGroupStyle(groupItem)">
                <div class="panelHeader" v-bind:style="`height: ${headerHeight}px;`" v-on:mousedown.stop="groupMousedown(groupItem, $event)">
                    <input v-model="groupItem.groupName" v-on:mousedown.stop v-bind:style="computeInputStyle(groupItem)"/>
                </div>
                <div class="panelBody" v-bind:style="computePanelBodyStyle(groupItem)">
                    <div class="block" v-for="(item, index) in groupItem.blocks" v-bind:key="index" v-bind:style="computeBlockStyle(item)" v-on:click="selectBlock(groupItem, item)" v-on:mousedown.stop="blockMousedown(groupItem, item, $event)">
                        <span v-bind:style="`position: absolute; top: ${gap}px; right: ${gap}px; bottom: ${gap}px; left: ${gap}px; background-color: ${item.backgroundColor};`">{{item.id}}</span>
                    </div>
                </div>
            </div>
        </template>
        <div class="btns">
            <button v-on:click="moveFunc('top')">↑</button>
            <button v-on:click="moveFunc('right')">→</button>
            <button v-on:click="moveFunc('bottom')">↓</button>
            <button v-on:click="moveFunc('left')">←</button>
        </div>
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            transitionDuring: 0.2,
            ready: false,
            activeGroup: null,
            activeBlock: null,
            focusHeaderInput: false,
            menu: [{
                id: '0',
                blocks: [{
                    col: 0,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '0-0'
                }, {
                    col: 1,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '0-1'
                }, {
                    col: 2,
                    row: 0,
                    width: 2,
                    height: 2,
                    id: '0-2'
                }, {
                    col: 4,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '0-3'
                }, {
                    col: 4,
                    row: 1,
                    width: 2,
                    height: 2,
                    id: '0-4'
                }, {
                    col: 3,
                    row: 3,
                    width: 1,
                    height: 1,
                    id: '0-5'
                }, {
                    col: 1,
                    row: 3,
                    width: 2,
                    height: 2,
                    id: '0-6'
                }, {
                    col: 4,
                    row: 5,
                    width: 2,
                    height: 2,
                    id: '0-7'
                }, {
                    col: 6,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '0-8'
                }, {
                    col: 7,
                    row: 0,
                    width: 2,
                    height: 2,
                    id: '0-9'
                }, {
                    col: 10,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '0-10'
                }, {
                    col: 8,
                    row: 2,
                    width: 2,
                    height: 2,
                    id: '0-11'
                }]
            }, {
                id: '1',
                blocks: [{
                    col: 0,
                    row: 0,
                    width: 2,
                    height: 2,
                    id: '1-0'
                }, {
                    col: 3,
                    row: 1,
                    width: 1,
                    height: 1,
                    id: '1-1'
                }, {
                    col: 4,
                    row: 0,
                    width: 2,
                    height: 2,
                    id: '1-2'
                }, {
                    col: 0,
                    row: 2,
                    width: 2,
                    height: 2,
                    id: '1-3'
                }, {
                    col: 2,
                    row: 2,
                    width: 1,
                    height: 1,
                    id: '1-4'
                }, {
                    col: 2,
                    row: 3,
                    width: 1,
                    height: 1,
                    id: '1-5'
                }, {
                    col: 3,
                    row: 2,
                    width: 2,
                    height: 2,
                    id: '1-6'
                }, {
                    col: 0,
                    row: 4,
                    width: 4,
                    height: 2,
                    id: '1-7'
                }, {
                    col: 4,
                    row: 4,
                    width: 1,
                    height: 1,
                    id: '1-8'
                }]
            }, {
                id: '2',
                blocks: [{
                    col: 0,
                    row: 0,
                    width: 4,
                    height: 4,
                    id: '2-0'
                }, {
                    col: 4,
                    row: 1,
                    width: 1,
                    height: 1,
                    id: '2-1'
                }, {
                    col: 0,
                    row: 4,
                    width: 1,
                    height: 1,
                    id: '2-2'
                }, {
                    col: 1,
                    row: 4,
                    width: 2,
                    height: 2,
                    id: '2-3'
                }, {
                    col: 3,
                    row: 5,
                    width: 1,
                    height: 1,
                    id: '2-4'
                }, {
                    col: 4,
                    row: 3,
                    width: 2,
                    height: 2,
                    id: '2-4'
                }]
            }],
            unitSize: 40,
            headerHeight: 30,
            mouseData: {
                clientX: 0,
                clientY: 0,
                offsetX: 0,
                offsetY: 0,
                prevClientX: 0,
                prevClientY: 0,
                blockX: 0,
                blockY: 0
            },
            dragBlock: null,
            dragGroup: null,
            gap: 2,
            moveScale: 0.95,
            moveOpacity: 0.6
            // dragLine: {
            //     top: 0,
            //     right: 0,
            //     left: 0,
            //     bottom: 0
            // }
        }
    },
    methods: {
        computeInputStyle: function (groupItem) {
            // console.log(groupItem, this.activeGroup)
            return {
                lineHeight: `${this.headerHeight}px`
            }
            // focusHeaderInput
        },
        computeGroupRowsCount: function () {
            this.menu.forEach(groupItem => {
                let max = 1
                for (let i = 0; i < groupItem.blocks.length; i++) {
                    const temp = groupItem.blocks[i].row + groupItem.blocks[i].height
                    max = max < temp ? temp : max
                }
                groupItem.rowsCount = max
            })
        },
        computeGroupBlockColor: function () {
            this.menu.forEach(groupItem => {
                groupItem.blocks.forEach(block => {
                    block.backgroundColor = ['rgb(242, 80, 34)', 'rgb(127, 168, 0)', 'rgb(0, 164, 239)', 'rgb(255, 185, 0)'][parseInt(Math.random() * 4)]
                })
            })
        },
        computePanelBodyStyle: function (groupItem) {
            return {
                height: this.activeGroup === groupItem ? 0 : `${groupItem.rowsCount * this.unitSize}px`
            }
        },
        computeGroupStyle: function (groupItem) {
            let left = 0
            let top = 0
            let transition = ''
            let zIndex
            if (this.activeGroup === groupItem) {
                left = this.mouseData.clientX - this.mouseData.offsetX
                top = this.mouseData.clientY - this.mouseData.offsetY
                transition = 'none'
                zIndex = 1
            } else {
                left = 0
                zIndex = 0
                for (let i = 0; i < this.menu.length; i++) {
                    if (Number(this.menu[i].id) < Number(groupItem.id)) {
                        if (this.activeGroup === this.menu[i]) {
                            top = top + this.headerHeight
                        } else {
                            top = top + this.headerHeight + this.menu[i].rowsCount * this.unitSize
                        }
                    }
                }
                transition = `${this.transitionDuring}s`
            }
            groupItem.tempTop = top
            return {
                height: `${this.headerHeight}px`,
                top: `${top}px`,
                left: `${left}px`,
                transition,
                zIndex
            }
        },
        computeBlockStyle: function (block) {
            let left
            let top
            let transition
            let transform
            let opacity
            let zIndex
            if (this.activeBlock === block) {
                left = this.mouseData.blockX
                top = this.mouseData.blockY
                transition = 'none'
                transform = ''
                opacity = 1
                zIndex = 1
            } else {
                left = block.col * this.unitSize
                top = block.row * this.unitSize
                transition = `${this.transitionDuring}s`
                transform = `scale(${this.moveScale})`
                opacity = this.moveOpacity
            }
            if (!this.activeBlock) {
                transform = ''
                opacity = 1
            }
            return {
                width: `${block.width * this.unitSize}px`,
                height: `${block.height * this.unitSize}px`,
                left: `${left}px`,
                top: `${top}px`,
                // border: `1px solid ${this.dragBlock === block ? 'red' : 'black'}`,
                transition,
                transform,
                opacity,
                // backgroundColor: block.backgroundColor,
                lineHeight: `${block.height * this.unitSize}px`,
                fontSize: `${block.height * this.unitSize / 3}px`,
                padding: `${this.gap}px`,
                zIndex
            }
        },
        groupMousedown: function (groupItem, event) {
            this.activeGroup = groupItem
            this.mouseData.clientX = event.clientX
            this.mouseData.clientY = event.clientY
            // this.mouseData.prevClientX = event.clientX
            // this.mouseData.prevClientY = event.clientY
            this.mouseData.offsetX = event.offsetX
            this.mouseData.offsetY = event.offsetY
        },
        pageMouseup: function () {
            this.activeGroup = null
            this.activeBlock = null
            this.checkEmptyRow()
        },
        pageMousemove: function (event) {
            if (this.activeGroup) {
                this.mouseData.clientX = event.clientX
                this.mouseData.clientY = event.clientY
                this.computeGroupIndex()
            }
            if (this.activeBlock) {
                this.mouseData.blockX = this.mouseData.blockX + (event.clientX - this.mouseData.clientX)
                this.mouseData.blockY = this.mouseData.blockY + (event.clientY - this.mouseData.clientY)
                this.mouseData.clientX = event.clientX
                this.mouseData.clientY = event.clientY
                const newCol = Math.round(this.mouseData.blockX / this.unitSize)
                const newRow = Math.round(this.mouseData.blockY / this.unitSize)
                if (newCol > this.activeBlock.col) {
                    this.moveFunc('right')
                    this.computeGroupRowsCount()
                } else if (newCol < this.activeBlock.col) {
                    this.moveFunc('left')
                    this.computeGroupRowsCount()
                } else if (newRow > this.activeBlock.row) {
                    this.moveFunc('bottom')
                    this.computeGroupRowsCount()
                } else if (newRow < this.activeBlock.row) {
                    this.moveFunc('top')
                    this.computeGroupRowsCount()
                }
                // let newRow = Math.round(this.mouseData.blockY / this.unitSize)
            }
        },
        computeGroupIndex: function () {
            const topArr = this.menu.map(groupItem => groupItem.tempTop)
            this.menu.forEach(groupItem => {
                groupItem.id = topArr.filter(item => item < groupItem.tempTop).length.toString()
            })
        },
        linePush: function (group, direction = 'right', col, row, start, end, times = 0) {
            // console.log('计算推移', start, end)
            // direction
            const tempArr = []
            if (direction === 'right') {
                group.blocks.forEach(block => {
                    if (block.col === col) {
                        if ((block.row + block.height > start) && (block.row + block.height <= end)) {
                            tempArr.push(block)
                        } else if ((block.row >= start) && (block.row < end)) {
                            tempArr.push(block)
                        }
                    }
                })
            } else if (direction === 'bottom') {
                group.blocks.forEach(block => {
                    if (block.row === row) {
                        if ((block.col + block.width > start) && (block.col + block.width <= end)) {
                            tempArr.push(block)
                        } else if ((block.col >= start) && (block.col < end)) {
                            tempArr.push(block)
                        }
                    }
                })
            } else if (direction === 'left') {
                group.blocks.forEach(block => {
                    if (block.col + block.width === col) {
                        if ((block.row + block.height > start) && (block.row + block.height <= end)) {
                            tempArr.push(block)
                        } else if ((block.row >= start) && (block.row < end)) {
                            tempArr.push(block)
                        }
                    }
                })
            } else if (direction === 'top') {
                group.blocks.forEach(block => {
                    if (block.row + block.height === row) {
                        if ((block.col + block.width > start) && (block.col + block.width <= end)) {
                            tempArr.push(block)
                        } else if ((block.col >= start) && (block.col < end)) {
                            tempArr.push(block)
                        }
                    }
                })
            }
            // console.log(tempArr)
            if (tempArr.length) {
                if (this.checkBlockMoveEnable(direction, group, tempArr)) {
                    tempArr.forEach(item => {
                        switch (direction) {
                        case 'right':
                            item.col = item.col + 1
                            break
                        case 'bottom':
                            item.row = item.row + 1
                            break
                        case 'left':
                            item.col = item.col - 1
                            break
                        case 'top':
                            item.row = item.row - 1
                            break
                        }
                    })
                } else {
                    console.log('位置不足，自动计算位置')
                    /* eslint-disable */
                    let left = tempArr[0].col
                    let top = tempArr[0].row
                    let right = left + tempArr[0].width
                    let bottom = top + tempArr[0].height
                    tempArr.forEach(block => {
                        const tempLeft = block.col
                        const tempTop = block.row
                        const tempRight = tempLeft + block.width
                        const tempBottom = tempTop + block.height
                        if (tempLeft < left) {
                            left = tempLeft
                        }
                        if (tempTop < top) {
                            top = tempTop
                        }
                        if (tempRight > right) {
                            right = tempRight
                        }
                        if (tempBottom > bottom) {
                            bottom = tempBottom
                        }
                    })
                    switch (direction) {
                    case 'right':
                        tempArr.forEach(block => {
                            block.row = block.row + (end - top)
                        })
                        group.blocks.forEach(block => {
                            if (block.row >= end && tempArr.indexOf(block) < 0) {
                                block.row = block.row + (end - top)
                            }
                        })
                        break
                    case 'bottom':
                        group.blocks.forEach(block => {
                            if (block.row >= row) {
                                block.row = block.row + 1
                            }
                        })
                        break
                    case 'left':
                        tempArr.forEach(block => {
                            block.row = block.row + (end - top)
                        })
                        group.blocks.forEach(block => {
                            if (block.row >= end && tempArr.indexOf(block) < 0) {
                                block.row = block.row + (end - top)
                            }
                        })
                        break
                    // case 'top':
                    //     item.row = item.row - 1
                    //     break
                    }
                }
            }
        },
        // computeBoundary: function () {},
        checkBlockMoveEnable: function (direction, group, tempArr) {
            let left = tempArr[0].col
            let top = tempArr[0].row
            let right = left + tempArr[0].width
            let bottom = top + tempArr[0].height
            tempArr.forEach(block => {
                const tempLeft = block.col
                const tempTop = block.row
                const tempRight = tempLeft + block.width
                const tempBottom = tempTop + block.height
                if (tempLeft < left) {
                    left = tempLeft
                }
                if (tempTop < top) {
                    top = tempTop
                }
                if (tempRight > right) {
                    right = tempRight
                }
                if (tempBottom > bottom) {
                    bottom = tempBottom
                }
            })
            // console.log(top, right, bottom, left)
            switch (direction) {
            case 'right':
                for (let i = 0; i < group.blocks.length; i++) {
                    if (group.blocks[i].col === right) {
                        if ((group.blocks[i].row + group.blocks[i].height > top) && (group.blocks[i].row + group.blocks[i].height <= bottom)) {
                            return false
                        }
                        if ((group.blocks[i].row >= top) && (group.blocks[i].row < bottom)) {
                            return false
                        }
                    }
                }
                return true
            case 'bottom':
                for (let i = 0; i < group.blocks.length; i++) {
                    if (group.blocks[i].row === bottom) {
                        if ((group.blocks[i].col + group.blocks[i].width > left) && (group.blocks[i].col + group.blocks[i].width <= right)) {
                            return false
                        }
                        if ((group.blocks[i].col >= left) && (group.blocks[i].col < right)) {
                            return false
                        }
                    }
                }
                return true
            case 'left':
                for (let i = 0; i < group.blocks.length; i++) {
                    if (group.blocks[i].col + group.blocks[i].width === left) {
                        if ((group.blocks[i].row + group.blocks[i].height > top) && (group.blocks[i].row + group.blocks[i].height <= bottom)) {
                            return false
                        }
                        if ((group.blocks[i].row >= top) && (group.blocks[i].row < bottom)) {
                            return false
                        }
                    }
                }
                return true
            case 'top':
                for (let i = 0; i < group.blocks.length; i++) {
                    if (group.blocks[i].row + group.blocks[i].height === top) {
                        if ((group.blocks[i].col + group.blocks[i].width > left) && (group.blocks[i].col + group.blocks[i].width <= right)) {
                            return false
                        }
                        if ((group.blocks[i].col >= left) && (group.blocks[i].col < right)) {
                            return false
                        }
                    }
                }
                return true
            }
        },
        moveFunc: function (direction) {
            switch (direction) {
            case 'right':
                this.linePush(this.dragGroup, direction, this.dragBlock.col + this.dragBlock.width, undefined, this.dragBlock.row, this.dragBlock.row + this.dragBlock.height)
                this.linePush(this.dragGroup, direction, this.dragBlock.col, undefined, this.dragBlock.row, this.dragBlock.row + this.dragBlock.height)
                break
            case 'bottom':
                this.linePush(this.dragGroup, direction, undefined, this.dragBlock.row + this.dragBlock.height, this.dragBlock.col, this.dragBlock.col + this.dragBlock.width)
                this.linePush(this.dragGroup, direction, undefined, this.dragBlock.row, this.dragBlock.col, this.dragBlock.col + this.dragBlock.width)
                break
            case 'left':
                this.linePush(this.dragGroup, direction, this.dragBlock.col, undefined, this.dragBlock.row, this.dragBlock.row + this.dragBlock.height)
                this.linePush(this.dragGroup, direction, this.dragBlock.col + this.dragBlock.width, undefined, this.dragBlock.row, this.dragBlock.row + this.dragBlock.height)
                break
            case 'top':
                this.linePush(this.dragGroup, direction, undefined, this.dragBlock.row, this.dragBlock.col, this.dragBlock.col + this.dragBlock.width)
                this.linePush(this.dragGroup, direction, undefined, this.dragBlock.row + this.dragBlock.height, this.dragBlock.col, this.dragBlock.col + this.dragBlock.width)
                break
            }
            // this.linePush(this.dragGroup, 'right', 4, undefined, 0, 3)
            // this.linePush(this.dragGroup, 'bottom', undefined, 0, 8, 9)
        },
        selectBlock: function (groupItem, block) {
            // this.dragBlock = block
            // this.dragGroup = groupItem
        },
        blockMousedown: function (groupItem, block, event) {
            this.activeBlock = block
            this.dragBlock = block
            this.dragGroup = groupItem
            // this.mouseData.prevClientX = event.clientX
            // this.mouseData.prevClientY = event.clientY
            this.mouseData.clientX = event.clientX
            this.mouseData.clientY = event.clientY
            this.mouseData.offsetX = event.offsetX
            this.mouseData.offsetY = event.offsetY
            let sum = 0
            const temp = this.menu.filter(item => Number(item.id) < Number(groupItem.id))
            temp.forEach(item => {
                sum = sum + this.headerHeight + item.rowsCount * this.unitSize
            })
            sum = sum + this.headerHeight
            this.mouseData.blockY = event.clientY - sum - event.offsetY
            this.mouseData.blockX = block.col * this.unitSize
        },
        checkEmptyRow: function () {
            console.log('拖动结束之后，去除空余位置')
            // this.menu.forEach(groupItem => {
            //     let moveBlocks = []
            //     let lastCheckRow = [...groupItem.blocks].sort((x, y) => {
            //         return (y.row + y.height) - (x.row + x.height)
            //     })[0]
            //     // console.log('lastCheckRow', lastCheckRow)
            //     for (let i = 0; i < lastCheckRow.row - 1; i++) {
            //         let isEmpty = true
            //         groupItem.blocks.forEach((item, index) => {
            //             if (item.row === i) {
            //                 isEmpty = false
            //                 // moveBlocks.push(item)
            //             } else if (item.row + item.height < i && item.row >= i) {
            //                 isEmpty = false
            //                 // moveBlocks.push(item)
            //             }
            //         })
            //         if (isEmpty) {
            //             moveBlocks = [...moveBlocks, ...groupItem.blocks.filter(block => block.row >= i + 1)]
            //             // groupItem.blocks.filter(block => block.row >= i + 1).forEach(block => {
            //             //     block.row = block.row - 1
            //             // })
            //             // i = i - 1
            //             // groupItem.rowsCount = groupItem.rowsCount - 1
            //         }
            //     }
            //     moveBlocks.forEach(block => {
            //         block.row = block.row - 1
            //     })
            // })
        }
    },
    mounted: function () {
        this.computeGroupRowsCount()
        this.computeGroupBlockColor()
        setTimeout(() => {
            this.ready = true
        }, 100)
    }
}
</script>
<style lang="stylus" scoped>
.home4 {
    // width: 600px;
    // height: 800px;
    height: 100%;
    // background-color: rgba(0, 0, 0, 0.1);
    background-color: rgb(59, 59, 59);
    position: relative;
    .group {
        position: absolute;
        width: 100%;
        transition: 0.2s;
        user-select: none;
        width: 600px;
        .panelHeader {
            border: 1px solid;
            width: 100%;
            input {
                background-color: transparent;
                border: none;
                transition: 0.2s;
                &:focus {
                    background-color: rgba(255, 255, 255, 0.5);
                }
            }
        }
        .panelBody {
            border: 1px solid;
            width: 100%;
            position: relative;
            transition: 0.2s;
            overflow: hidden;
            .block {
                position: absolute;
                // border: 4px solid white;
                text-align: center;
                // transition: 0.2s;
            }
        }
    }
    .btns {
        position: fixed;
        right: 0;
        top: 0;
        display: grid;
        grid-template-columns: 30px 30px 30px;
        grid-template-rows: 30px 30px;
        button {
            width: 30px;
            height: 30px;
            &:nth-child(1) {
                grid-column-start: 2;
                grid-row-start: 1;
            }
            &:nth-child(2) {
                grid-column-start: 3;
                grid-row-start: 2;
            }
            &:nth-child(3) {
                grid-column-start: 2;
                grid-row-start: 2;
            }
            &:nth-child(4) {
                grid-column-start: 1;
                grid-row-start: 2;
            }
        }
    }
}
</style>
