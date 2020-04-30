<template>
    <div class="home6" v-on:mousemove="pageMousemove($event)" v-on:mouseup="pageMouseup($event)" v-on:contextmenu.prevent="pageCοntextmenu($event)" v-on:mousedown.stop="isShowcustomMenu = false">
        <button class="testBtn" v-on:mouseup.stop="testFunc">测试</button>
        <template v-for="sectionItem in menuData.sectionList">
            <template v-for="groupItem in sectionItem.groupList">
                <div class="groupItem" v-bind:key="groupItem.id" v-bind:style="computeGroupItemStyle(groupItem)" v-on:mousedown="groupItemMousedown($event, sectionItem, groupItem)" v-on:mouseup.stop="groupItemMouseup($event, sectionItem, groupItem)">{{groupItem.id}}</div>
                <div class="blockItem" v-for="blockItem in groupItem.blockList" v-bind:key="blockItem.id" v-bind:style="computeBlockItemStyle(blockItem)" v-on:mousedown="blockItemMousedown($event, sectionItem, groupItem, blockItem)" v-on:contextmenu.prevent="blockCοntextmenu($event, sectionItem, groupItem, blockItem)">{{blockItem.id}}</div>
            </template>
        </template>
        <div class="viewLine" ref="viewLine"></div>
        <div class="customMenu" ref="customMenu" v-show="isShowcustomMenu">
            <div class="firstMenuItem">
                <label>调整尺寸</label>
                <div class="secondMenu">
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockSize(0)">小（1 * 1）</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockSize(1)">中（1 * 2）</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockSize(2)">大（2 * 2）</div>
                </div>
            </div>
            <div class="firstMenuItem">
                <label>调整颜色</label>
                <div class="secondMenu colors">
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">蓝色</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">绿色</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">橙色</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">浅灰</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">红色</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">黄色</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">紫色</div>
                    <div class="secondMenuItem" v-on:mousedown.stop="setBlockColor">深灰</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import menuData from '@/assets/menuData'
