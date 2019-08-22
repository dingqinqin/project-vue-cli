module.exports = `<template>
    <div class="sy-app-container">
        <el-grader>
            <div slot="headerLeft">{{text}}</div>
            <div slot="headerRight"></div>
            <div slot="bodyLeft"></div>
            <div slot="bodyRight"></div>
            <div slot="footer"></div>
        </el-grader>
    </div>
</template>

<script>
export default {

    data(){
        return {
            
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){

        }
    },
    mounted(){

    }
}
</script>

<style scoped>

</style>
`;