module.exports = `<template>
	<div class="sy-app-container">
        <div class="sy-home-body-left" :style="{width:leftWidth+'px'}">
            <div class="change-menu-icon">
            <i class="fa fa-outdent" aria-hidden="true" :class="{'iocn-rotate-l': isRotate}" @click="changeNavStyle"></i>
            </div>
            <sy-left-nav router :defaultActive="currentPage" :navList="navList" :isIcon="isShowText"></sy-left-nav>
        </div>
        <div class="sy-home-body-right" :style="{left: leftPosition + 'px'}">
            <transition name="fade" mode="out-in" appear>
                <router-view></router-view>
            </transition>
        </div>
	</div>
</template>

<script>
import { getCodeMenuList, getUnitLicense ,getUnitCodeConfigLang } from '@/{{page}}/request.js';
export default {
	name: 'hello',
	data() {
		return {
            name: '{{name}}',
			isShowText: true,
			leftWidth: 230,
			leftPosition: 230,
			isRotate: false,
			currentPage: '',
			navList: {{navList}}
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
			// getCodeMenuList(this.name).then((data) => {
			// 	this.navListData(data)
			// }).catch(err=>{});
		},
		navListData(data){
			data.forEach((_a,a)=>{
				if(_a.resourceType == 2){
					_a.name = this.$store.state.lang.base[_a.code] || _a.name;
					_a.children.forEach((_d,d)=>{
						if(_d.resourceType == 2){
							_d.name = this.$store.state.lang.base[_d.code] || _d.name;
						}
					})
				}
			})
			this.navList = data;
		},
		changeNavStyle() {
			this.isShowText = !this.isShowText;
			this.isRotate = !this.isRotate;
			this.leftWidth = this.isShowText ? 220 : 50;
			this.leftPosition = this.isShowText ? 220 : 50;
		}
	}
}
</script>

<style scoped>

</style>
`;
