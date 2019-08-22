const _import = require('@/router/' + process.env.NODE_ENV)
import config from "@/config.js";
let routes = [
	{
		path: "/edu",
		name: "edu",
		component: _import("page/edu/Index"),
		children: [
			// 欢迎
			{
			    path: 'hello',
			    name: 'hello',
			    component: {
			        template: '<el-page-hello :name="name"></el-page-hello>',
			        data() {
			            return {
			                name: ''
			            }
			        },
			        created() {
			            this.name = this.$store.state.realName
			        }
			    },
			    meta: {
			        keepAlive: false
			    }
			},
            // 权限日志
			{
			    path: "auth",
			    name: "auth",
			    component: {
                    template: '<el-page-auth code="'+config.app+'" :unit-id="$store.state.unitId"></el-page-auth>',
                    created() {
                        this.$parent.$emit("currentPage", this.$route.path);
                    }
			    }
			},
			{
			    path: "log",
			    name: "log",
			    component: {
                    template: '<el-page-log code="' + config.app + '"></el-page-log>',
                    created() {
                        this.$parent.$emit("currentPage", this.$route.path);
                    }
			    }
            },
            // -----
            // 项目路由
            // -----
			// 重定向
			{ path: "/", redirect: "/edu/hello" }
		]
	},
	{
		path: "/",
		redirect: "/edu"
    },
    {
        path: '*',
        component: {
            template: '<el-not-find></el-not-find>'
        },
        meta: {
            keepAlive: true
        }
    }
];

export default routes