<template>
    <div class="grid">
        <div class="item">1</div>
        <div class="item" ref="item">2</div>
        <div class="item item3" ref="item3">3</div>
        <div class="item item4" ref="item4">4</div>
        <div class="item item5" ref="item5">5</div>
    </div>
</template>
<script>
export default {
    data: function () {
        return {}
    },
    mounted: function () {
        // console.log(this.$refs.item)
        // console.log(window.getComputedStyle(this.$refs.item))
        // console.log(this.$refs.item3.getBoundingClientRect())
    }
}
</script>
<style lang="stylus" scoped>
.grid {
    width: 600px;
    height: 600px;
    border: 1px solid;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-auto-flow: column dense;
    .item {
        border: 1px solid red;
    }
    .item3 {
        grid-column-start: 3;
        grid-row-start: 4;
    }
}
</style>
