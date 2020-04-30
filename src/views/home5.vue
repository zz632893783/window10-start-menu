<template>
    <div class="home5" v-on:mousemove="pageMousemove($event)">
        <div class="container">
            <template v-for="(sectionItem, sectionIndex) in menuData.sectionList">
                <template v-for="(groupItem, groupIndex) in sectionItem.groupList">
                    <div
                        class="groupHeader"
                        v-bind:key="`${sectionIndex}-${groupIndex}`"
                        v-bind:style="computeGroupHeaderStyle(sectionItem, sectionIndex, groupItem, groupIndex)"
                        v-on:mousedown="groupHeaderMousedown($event, sectionItem, sectionIndex, groupItem, groupIndex)"
                        v-on:mouseup="groupHeaderMouseup($event, sectionItem, sectionIndex, groupItem, groupIndex)">
                        {{groupItem.title}}
                    </div>
                    <div
                        class="block"
                        v-for="(blockItem, blockIndex) in groupItem.blockList"
                        v-bind:key="`${sectionIndex}-${groupIndex}-${blockIndex}`"
                        v-bind:style="computeGroupBlockStyle(sectionItem, sectionIndex, groupItem, groupIndex, blockItem, blockIndex)">
                        {{blockItem.title}}
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>
<script>
import menuData from '../menuData'
menuData.sectionList.forEach(section => {
    section.groupList.forEach(gloup => {
        gloup.dragX = gloup.dragX = 0
    })
})
export default {
    data: function () {
        return {
            menuData,
            sectionGap: 20,
            groupGap: 10,
            blockGap: 5,
            // 单个 section 的尺寸，如 win10 的尺寸是6
            sectionSize: 12,
            activeType: null,
            activeObject: null,
            // 组标题的高度大小
            groupHeaderSize: 30,
            // 单位方格的像素大小
            blockUnitSize: 50,
            transitionDuring: 0.2,
            mouseData: {
                dragEnable: false,
                prevClientX: 0,
                prevClientY: 0,
                prevScrollLeft: 0,
                prevScrollTop: 0,
                groupPrevX: 0,
                groupPrevY: 0
            }
        }
    },
    mounted: function () {
        // console.log(this.menuData)
    },
    methods: {
        computeGroupHeaderStyle: function (sectionItem, sectionIndex, groupItem, groupIndex) {
            if (this.menuData.mode === 'vertical') {
                // const tempSectionArr = this.menuData.sectionList.filter(section => section.sectionIndex < sectionIndex)
            } else if (this.menuData.mode === 'horizontal') {
                let left
                let top
                let transition
                let zIndex
                if ((this.activeType === 'groupHeader') && (this.activeObject === groupItem)) {
                    left = groupItem.dragX
                    top = groupItem.dragY
                    transition = 'none'
                    zIndex = 1
                } else {
                    const tempSectionArr = this.menuData.sectionList.filter(section => section.sectionIndex < sectionIndex)
                    left = tempSectionArr.length * (this.sectionSize * this.blockUnitSize + this.sectionGap)
                    const tempGroupArr = sectionItem.groupList.filter(group => group.groupIndex < groupIndex)
                    top = 0
                    tempGroupArr.forEach(group => {
                        top = top + this.groupHeaderSize + this.groupGap
                        if ((this.activeType === 'groupHeader') && (this.activeObject === group)) {
                            return false
                        }
                        let maxRow = 0
                        group.blockList.forEach(block => {
                            const endRow = block.row + block.height
                            if (endRow > maxRow) {
                                maxRow = endRow
                            }
                        })
                        top = top + maxRow * this.blockUnitSize
                    })
                    groupItem.tempX = left
                    groupItem.tempY = top
                    transition = `${this.transitionDuring}s`
                    zIndex = 0
                }
                return {
                    left: `${left}px`,
                    top: `${top}px`,
                    height: `${this.groupHeaderSize}px`,
                    width: `${this.sectionSize * this.blockUnitSize}px`,
                    transition,
                    zIndex
                }
            }
        },
        computeGroupBlockStyle: function (sectionItem, sectionIndex, groupItem, groupIndex, blockItem, blockIndex) {
            if (this.menuData.mode === 'vertical') {
            } else if (this.menuData.mode === 'horizontal') {
                const tempSectionArr = this.menuData.sectionList.filter(section => section.sectionIndex < sectionIndex)
                let left = tempSectionArr.length * (this.sectionSize * this.blockUnitSize + this.sectionGap)
                left = left + blockItem.col * this.blockUnitSize
                const tempGroupArr = sectionItem.groupList.filter(group => group.groupIndex < groupIndex)
                let top = 0
                tempGroupArr.forEach(group => {
                    top = top + this.groupHeaderSize + this.groupGap
                    let maxRow = 0
                    group.blockList.forEach(block => {
                        const endRow = block.row + block.height
                        if (endRow > maxRow) {
                            maxRow = endRow
                        }
                    })
                    top = top + maxRow * this.blockUnitSize
                })
                top = top + blockItem.row * this.blockUnitSize + this.groupHeaderSize
                let opacity
                if ((this.activeType === 'groupHeader') && (this.activeObject === groupItem)) {
                    opacity = 0
                } else {
                    opacity = 1
                }
                return {
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${blockItem.width * this.blockUnitSize}px`,
                    height: `${blockItem.height * this.blockUnitSize}px`,
                    opacity
                }
            }
        },
        groupHeaderMousedown: function (event, sectionItem, sectionIndex, groupItem, groupIndex) {
            this.activeType = 'groupHeader'
            this.activeObject = groupItem
            this.mouseData.dragEnable = true
            this.mouseData.prevClientX = event.clientX
            this.mouseData.prevClientY = event.clientY
            this.mouseData.groupPrevX = groupItem.tempX
            this.mouseData.groupPrevY = groupItem.tempY
        },
        groupHeaderMouseup: function (event, sectionItem, sectionIndex, groupItem, groupIndex) {
            this.activeType = this.activeObject = null
        },
        pageMousemove: function (event) {
            if ((this.activeType === 'groupHeader') && this.activeObject) {
                this.activeObject.dragX = this.mouseData.groupPrevX + (event.clientX - this.mouseData.prevClientX)
                this.activeObject.dragY = this.mouseData.groupPrevY + (event.clientY - this.mouseData.prevClientY)
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
.container {
    width: 1000px;
    height: 700px;
    border: 1px solid;
    margin-top: 100px;
    margin-left: 200px;
    position: relative;
    .groupHeader {
        position: absolute;
        transition: 0.2s;
        border: 1px solid;
    }
    .block {
        position: absolute;
        border: 1px solid;
        font-size: 12px;
        transition: 0.2s;
    }
}
</style>
