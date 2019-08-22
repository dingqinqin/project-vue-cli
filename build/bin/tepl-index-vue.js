module.exports = `<template>
	<div class="sy-app-container">
		<div class="sy-home-header">
			<sy-header :title="$store.state.lang.base.title" :name="userName" :versionList="versionList" :lang="changeLang" @changeLange="handleChangeLange"
				:lang-list="langList"></sy-header>
		</div>
		<div class="sy-home-body sy-edu">
			<transition name="fade" mode="out-in" appear>
				<router-view></router-view>
			</transition>
		</div>
		<div class="sy-home-footer">
			<foot></foot>
		</div>
		<el-dialog
			title="提示"
			:visible.sync="dialogVisible"
			size="tiny"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			:before-close="handleClose">
			<div class="sy-about-top">
                <img class="sy-about-logo" src="/common/images/aboutLogo.png">
                <span class="sy-about-logo-text">{{$store.state.lang.header.name}}</span>
            </div>
            <div class="sy-about-cont">
                <el-row style="line-height:28px;">
                    <el-col :span="8" class="right">{{$store.state.lang.header.pmodule}}：</el-col>
                    <el-col :span="16">{{$store.state.lang.base.title}}</el-col>
                    <el-col :span="8" class="right">{{$store.state.lang.base.info}}：</el-col>
                    <el-col :span="16">{{$store.state.lang.base.msg}}</el-col>
                </el-row>
            </div>
			<div class="sy-about-foot">
                <div>{{$store.state.lang.header.name}}</div>
                <div>{{$store.state.lang.header.copyright}}</div>
            </div>
		</el-dialog>
	</div>
</template>

<script>
import "./css/index.css";
import foot from '@/commonPage/footer/footer.vue';
import SyHeader from '@/commonPage/header/header.vue';
import { getUnitLicense ,getUnitCodeConfigLang } from '@/{{page}}/request.js';
import version from './version.js';
import store from '@/vuex/index.js';
let langList = [{value: 'zh-CN', name: '中文'},{value: 'en', name: 'English'}]
export default {
	components: {
		foot,
		SyHeader
	},
	beforeRouteLeave(to, from, next) {
		next()
	},
	beforeRouteEnter(to, from, next) {
		// getUnitCodeConfigLang('{{name}}', store.state.unitId).then(res=>{
		// 	let arr = [];
		// 	res.forEach((_a,a)=>{
		// 		arr.push({
		// 			value: _a.value,
		// 			name: _a.name
		// 		})
		// 	})
		// 	langList = arr.length > 0 ? arr : [{value: 'zh-CN', name: '中文'}]
		// 	next()
		// }).catch(err=>{
		// 	langList = [{value: 'zh-CN', name: '中文'}]
		// 	next()
		// })
		next()
	},
	beforeRouteUpdate(to, from, next) {
		next()
	},
	name: 'hello',
	data() {
		return {
            name: '{{name}}',
			dialogVisible: false,
			versionList: [],
			userName:'',
			currentPage: '',
			changeLang: 'zh-CN',
			langList: langList
		}
	},
	created() {
		this.init();
		
	},
	computed: {
	  	getModuleLang() {
			return this.$store.state.langType;
		}
	},
	watch: {
		getModuleLang(val) {
			document.title = this.$store.state.lang.base.title;
		}
	},
	methods: {
		init(){
            let _this = this;
            this.$on('currentPage', function(msg) {
                _this.currentPage = msg;
            });
            this.$on('change-user-name', function(name) {
                _this.userName = name;
            })
			this.userName = this.$store.state.realName || '';
      		this.changeLang = window.localStorage.getItem("lange_"+this.name) || "zh-CN";
			this.versionList = version[this.changeLang];
			document.title = this.$store.state.lang.base.title;
			// this.getLimitTime();
		},
		// 查询到期时间
		getLimitTime(){
			getUnitLicense(this.name,this.$store.state.unitId).then(res=>{
				this.dialogVisible = !res;
			}).catch(err=>{
				this.dialogVisible = true;
			})
		},
		// 切换语言回调
		handleChangeLange(val){
			document.title = this.$store.state.lang.base.title;
			this.versionList = version[this.changeLang];
			window.localStorage.setItem("lange_"+this.name, val);
			if(this.changeLang != val){
				this.changeLang = val;
				location.reload();
			}
		}
	}
}
</script>

<style scoped>

</style>
`;
