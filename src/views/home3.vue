<template>
    <div class="home3">
        <group
            v-for="(groupItem, groupIndex) in menu"
            v-bind:key="groupIndex"
            v-bind:id="groupItem.id"
            v-bind:blocks="groupItem.blocks"
            v-bind:panelHeaderHeight="30"
            v-bind:blockUnitSize="50"
        ></group>
    </div>
</template>
<script>
import group from '@/components/group'
export default {
    components: {
        group
    },
    data: function () {
        return {
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
                    id: '0-6'
                }]
            }, {
                id: '1',
                blocks: [{
                    col: 0,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '1-0'
                }, {
                    col: 1,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '1-1'
                }, {
                    col: 2,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '1-2'
                }, {
                    col: 3,
                    row: 0,
                    width: 1,
                    height: 1,
                    id: '1-3'
                }]
            }]
        }
    }
}
</script>
<style lang="stylus" scoped>
.home3 {
    position: relative;
    width: 600px;
    height: 800px;
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
