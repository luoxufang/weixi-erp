import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userName: "",
		token: "",
		openid: "",
		shopName: "",
		shopList: []
	},
	mutations: {
		login(state, data) { // 登录保存信息
			state.userName = data.userName || '新用户';
			state.token = data.token
			state.openid = data.openid
			state.hasLogin = true;
		},
		logout(state) { //退出登录
			state.userName = "";
			state.hasLogin = false;
		},
		changeShopName(state, data){
			state.shopName = data
		},
		getShopList(state, data){
			console.log(data)
			state.shopName = data.shopList
		}
	}
})

export default store