menuData.sectionList.forEach((sectionItem, sectionIndex) => {
    sectionItem.id = `${sectionIndex}`
    sectionItem.style = {}
    sectionItem.groupList.forEach((groupItem, groupIndex) => {
        groupItem.id = `${sectionIndex}-${groupIndex}`
        groupItem.style = {}
        groupItem.blockList.forEach((blockItem, blockIndex) => {
            blockItem.id = `${sectionIndex}-${groupIndex}-${blockIndex}`
            blockItem.style = {}
        })
    })
})
export default {
    data: function () {
        return {
            ready: false,
            // menuData,
            menuData: {},
            sectionGap: 20,
            sectionSize: 12,
            groupGap: 20,
            groupItemHeight: 30,
            blockUnitSize: 50,
            blockGap: 5,
            activeType: null,
            activeSectionItem: null,
            activeGroupItem: null,
            activeBlockItem: null,
            transitionDuring: 0.2,
            moveScale: 0.95,
            moveOpacity: 0.7,
            dragData: {
                enable: false,
                groupPrevLeft: 0,
                groupPrevTop: 0,
                prevClientX: 0,
                prevClientY: 0
            },
            isShowcustomMenu: false
        }
    },
    methods: {
        testFunc: function () {
            // console.log(this.menuData)
            // this.moveLine(this.menuData.sectionList[0].groupList[0], 'right', 3, undefined, 3, 4)
            // this.moveLine(this.menuData.sectionList[0].groupList[0], 'right', 4, undefined, 0, 2)
            // this.moveLine(this.menuData.sectionList[0].groupList[0], 'right', 6, undefined, 0, 2)
            // this.moveLine(this.menuData.sectionList[0].groupList[0], 'right', 10, undefined, 0, 2)
            // setTimeout(() => {
            //     this.moveLine(this.menuData.sectionList[0].groupList[0], 'right', 11, undefined, 0, 2)
            // }, 1000)
            // this.moveLine(this.menuData.sectionList[0].groupList[0], 'bottom', undefined, 3, 3, 4)
            // this.menuData.sectionList[0].groupList.splice(1, 1)
            console.log('computeBlockBelong', this.menuData.sectionList)
        },
        computeGroupItemStyle: function (groupItem) {
            return {
                left: `${groupItem.style.left}px`,
                top: `${groupItem.style.top}px`,
                width: `${groupItem.style.width}px`,
                height: `${groupItem.style.height}px`,
                transition: groupItem.style.transition,
                zIndex: groupItem.style.zIndex,
                backgroundColor: groupItem.style.backgroundColor
            }
        },
        computeBlockItemStyle: function (blockItem) {
            return {
                left: `${blockItem.style.left}px`,
                top: `${blockItem.style.top}px`,
                width: `${blockItem.style.width}px`,
                height: `${blockItem.style.height}px`,
                opacity: blockItem.style.opacity,
                transition: blockItem.style.transition,
                zIndex: blockItem.style.zIndex,
                transform: `scale(${(this.activeBlockItem && this.activeType === 'blockItem') ? (this.activeBlockItem === blockItem ? 1 : this.moveScale) : 1})`,
                backgroundColor: blockItem.style.backgroundColor
            }
        },
        initData: function () {
            if (menuData.mode === 'horizontal') {
                menuData.sectionList.forEach(sectionItem => {
                    const sectionTempList = menuData.sectionList.filter(item => item.sectionIndex < sectionItem.sectionIndex)
                    sectionItem.style.left = sectionTempList.length * (this.sectionSize * this.blockUnitSize + this.sectionGap)
                    sectionItem.groupList.forEach(groupItem => {
                        groupItem.style.left = sectionItem.style.left
                        const groupTempList = sectionItem.groupList.filter(item => item.groupIndex < groupItem.groupIndex)
                        let top = 0
                        groupTempList.forEach(group => {
                            let max = group.blockList[0].row + group.blockList[0].height
                            group.blockList.forEach(block => {
                                if (block.row + block.height > max) {
                                    max = block.row + block.height
                                }
                            })
                            top = top + this.groupItemHeight + max * this.blockUnitSize + this.groupGap
                        })
                        groupItem.style.top = top
                        groupItem.style.width = this.blockUnitSize * this.sectionSize
                        groupItem.style.height = this.groupItemHeight
                        groupItem.style.transition = `${this.transitionDuring}s`
                        groupItem.style.zIndex = 0
                        groupItem.style.backgroundColor = `#${parseInt(Math.random() * 256 * 256 * 256).toString(16)}`
                        groupItem.blockList.forEach(blockItem => {
                            blockItem.style.left = blockItem.col * this.blockUnitSize + groupItem.style.left
                            blockItem.style.top = blockItem.row * this.blockUnitSize + groupItem.style.top + this.groupItemHeight
                            blockItem.style.width = blockItem.width * this.blockUnitSize
                            blockItem.style.height = blockItem.height * this.blockUnitSize
                            blockItem.style.opacity = 1
                            blockItem.style.transition = `${this.transitionDuring}s`
                            blockItem.style.zIndex = 0
                            blockItem.style.backgroundColor = `#${parseInt(Math.random() * 256 * 256 * 256).toString(16)}`
                        })
                    })
                })
            }
            this.menuData = menuData
        },
        groupItemMousedown: function (event, sectionItem, groupItem) {
            if (event.button !== 0) {
                return false
            }
            this.activeType = 'groupItem'
            this.activeSectionItem = sectionItem
            this.activeGroupItem = groupItem
            this.activeGroupItem.style.zIndex = 1
            this.dragData.groupPrevLeft = groupItem.style.left
            this.dragData.groupPrevTop = groupItem.style.top
            this.dragData.prevClientX = event.clientX
            this.dragData.prevClientY = event.clientY
            sectionItem.groupList.forEach(group => {
                if (group.groupIndex > groupItem.groupIndex) {
                    const temp = sectionItem.groupList.filter(item => item.groupIndex < group.groupIndex)
                    let top = 0
                    temp.forEach(item => {
                        if (item === groupItem) {
                            top = top + this.groupItemHeight
                        } else {
                            let max = item.blockList[0].row + item.blockList[0].height
                            item.blockList.forEach(block => {
                                if (block.row + block.height > max) {
                                    max = block.row + block.height
                                }
                            })
                            top = top + this.groupItemHeight + max * this.blockUnitSize + this.groupGap
                        }
                    })
                    group.style.top = top
                    group.blockList.forEach(block => {
                        block.style.top = group.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                    })
                }
            })
            groupItem.blockList.forEach(blockItem => {
                blockItem.style.opacity = 0
            })
        },
        groupItemMouseup: function (event, sectionItem, groupItem) {
            if (event.button !== 0) {
                return false
            }
            this.activeGroupItem.style.transition = `${this.transitionDuring}s`
            this.activeGroupItem.style.zIndex = 0
            this.activeType = this.activeGroupItem = null
            sectionItem.groupList.forEach(groupItem => {
                groupItem.style.left = sectionItem.style.left
                const groupTempList = sectionItem.groupList.filter(item => item.groupIndex < groupItem.groupIndex)
                let top = 0
                groupTempList.forEach(group => {
                    let max = group.blockList[0].row + group.blockList[0].height
                    group.blockList.forEach(block => {
                        if (block.row + block.height > max) {
                            max = block.row + block.height
                        }
                    })
                    top = top + this.groupItemHeight + max * this.blockUnitSize + this.groupGap
                })
                groupItem.style.top = top
                groupItem.style.width = this.blockUnitSize * this.sectionSize
                groupItem.style.height = this.groupItemHeight
                groupItem.blockList.forEach(blockItem => {
                    blockItem.style.left = blockItem.col * this.blockUnitSize + groupItem.style.left
                    blockItem.style.top = blockItem.row * this.blockUnitSize + groupItem.style.top + this.groupItemHeight
                    blockItem.style.width = blockItem.width * this.blockUnitSize
                    blockItem.style.height = blockItem.height * this.blockUnitSize
                    blockItem.style.opacity = 1
                })
            })
        },
        pageMousemove: function (event) {
            if (this.activeType === 'groupItem' && this.activeGroupItem) {
                this.activeGroupItem.style.transition = '0s'
                this.activeGroupItem.style.left = this.dragData.groupPrevLeft + (event.clientX - this.dragData.prevClientX)
                this.activeGroupItem.style.top = this.dragData.groupPrevTop + (event.clientY - this.dragData.prevClientY)
                this.activeGroupItem.blockList.forEach(block => {
                    block.style.left = this.activeGroupItem.style.left + block.col * this.blockUnitSize
                    block.style.top = this.activeGroupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                })
                let sectionIndex = Math.round(this.activeGroupItem.style.left / (this.blockUnitSize * this.sectionSize + this.sectionGap))
                sectionIndex = sectionIndex < 0 ? 0 : (sectionIndex > (this.menuData.sectionList.length - 1) ? (this.menuData.sectionList.length - 1) : sectionIndex)
                const section = this.menuData.sectionList[sectionIndex]
                if (this.activeSectionItem === section) {
                    // 同一个 section 中 group 拖拽
                    section.groupList.sort((prev, next) => {
                        return prev.style.top - next.style.top
                    })
                    section.groupList.forEach((groupItem, groupIndex) => {
                        groupItem.groupIndex = groupIndex
                    })
                    section.groupList.forEach(groupItem => {
                        if (groupItem !== this.activeGroupItem) {
                            const groupTempList = section.groupList.filter(item => item.groupIndex < groupItem.groupIndex)
                            let top = 0
                            groupTempList.forEach(group => {
                                if (group === this.activeGroupItem) {
                                    top = top + this.groupItemHeight + this.groupGap
                                } else {
                                    let max = group.blockList[0].row + group.blockList[0].height
                                    group.blockList.forEach(block => {
                                        if (block.row + block.height > max) {
                                            max = block.row + block.height
                                        }
                                    })
                                    top = top + this.groupItemHeight + max * this.blockUnitSize + this.groupGap
                                }
                            })
                            groupItem.style.top = top
                            groupItem.blockList.forEach(block => {
                                block.style.top = groupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                            })
                        }
                    })
                } else {
                    // 从一个 section 中抽取 group 拖拽到另一个 section
                    let index = 0
                    for (let i = 0; i < this.activeSectionItem.groupList.length; i++) {
                        if (this.activeSectionItem.groupList[i] === this.activeGroupItem) {
                            index = i
                            break
                        }
                    }
                    this.activeSectionItem.groupList.splice(index, 1)
                    this.activeSectionItem.groupList.sort((prev, next) => {
                        return prev.style.top - next.style.top
                    })
                    this.activeSectionItem.groupList.forEach((groupItem, groupIndex) => {
                        groupItem.groupIndex = groupIndex
                    })
                    this.activeSectionItem.groupList.forEach(groupItem => {
                        const groupTempList = this.activeSectionItem.groupList.filter(item => item.groupIndex < groupItem.groupIndex)
                        let top = 0
                        groupTempList.forEach(group => {
                            let max = group.blockList[0].row + group.blockList[0].height
                            group.blockList.forEach(block => {
                                if (block.row + block.height > max) {
                                    max = block.row + block.height
                                }
                            })
                            top = top + this.groupItemHeight + max * this.blockUnitSize + this.groupGap
                        })
                        groupItem.style.top = top
                        groupItem.blockList.forEach(block => {
                            block.style.top = groupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                        })
                    })
                    section.groupList.push(this.activeGroupItem)
                    this.activeSectionItem = section
                }
            } else if (this.activeType === 'blockItem' && this.activeBlockItem) {
                this.activeBlockItem.style.transition = '0s'
                this.activeBlockItem.style.left = this.dragData.blockPrevLeft + (event.clientX - this.dragData.prevClientX)
                this.activeBlockItem.style.top = this.dragData.blockPrevTop + (event.clientY - this.dragData.prevClientY)
                const col = Math.round((this.activeBlockItem.style.left - this.activeGroupItem.style.left) / this.blockUnitSize)
                if (col > this.activeBlockItem.col && col + this.activeBlockItem.width <= this.sectionSize) {
                    console.log('→')
                    this.moveLine(
                        this.activeGroupItem,
                        'right',
                        this.activeBlockItem.col + this.activeBlockItem.width,
                        undefined,
                        this.activeBlockItem.row,
                        this.activeBlockItem.row + this.activeBlockItem.height
                    )
                    this.activeBlockItem.col = this.activeBlockItem.col + 1
                    this.computeSectionGroupBlockPosition()
                } else if (col < this.activeBlockItem.col && col >= 0) {
                    console.log('←')
                    this.moveLine(
                        this.activeGroupItem,
                        'left',
                        this.activeBlockItem.col,
                        undefined,
                        this.activeBlockItem.row,
                        this.activeBlockItem.row + this.activeBlockItem.height
                    )
                    this.activeBlockItem.col = this.activeBlockItem.col - 1
                    this.computeSectionGroupBlockPosition()
                }
                const row = Math.round((this.activeBlockItem.style.top - this.activeGroupItem.style.top - this.groupItemHeight) / this.blockUnitSize)
                if (row > this.activeBlockItem.row) {
                    console.log('↓')
                    this.moveLine(
                        this.activeGroupItem,
                        'bottom',
                        undefined,
                        this.activeBlockItem.row + this.activeBlockItem.height,
                        this.activeBlockItem.col,
                        this.activeBlockItem.col + this.activeBlockItem.width
                    )
                    const tempArr = this.activeGroupItem.blockList.filter(item => item !== this.activeBlockItem)
                    if (tempArr.length) {
                        let max = tempArr[0].row + tempArr[0].height
                        tempArr.forEach(item => {
                            const temp = item.row + item.height
                            max = temp > max ? temp : max
                        })
                        // max = max + this.activeBlockItem.height
                        if (row <= max) {
                            this.activeBlockItem.row = this.activeBlockItem.row + 1
                        }
                    }
                    this.computeSectionGroupBlockPosition()
                    // this.activeBlockItem.row = this.activeBlockItem.row + 1
                } else if (row < this.activeBlockItem.row) {
                    console.log('↑')
                    const influenceBlocks = this.computeInfluenceBlocks(
                        this.activeGroupItem,
                        'top',
                        undefined,
                        this.activeBlockItem.row,
                        this.activeBlockItem.col,
                        this.activeBlockItem.col + this.activeBlockItem.width
                    )
                    if (influenceBlocks.length) {
                        const boundary = this.computeBlocksBoundary(influenceBlocks)
                        if (boundary.top > 0 && !this.computeInfluenceBlocks(this.activeGroupItem, 'top', undefined, boundary.top, boundary.left, boundary.right).length) {
                            this.moveLine(
                                this.activeGroupItem,
                                'top',
                                undefined,
                                this.activeBlockItem.row,
                                this.activeBlockItem.col,
                                this.activeBlockItem.col + this.activeBlockItem.width
                            )
                            this.activeBlockItem.row = this.activeBlockItem.row - 1
                        }
                    } else if (this.activeBlockItem.row > 0) {
                        this.activeBlockItem.row = this.activeBlockItem.row - 1
                    }
                    this.computeSectionGroupBlockPosition()
                }
                // 重新计算拖拽方块现在属于哪个组
                this.computeBlockBelong()
                // 计算选中方块是否位于新分组
                // this.computeBlockAtNewGroup()
            }
        },
        pageMouseup: function () {
            if (this.activeType === 'groupItem' && this.activeGroupItem) {
                this.activeGroupItem.style.transition = `${this.transitionDuring}s`
                this.activeGroupItem.style.zIndex = 0
                this.activeType = this.activeGroupItem = null
            } else if (this.activeType === 'blockItem' && this.activeBlockItem) {
                this.activeBlockItem.style.transition = `${this.transitionDuring}s`
                this.activeBlockItem.style.zIndex = 0
                // console.log(this.activeGroupItem.style.left)
                // let maxHeight = 0
                // this.activeSectionItem.groupList.forEach(group => {
                //     group.blockList.forEach(block => {
                //         if (block !== this.activeBlockItem) {
                //         }
                //     })
                // })
                // if () {
                // } else {
                //     this.activeBlockItem.style.left = this.activeGroupItem.style.left + this.activeBlockItem.col * this.blockUnitSize
                //     this.activeBlockItem.style.top = this.activeGroupItem.style.top + this.activeBlockItem.row * this.blockUnitSize + this.groupItemHeight
                // }
                this.checkCreateNewGroup()
                this.clearEmptyGroup()
                this.activeBlockItem.style.left = this.activeGroupItem.style.left + this.activeBlockItem.col * this.blockUnitSize
                this.activeBlockItem.style.top = this.activeGroupItem.style.top + this.activeBlockItem.row * this.blockUnitSize + this.groupItemHeight
                this.activeType = this.activeGroupItem = this.activeBlockItem = null
                this.menuData.sectionList.forEach(section => {
                    section.groupList.forEach(group => {
                        group.blockList.forEach(block => {
                            block.style.opacity = 1
                        })
                    })
                })
            }
        },
        moveLine: function (group, direction = 'right', col, row, start, end, viewLine = false) {
            if (viewLine) {
                this.$refs.viewLine.style.position = 'absolute'
                this.$refs.viewLine.style.border = '1px solid red'
                if (direction === 'right' || direction === 'left') {
                    this.$refs.viewLine.style.left = `${group.style.left + col * this.blockUnitSize}px`
                    this.$refs.viewLine.style.top = `${group.style.top + start * this.blockUnitSize + this.groupItemHeight}px`
                    this.$refs.viewLine.style.height = `${group.style.top + (end - start) * this.blockUnitSize}px`
                } else {
                    this.$refs.viewLine.style.top = `${group.style.top + row * this.blockUnitSize + this.groupItemHeight}px`
                    this.$refs.viewLine.style.left = `${group.style.left + start * this.blockUnitSize}px`
                    this.$refs.viewLine.style.width = `${group.style.top + (end - start) * this.blockUnitSize}px`
                }
                // console.log('绘制预览线', this.$refs.viewLine, (end - start) * this.blockUnitSize)
            }
            const influenceBlocks = this.computeInfluenceBlocks(group, direction, col, row, start, end)
            // console.log(influenceBlocks)
            if (influenceBlocks.length) {
                if (this.checkBlockMoveEnable(direction, group, influenceBlocks)) {
                    influenceBlocks.forEach(item => {
                        switch (direction) {
                        case 'right':
                            item.col = item.col + 1
                            item.style.left = item.style.left + 1 * this.blockUnitSize
                            this.$refs.viewLine.style.left = `${item.style.left}px`
                            break
                        case 'bottom':
                            item.row = item.row + 1
                            item.style.top = item.style.top + 1 * this.blockUnitSize
                            this.$refs.viewLine.style.top = `${item.style.top}px`
                            break
                        case 'left':
                            item.col = item.col - 1
                            item.style.left = item.style.left - 1 * this.blockUnitSize
                            this.$refs.viewLine.style.left = `${item.style.left}px`
                            break
                        case 'top':
                            item.row = item.row - 1
                            item.style.top = item.style.top - 1 * this.blockUnitSize
                            this.$refs.viewLine.style.top = `${item.style.top}px`
                            break
                        }
                    })
                } else {
                    console.log('位置不足，自动计算位置')
                    let left = influenceBlocks[0].col
                    let top = influenceBlocks[0].row
                    let right = left + influenceBlocks[0].width
                    let bottom = top + influenceBlocks[0].height
                    influenceBlocks.forEach(block => {
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
                        influenceBlocks.forEach(block => {
                            block.row = block.row + (end - top)
                            block.style.top = this.activeGroupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                        })
                        group.blockList.forEach(block => {
                            if (block.row >= end && influenceBlocks.indexOf(block) < 0) {
                                block.row = block.row + (end - top)
                                block.style.top = this.activeGroupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                            }
                        })
                        break
                    case 'bottom':
                        group.blockList.forEach(block => {
                            if (block.row >= row) {
                                block.row = block.row + 1
                                block.style.top = this.activeGroupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                            }
                        })
                        break
                    case 'left':
                        influenceBlocks.forEach(block => {
                            block.row = block.row + (end - top)
                            block.style.top = this.activeGroupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                        })
                        group.blockList.forEach(block => {
                            if (block.row >= end && influenceBlocks.indexOf(block) < 0) {
                                block.row = block.row + (end - top)
                                block.style.top = this.activeGroupItem.style.top + block.row * this.blockUnitSize + this.groupItemHeight
                            }
                        })
                        break
                    case 'top':
                        // influenceBlocks.forEach(block => {
                        //     block.row = block.row + (end - top)
                        //     block.style.top = block.row * this.blockUnitSize + this.groupItemHeight
                        // })
                        // group.blockList.forEach(block => {
                        //     if (block.row >= end && influenceBlocks.indexOf(block) < 0) {
                        //         block.row = block.row + (end - top)
                        //         block.style.top = block.row * this.blockUnitSize + this.groupItemHeight
                        //     }
                        // })
                        break
                    }
                }
            }
        },
        computeInfluenceBlocks: function (group, direction, col, row, start, end) {
            const influenceBlocks = []
            if (direction === 'right') {
                group.blockList.forEach(block => {
                    if (block.col === col) {
                        if ((block.row + block.height > start) && (block.row + block.height <= end)) {
                            influenceBlocks.push(block)
                        } else if ((block.row >= start) && (block.row < end)) {
                            influenceBlocks.push(block)
                        } else if ((block.row < start) && (block.row + block.height > end)) {
                            influenceBlocks.push(block)
                        }
                    }
                })
            } else if (direction === 'bottom') {
                group.blockList.forEach(block => {
                    if (block.row === row) {
                        if ((block.col + block.width > start) && (block.col + block.width <= end)) {
                            influenceBlocks.push(block)
                        } else if ((block.col >= start) && (block.col < end)) {
                            influenceBlocks.push(block)
                        } else if ((block.col < start) && (block.col + block.width > end)) {
                            influenceBlocks.push(block)
                        }
                    }
                })
            } else if (direction === 'left') {
                group.blockList.forEach(block => {
                    if (block.col + block.width === col) {
                        if ((block.row + block.height > start) && (block.row + block.height <= end)) {
                            influenceBlocks.push(block)
                        } else if ((block.row >= start) && (block.row < end)) {
                            influenceBlocks.push(block)
                        } else if ((block.row < start) && (block.row + block.height > end)) {
                            influenceBlocks.push(block)
                        }
                    }
                })
            } else if (direction === 'top') {
                group.blockList.forEach(block => {
                    if (block.row + block.height === row) {
                        if ((block.col + block.width > start) && (block.col + block.width <= end)) {
                            influenceBlocks.push(block)
                        } else if ((block.col >= start) && (block.col < end)) {
                            influenceBlocks.push(block)
                        } else if ((block.col < start) && (block.col + block.width > end)) {
                            influenceBlocks.push(block)
                        }
                    }
                })
            }
            return influenceBlocks
        },
        computeBlocksBoundary: function (blocks) {
            let left = blocks[0].col
            let top = blocks[0].row
            let right = left + blocks[0].width
            let bottom = top + blocks[0].height
            blocks.forEach(block => {
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
            return {
                top,
                right,
                bottom,
                left
            }
        },
        checkBlockMoveEnable: function (direction, group, influenceBlocks) {
            const boundary = this.computeBlocksBoundary(influenceBlocks)
            // let { top, right, bottom, left } = boundary
            const { top, right, left } = boundary
            // console.log(top, right, bottom, left)
            let result = true
            switch (direction) {
            case 'right':
                if (right >= this.sectionSize) {
                    return false
                }
                // for (let i = 0; i < group.blockList.length; i++) {
                //     if (group.blockList[i].col === right) {
                //         if ((group.blockList[i].row + group.blockList[i].height > top) && (group.blockList[i].row + group.blockList[i].height <= bottom)) {
                //             return false
                //         }
                //         if ((group.blockList[i].row >= top) && (group.blockList[i].row < bottom)) {
                //             return false
                //         }
                //         if ((group.blockList[i].row < top) && (group.blockList[i].row + group.blockList[i].height > bottom)) {
                //             return false
                //         }
                //     }
                // }
                // return true
                for (let i = 0; i < influenceBlocks.length; i++) {
                    // let left = influenceBlocks[i].col
                    // let right = influenceBlocks[i].col + influenceBlocks[i].width
                    const top = influenceBlocks[i].row
                    const bottom = influenceBlocks[i].row + influenceBlocks[i].height
                    group.blockList.forEach(item => {
                        if (influenceBlocks.indexOf(item) >= 0) {
                            return false
                        }
                        if (item.col === influenceBlocks[i].col + influenceBlocks[i].width) {
                            if ((item.row + item.height > top) && (item.row + item.height <= bottom)) {
                                result = false
                            }
                            if ((item.row >= top) && (item.row < bottom)) {
                                result = false
                            }
                            if ((item.row < top) && (item.row + item.height > bottom)) {
                                result = false
                            }
                        }
                    })
                }
                return result
            case 'bottom':
                // for (let i = 0; i < group.blockList.length; i++) {
                //     if (group.blockList[i].row === bottom) {
                //         if ((group.blockList[i].col + group.blockList[i].width > left) && (group.blockList[i].col + group.blockList[i].width <= right)) {
                //             return false
                //         }
                //         if ((group.blockList[i].col >= left) && (group.blockList[i].col < right)) {
                //             return false
                //         }
                //         if ((group.blockList[i].col < left) && (group.blockList[i].col + group.blockList[i].width > right)) {
                //             return false
                //         }
                //     }
                // }
                for (let i = 0; i < influenceBlocks.length; i++) {
                    const left = influenceBlocks[i].col
                    const right = influenceBlocks[i].col + influenceBlocks[i].width
                    // let top = influenceBlocks[i].row
                    // let bottom = influenceBlocks[i].row + influenceBlocks[i].height
                    group.blockList.forEach(item => {
                        if (influenceBlocks.indexOf(item) >= 0) {
                            return false
                        }
                        if (item.row === influenceBlocks[i].row + influenceBlocks[i].height) {
                            if ((item.col + item.width > left) && (item.col + item.width <= right)) {
                                result = false
                            }
                            if ((item.col >= left) && (item.col < right)) {
                                result = false
                            }
                            if ((item.col < left) && (item.col + item.width > right)) {
                                result = false
                            }
                        }
                    })
                }
                return result
            case 'left':
                if (left <= 0) {
                    return false
                }
                // for (let i = 0; i < group.blockList.length; i++) {
                //     if (group.blockList[i].col + group.blockList[i].width === left) {
                //         if ((group.blockList[i].row + group.blockList[i].height > top) && (group.blockList[i].row + group.blockList[i].height <= bottom)) {
                //             return false
                //         }
                //         if ((group.blockList[i].row >= top) && (group.blockList[i].row < bottom)) {
                //             return false
                //         }
                //         if ((group.blockList[i].row < top) && (group.blockList[i].row + group.blockList[i].height > bottom)) {
                //             return false
                //         }
                //     }
                // }
                for (let i = 0; i < influenceBlocks.length; i++) {
                    // let left = influenceBlocks[i].col
                    // let right = influenceBlocks[i].col + influenceBlocks[i].width
                    const top = influenceBlocks[i].row
                    const bottom = influenceBlocks[i].row + influenceBlocks[i].height
                    group.blockList.forEach(item => {
                        if (influenceBlocks.indexOf(item) >= 0) {
                            return false
                        }
                        if (item.col + item.width === influenceBlocks[i].col) {
                            if ((item.row + item.height > top) && (item.row + item.height <= bottom)) {
                                result = false
                            }
                            if ((item.row >= top) && (item.row < bottom)) {
                                result = false
                            }
                            if ((item.row < top) && (item.row + item.height > bottom)) {
                                result = false
                            }
                        }
                    })
                }
                return result
            case 'top':
                if (top <= 0) {
                    return false
                }
                // for (let i = 0; i < group.blockList.length; i++) {
                //     if (group.blockList[i].row + group.blockList[i].height === top) {
                //         if ((group.blockList[i].col + group.blockList[i].width > left) && (group.blockList[i].col + group.blockList[i].width <= right)) {
                //             return false
                //         }
                //         if ((group.blockList[i].col >= left) && (group.blockList[i].col < right)) {
                //             return false
                //         }
                //         if ((group.blockList[i].col < left) && (group.blockList[i].col + group.blockList[i].width > right)) {
                //             return false
                //         }
                //     }
                // }
                for (let i = 0; i < influenceBlocks.length; i++) {
                    const left = influenceBlocks[i].col
                    const right = influenceBlocks[i].col + influenceBlocks[i].width
                    // let top = influenceBlocks[i].row
                    // let bottom = influenceBlocks[i].row + influenceBlocks[i].height
                    group.blockList.forEach(item => {
                        if (influenceBlocks.indexOf(item) >= 0) {
                            return false
                        }
                        if (item.row + item.height === influenceBlocks[i].row + influenceBlocks[i].height) {
                            if ((item.col + item.width > left) && (item.col + item.width <= right)) {
                                result = false
                            }
                            if ((item.col >= left) && (item.col < right)) {
                                result = false
                            }
                            if ((item.col < left) && (item.col + item.width > right)) {
                                result = false
                            }
                        }
                    })
                }
                return result
            }
        },
        blockItemMousedown: function (event, sectionItem, groupItem, blockItem) {
            if (event.button !== 0) {
                return false
            }
            this.activeType = 'blockItem'
            this.activeSectionItem = sectionItem
            this.activeGroupItem = groupItem
            this.activeBlockItem = blockItem
            this.activeBlockItem.style.zIndex = 1
            this.dragData.blockPrevLeft = blockItem.style.left
            this.dragData.blockPrevTop = blockItem.style.top
            this.dragData.prevClientX = event.clientX
            this.dragData.prevClientY = event.clientY
            this.menuData.sectionList.forEach(section => {
                section.groupList.forEach(group => {
                    group.blockList.forEach(block => {
                        block.style.opacity = blockItem === this.activeBlockItem ? 1 : this.moveOpacity
                    })
                })
            })
        },
        computeSectionGroupBlockPosition: function () {
            const sectionItem = this.activeSectionItem
            sectionItem.groupList.forEach(groupItem => {
                groupItem.style.left = sectionItem.style.left
                const groupTempList = sectionItem.groupList.filter(item => item.groupIndex < groupItem.groupIndex)
                let top = 0
                groupTempList.forEach(group => {
                    if (group.blockList.length) {
                        let max = group.blockList[0].row + group.blockList[0].height
                        group.blockList.forEach(block => {
                            if (block.row + block.height > max) {
                                max = block.row + block.height
                            }
                        })
                        top = top + this.groupItemHeight + max * this.blockUnitSize + this.groupGap
                    } else {
                        top = top + this.groupItemHeight + this.blockUnitSize + this.groupGap
                    }
                })
                groupItem.style.top = top
                groupItem.blockList.forEach(blockItem => {
                    if (blockItem !== this.activeBlockItem) {
                        blockItem.style.left = blockItem.col * this.blockUnitSize + groupItem.style.left
                        blockItem.style.top = blockItem.row * this.blockUnitSize + groupItem.style.top + this.groupItemHeight
                    }
                })
            })
        },
        computeBlockBelong: function () {
            // console.log('computeBlockBelong', this.menuData.sectionList)
            // console.log('computeBlockBelong', this.activeBlockItem.style.left)
            const sectionIndex = parseInt((this.activeBlockItem.style.left) / (this.blockUnitSize * this.sectionSize + this.sectionGap))
            const section = this.menuData.sectionList[sectionIndex]
            this.activeSectionItem = section
            const groupList = [...section.groupList].sort((prev, next) => prev.groupIndex - next.groupIndex)
            let top = 0
            const groupMaxHeight = []
            // console.log('groupList', groupList)
            groupList.forEach(group => {
                top = top + this.groupItemHeight
                if (group.blockList.length) {
                    let max = group.blockList[0].row * this.blockUnitSize + group.blockList[0].height * this.blockUnitSize
                    group.blockList.forEach(block => {
                        let temp
                        if (this.activeBlockItem === block) {
                            temp = block.row * this.blockUnitSize + 1 * this.blockUnitSize
                        } else {
                            temp = block.row * this.blockUnitSize + block.height * this.blockUnitSize
                        }
                        max = max < temp ? temp : max
                    })
                    top = top + max
                }
                groupMaxHeight.push(top)
                top = top + this.groupGap
            })
            let groupIndex = groupMaxHeight.filter(item => item < this.activeBlockItem.style.top && item !== this.activeGroupItem).length
            groupIndex = groupIndex > this.activeSectionItem.groupList.length - 1 ? this.activeSectionItem.groupList.length - 1 : groupIndex
            groupIndex = groupIndex < 0 ? 0 : groupIndex
            const activeGroupItem = groupList[groupIndex]
            if (activeGroupItem !== this.activeGroupItem) {
                let index = 0
                for (let i = 0; i < this.activeGroupItem.blockList.length; i++) {
                    if (this.activeGroupItem.blockList[i] === this.activeBlockItem) {
                        index = i
                        break
                    }
                }
                this.activeGroupItem.blockList.splice(index, 1)
                this.activeBlockItem.col = Math.round((this.activeBlockItem.style.left - activeGroupItem.style.left) / this.blockUnitSize)
                this.activeBlockItem.row = Math.round((this.activeBlockItem.style.top - activeGroupItem.style.top - this.groupItemHeight) / this.blockUnitSize)
                this.activeGroupItem = activeGroupItem
                while (this.activeBlockItem.col + this.activeBlockItem.width > this.sectionSize) {
                    this.moveLine(
                        this.activeGroupItem,
                        'left',
                        this.activeBlockItem.col,
                        undefined,
                        this.activeBlockItem.row,
                        this.activeBlockItem.row + this.activeBlockItem.height
                    )
                    this.activeBlockItem.col = this.activeBlockItem.col - 1
                }
                if (this.activeBlockItem.col === 0) {
                    let times = this.activeBlockItem.width
                    while (times) {
                        this.moveLine(
                            this.activeGroupItem,
                            'right',
                            this.activeBlockItem.col + (this.activeBlockItem.width - times),
                            undefined,
                            this.activeBlockItem.row,
                            this.activeBlockItem.row + this.activeBlockItem.height
                        )
                        times--
                    }
                }
                this.activeGroupItem.blockList.push(this.activeBlockItem)
                this.computeSectionGroupBlockPosition()
            }
        },
        clearEmptyGroup: function () {
            let index
            for (let i = 0; i < this.activeSectionItem.groupList.length; i++) {
                if (!this.activeSectionItem.groupList[i].blockList.length) {
                    index = i
                    break
                }
            }
            if (index !== undefined) {
                this.activeSectionItem.groupList.splice(index, 1)
                console.log('这里还需要重新计算groupIndex')
                this.computeSectionGroupBlockPosition()
            }
        },
        checkCreateNewGroup: function () {
            console.log('校验是否拉到最下方了，即是否创建新分组')
            let max = 0
            // console.log(this.activeSectionItem.groupList)
            this.activeSectionItem.groupList.forEach(group => {
                let temp
                if (!group.blockList || !group.blockList.length) {
                    temp = group.style.top + this.blockUnitSize + this.groupItemHeight
                } else {
                    let maxRow = group.blockList[0].row + group.blockList[0].height
                    group.blockList.forEach(block => {
                        if (block.row + block.height > maxRow) {
                            maxRow = block.row + block.height
                        }
                    })
                    temp = group.style.top + this.blockUnitSize * maxRow + this.groupItemHeight
                }
                if (max < temp) {
                    max = temp
                }
            })
            if (this.activeBlockItem.style.top - this.groupGap > max) {
                console.log('新建组')
                let groupIndex
                let blockIndex
                /* eslint-disable */
                loop: for (let i = 0; i < this.activeSectionItem.groupList.length; i++) {
                    for (let j = 0; j < this.activeSectionItem.groupList[i].blockList.length; j++) {
                        if (this.activeSectionItem.groupList[i].blockList[j] === this.activeBlockItem) {
                            groupIndex = i
                            blockIndex = j
                            break loop
                        }
                    }
                }
                if (groupIndex !== undefined && blockIndex !== undefined) {
                    this.activeSectionItem.groupList[groupIndex].blockList.splice(blockIndex, 1)
                    this.activeBlockItem.row = 0
                    // let id = 0
                    // for (let i = 0; i < this.activeSectionItem.groupList[groupIndex].blockList.length; i++) {}
                    // if (this.activeSectionItem.groupList[groupIndex].blockList.length) {
                    //     id = `${this.activeSectionItem.sectionIndex}-${this.activeSectionItem.groupList.length}`
                    // } else {
                    //     id = `${this.activeSectionItem.sectionIndex}-${this.activeSectionItem.groupList.length - 1}`
                    // }
                    this.activeSectionItem.groupList.push({
                        id: `${new Date().getTime()}`,
                        style: {
                            // left: 0,
                            // top: 0,
                            width: this.blockUnitSize * this.sectionSize,
                            height: this.groupItemHeight,
                            transition: `${this.transitionDuring}s`,
                            zIndex: 0,
                            backgroundColor:  `#${parseInt(Math.random() * 256 * 256 * 256).toString(16)}`
                        },
                        blockList: [this.activeBlockItem],
                        title: '',
                        groupIndex: this.activeSectionItem.groupList.length
                    })
                    this.$nextTick(() => {
                        console.log('重新排序，充值 groupIndex')
                        let tempArr = [...this.activeSectionItem.groupList].sort((prev, next) => {
                            return prev.style.top - next.style.top
                        })
                        tempArr.forEach((groupItem, groupIndex) => {
                            groupItem.groupIndex = groupIndex
                        })
                        this.computeSectionGroupBlockPosition()
                    })
                }
            }
        },
        pageCοntextmenu: function (event) {},
        blockCοntextmenu: function (event, sectionItem, groupItem, blockItem) {
            this.isShowcustomMenu = true
            this.activeSectionItem = sectionItem
            this.activeGroupItem = groupItem
            this.activeBlockItem = blockItem
            this.activeType = 'changeBlockColor'
            this.$refs.customMenu.style.left = `${event.clientX}px`
            this.$refs.customMenu.style.top = `${event.clientY}px`
        },
        setBlockSize: function (val) {
            this.isShowcustomMenu = false
            // 如果是 2 * 2 变 1 * 1 或者 2 * 2 变 2 * 1
            if (this.activeBlockItem.width === 2 && this.activeBlockItem.height === 2) {
                switch (val) {
                    case 0:
                        this.activeBlockItem.width = 1
                        this.activeBlockItem.height = 1
                        break
                    case 1:
                        this.activeBlockItem.width = 2
                        this.activeBlockItem.height = 1
                        break
                }
            }
            else if (this.activeBlockItem.width === 2 && this.activeBlockItem.height === 1) {
                switch (val) {
                    case 0:
                        this.activeBlockItem.width = 1
                        this.activeBlockItem.height = 1
                        break
                    case 2:
                        // console.log('2 x 1 变 2 x 2')
                        this.moveLine(this.activeGroupItem, 'bottom', undefined, this.activeBlockItem.row + this.activeBlockItem.height, this.activeBlockItem.col, this.activeBlockItem.col + this.activeBlockItem.width)
                        this.activeBlockItem.width = 2
                        this.activeBlockItem.height = 2
                        break
                }
            }
            else if (this.activeBlockItem.width === 1 && this.activeBlockItem.height === 1) {
                switch (val) {
                    case 1:
                        // console.log('1 x 1 变 2 x 1')
                        // 如果方块已经在右边界了，则先左移
                        if (this.activeBlockItem.col + this.activeBlockItem.width >= this.sectionSize) {
                            this.moveLine(this.activeGroupItem, 'left', this.activeBlockItem.col, undefined, this.activeBlockItem.row, this.activeBlockItem.row + this.activeBlockItem.height)
                        } else {
                            this.moveLine(this.activeGroupItem, 'right', this.activeBlockItem.col + this.activeBlockItem.width, undefined, this.activeBlockItem.row, this.activeBlockItem.row + this.activeBlockItem.height)
                        }
                        this.activeBlockItem.width = 2
                        this.activeBlockItem.height = 1
                        break
                    case 2:
                        if (this.activeBlockItem.col + this.activeBlockItem.width >= this.sectionSize) {
                            this.moveLine(this.activeGroupItem, 'left', this.activeBlockItem.col, undefined, this.activeBlockItem.row, this.activeBlockItem.row + this.activeBlockItem.height)
                        } else {
                            this.moveLine(this.activeGroupItem, 'right', this.activeBlockItem.col + this.activeBlockItem.width, undefined, this.activeBlockItem.row, this.activeBlockItem.row + this.activeBlockItem.height)
                        }
                        this.activeBlockItem.width = 2
                        this.moveLine(this.activeGroupItem, 'bottom', undefined, this.activeBlockItem.row + this.activeBlockItem.height, this.activeBlockItem.col, this.activeBlockItem.col + this.activeBlockItem.width)
                        this.activeBlockItem.height = 2
                        break
                }
            }
            this.activeBlockItem.style.width = this.activeBlockItem.width * this.blockUnitSize
            this.activeBlockItem.style.height = this.activeBlockItem.height * this.blockUnitSize
            this.computeSectionGroupBlockPosition()
        },
        setBlockColor: function () {
            this.isShowcustomMenu = false
            this.activeBlockItem.style.backgroundColor = `#${parseInt(Math.random() * 256 * 256 * 256).toString(16)}`
            // this.activeBlockItem.style.backgroundColor = `red`
        }
    },
    mounted: function () {
        this.initData()
    }
}
</script>
<style lang="stylus" scoped>
* {
    // background-color: rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}
.home6 {
    width: 1000px;
    height: 800px;
    // border: 1px solid red;
    background-color: rgba(0, 0, 0, 0.1);
    position: relative;
    margin-top: 100px;
    margin-left: 150px;
    user-select: none;
    .groupItem {
        position: absolute;
        border: 1px solid;
        cursor: move;
    }
    .blockItem {
        position: absolute;
        border: 1px solid;
        transition: 0.2s;
    }
    .testBtn {
        position: fixed;
        right: 0;
        top: 0;
    }
    .customMenu {
        position: fixed;
        .firstMenuItem {
            display: block;
            width: 200px;
            height: 50px;
            line-height: 50px;
            background-color: white;
            position: relative;
            &:hover {
                background-color: rgb(149, 208, 247);
                .secondMenu {
                    display: block;
                    width: 200px;
                    background-color: white;
                    .secondMenuItem {
                        height: 50px;
                        line-height: 50px;
                        font-size: 14px;
                        &:hover {
                            background-color: rgb(149, 208, 247);
                        }
                    }
                }
            }
            .secondMenu {
                display: none;
                position: absolute;
                left: 100%;
                top: 0;
                font-size: 0;
                line-height: 0;
                &.colors {
                    width: 400px;
                    .secondMenuItem {
                        display: inline-block;
                        width: 25%;
                        height: 50px;
                        line-height: 50px;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>
