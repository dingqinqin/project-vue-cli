<template>
	<div class="sy-app-container" :class="[$store.state.theme]">
		<div class="sy-home-header">
            <el-page-header :title="$store.state.lang.title" 
                :versionList="versionList"
                :logourl="getUnitLogo" 
                :theme="$store.state.theme"
                :lang="$store.state.langType" 
                :name="userName"
                @changeLange="handleChangeLange" 
                :lang-list="$store.state.langList">
            </el-page-header>
		</div>
		<div class="sy-home-body">
			<div class="sy-home-body-left" :class="{'is-expended': isRotate}">
                <el-nav :theme="$store.state.theme" :data="navList" :defaultActive="currentPage" @style-change="isRotate = !isRotate"></el-nav>
			</div>
			<div class="sy-home-body-right" :class="{'is-expended': !isRotate}">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
			</div>
		</div>
        <el-page-footer :theme="$store.state.theme"></el-page-footer>
	</div>
</template>

<script>
import { getCodeMenuList } from '@/service';
import './scss/index.scss';
import version from './version.js';
export default {
	data() {
		return {
            getUnitLogo: window.ShiYue.base + '/api/storage/show/unit/' + this.$store.state.unitId,
			versionList: [],
			isRotate: false,
			currentPage: '',
            navList: [],
            userName: ''
		}
	},
	created() {
		this.init();
		
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
            this.versionList = version[this.$store.state.langType];
			document.title = this.$store.state.lang.title;
			getCodeMenuList(this.$store.state.prePath).then((data) => {
				data.forEach((_a,a)=>{
                    if(_a.resourceType == 2){
                        _a.name = this.$store.state.lang[_a.code] || _a.name;
                        _a.children.forEach((_d,d)=>{
                            if(_d.resourceType == 2){
                                _d.name = this.$store.state.lang[_d.code] || _d.name;
                            }
                        })
                    }
                })
                this.navList = data;
			}).catch(err=>{});
		},
		// 切换语言回调
		handleChangeLange(val){
			window.localStorage.setItem("lange_", val);
			if(this.$store.state.langType != val){
				location.reload();
			}
		}
	}
}
</script>