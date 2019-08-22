<template>
    <div id="app" :class="[$store.state.theme]">
        <transition name="fade" mode="out-in" appear>
            <router-view></router-view>
        </transition>
        <el-background :theme="$store.state.theme"></el-background>
        <!--模块到期提示-->
        <el-dialog :title="license[$store.state.langType].dialogTitle" :visible.sync="dialogVisible" size="tiny" :close-on-click-modal="false" width="400px" :close-on-press-escape="false" :show-close="false" :before-close="handleClose">
            <div class="sy-about-top sy-lf">
                <img class="sy-about-logo" src="/common/images/aboutLogo.png">
            </div>
            <div class="sy-about-cont">
                <div style="line-height:28px;">
                    {{license[$store.state.langType].info}}
                </div>
            </div>
            <div class="sy-about-foot">
                <div>{{license[$store.state.langType].copyright}}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { saveUserAccessDetail, getUnitLicense } from "@/service";
import config from '@/config.js';

export default {
    data() {
        return {
            dialogVisible: false,
            license: {
                'zh-CN': {
                    dialogTitle: '提示',//
                    info: '该模块已到期，请联系管理员！',// 
                    copyright: '版权所有2017 Shiyue Inc. 保留所有权利。',//
                },
                'en': {
                    dialogTitle: 'Tips',//提示
                    info: 'The module has expired, please contact the administrator!',// 该模块已到期，请联系管理员！
                    copyright: 'Copyright 2017 Shiyue Inc. All rights reserved.',//版权所有2017 Shiyue Inc. 保留所有权利。
                }
            }
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            if (process.env.NODE_ENV == 'production') {
                // 使用统计次数
                saveUserAccessDetail({
                    userId: this.$store.state.userId,
                    userType: this.$store.state.userType,
                    unitId: this.$store.state.unitId,
                    resId: config.app,
                    resName: config.appName,
                    type: 1
                }).then(res=>{}).catch(err=>{});
                // 查询到期时间
                let path = this.$route.path && this.$route.path != '/' ? this.$route.path.match(/\/(\S*)\//)[1] : 'base'
                getUnitLicense(path, this.$store.state.unitId).then(res => {
                    this.dialogVisible = !res;
                }).catch(err => {
                    this.dialogVisible = false;
                });
            }
            // 查询 初始化语言
            this.$store.dispatch("getLanguages", {code: this.$store.state.prePath, unitId: this.$store.state.unitId});
		},
    }
}
</script>
