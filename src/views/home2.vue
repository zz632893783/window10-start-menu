<template>
    <div class="home2">
        <div class="block" v-for="(item, index) in menu" v-bind:key="index">
            {{item.content}}
        </div>
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            msg: '123',
            menu: [{
                content: '0-0',
                size: 'mini'
            }, {
                content: '0-1',
                size: 'mini'
            }, {
                content: '0-2',
                size: 'small'
            }]
        }
    }
}
</script>
<style lang="stylus" scoped>
.home2 {
    width: 600px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    position: relative;
}
</style>
