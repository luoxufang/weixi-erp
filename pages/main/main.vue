<template>
	<view class="main-box tui-skeleton">
		<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>

		<view class="news-notice-view">
			<view class="navbar">
				<view v-for="(item, index) in navList" :key="index" class="nav-item tui-skeleton-rect" :class="{ current: tabCurrentIndex === index }" @click="tabClick(item,index)">{{ item.text }}</view>
			</view>
			<view class="news-view tui-skeleton-rect">
				<image class="banner" src="/static/banner.png" mode="aspectFill" />
				<view class="absolute-view">
					<view class="news-box" v-if="currentType=='Receipt'" 
					@click.stop="navTo2(`/pages/sale/indexOrder?todayamount=`+getorderData.todayamount+'&last5amount='+getorderData.last5amount+'&lastmonthamount='+getorderData.lastmonthamount)">
						<view class="boss">BOSS:</view>
						<view class="notice">恭喜你今天又接了<text class="font-color">{{getorderData.todayamount}}</text>元订单</view>
						<view class="notice">近五日接了<text class="font-color">{{getorderData.last5amount}}</text>元订单</view>
						<view class="notice">近一个月接了<text class="font-color">{{getorderData.lastmonthamount}}</text>元订单</view>
					</view>
					<view class="news-box" v-if="currentType=='Stock'" @click.stop="navTo2('/pages/stock/indexStock?todayamount='+getngstockData.last30amount+'&last5amount='+getngstockData.last60amount+'&lastmonthamount='+getngstockData.last90amount)">
						<view class="boss">BOSS:</view>
						<view class="notice">公司久滞库存30天以上<text class="font-color">{{getngstockData.last30amount}}</text>元</view>
						<view class="notice">60天以上<text class="font-color">{{getngstockData.last60amount}}</text>元</view>
						<view class="notice">90天以上<text class="font-color">{{getngstockData.last90amount}}</text>元</view>
					</view>
					<view class="news-box" v-if="currentType=='Money'" @click.stop="navTo2('/pages/main/receipt?payamount='+getrecData.payamount+'&recamount='+getrecData.recamount)">
						<view class="boss">BOSS:</view>
						<view class="notice">你的过期应收款是<text class="font-color">{{getrecData.payamount}}</text>元</view>
						<view class="notice">逾期付款<text class="font-color">{{getrecData.recamount}}</text>元</view>
					</view>
					<view class="news-box" v-if="currentType=='Price'" @click.stop="navTo2('/pages/main/priceList?totalcount='+priceData.totalcount)">
						<view class="boss">BOSS:</view>
						<view class="notice">你的价格最大波动率为<text class="font-color">{{priceData.totalcount}}%</text></view>
						<view class="notice">请点开核实一下呀！</view>
					</view>
					<view class="news-box" v-if="currentType=='Delivery'" @click.stop="navTo2('/pages/main/delivery?totalsalecount='+deliveryData.totalsalecount+'&totalpurcount='+deliveryData.totalpurcount)">
						<view class="boss">BOSS:</view>
						<view class="notice">你的超过交期的销售订单是<text class="font-color">{{deliveryData.totalsalecount}}</text>元</view>
						<view class="notice">超过交期的采购订单<text class="font-color">{{deliveryData.totalpurcount}}</text>元</view>
						<view class="notice">是否忘记出入库还是真的超交期？</view>
					</view>
					<view class="news-box" v-if="currentType=='Produce'" @click.stop="navTo2('/pages/main/order?totalworkcount='+deliveryData.totalworkcount)">
						<view class="boss">BOSS:</view>
						<view class="notice">你的超过交期的生产订单有<text class="font-color">{{deliveryData.totalworkcount}}</text>条</view>
						<view class="notice">是否忘记入库还是真的超交期？</view>
					</view>
				</view>

				<view class="select-company" @click.stop="toggleSpec()">
					<view class="flex-box">
						{{shopname?shopname:'未登录'}}
					</view>
					<image class="image" src="/static/la.png" />
				</view>
			</view>
		</view>
		<!-- @click="navTo('/pages/public/login')" -->

		<!-- @click="tabtap(fitem, index)" -->
		
		<view class="data-news">
			<view class="left-view tui-skeleton-rect">
				<view v-for="(fitem, index) in leftTabs" :key="fitem.id" class="f-item" :class="{ active: fitem.id === currentleftId }" @click="leftTabsClick(fitem)">{{ fitem.label }}</view>
			</view>
			
			<view class="right-view">
				<scroll-view class="lalala tui-skeleton-rect" scroll-y style="height: 100%;">

					<view v-if="clickType=='1'" class="fang-list-box" v-for="(item,index) in reportManagement" :key="index">
						<view class="title">{{item.name}}</view>
						<view class="item-list">
							<view class="item" v-for="(ditem, dindex) in item.child" :key="dindex" @click="navTo2(ditem.url)">
								<image class="image" :src="ditem.icon" />
								<view class="">{{ditem.name}}</view>
							</view>
						</view>
					</view>

					<view v-if="clickType=='2'" class="fang-list-box" v-for="(titem,index) in dataCheck" :key="index">
						<view v-if="titem.child.length>0">
							<view class="title">{{titem.name}}</view>
							<view class="item-list">
								<view class="item" v-for="(witem, dindex) in titem.child" :key="dindex" @click="navTo2(witem.url)">
									<image class="image" :src="witem.icon" />
									<view class="">{{witem.name}}</view>
								</view>
							</view>
						</view>
					</view>

					<view v-if="clickType=='3'" class="fang-list-box" v-for="(yitem,index) in fuctionList" :key="index">
						<view v-if="yitem.child.length>0">
							<view class="title">{{yitem.name}}</view>
							<view class="item-list">
								<view class="item" v-for="(hitem, dindex) in yitem.child" :key="dindex" @click="navTo2(hitem.url)">
									<image class="image" :src="hitem.icon" />
									<view class="">{{hitem.name}}</view>
								</view>
							</view>
						</view>
					</view>

				</scroll-view>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" style="width:100%;" @click.stop="stopPrevent">
				<view class="common-box select-title">
					<text>请选择店铺</text>
					<!-- <image @click="toggleSpec" class="image" src="/static/delete.png" /> -->
					<span class="close" @click="toggleSpec">关闭</span>
				</view>

				<view class="content-list">
					<view class="item" :class="item.shopid==shopid?'active':''" v-for="(item, index) in shopList" :key="index" @click="selectShop(item)">{{item.shopname}}</view>
				</view>
				
				<view class="common-box no-login" @click="loginout()">
					<text>退出登录</text>
				</view>
			</view>
		
		</view>

	</view>
</template>

<script>
	import tuiSkeleton from "@/components/tui-skeleton/tui-skeleton"
	import util from '@/util.js';
	import {
		mapState
	} from 'vuex'

	export default {
		components:{
			tuiSkeleton
		},
		data(){
			return {
				clickType: '1',
				skeletonShow: true,
				currentType: 'Receipt',
				specClass: 'none',
				getorderData:{
					todayamount:'0',
					last5amount:'0',
					lastmonthamount:'0',
					loadingType: 'more'
				},
				getngstockData:{
					last30amount:'0',
					last60amount:'0',
					last90amount:'0',
				},
				getrecData:{
					payamount:'0',
					recamount:'0',
				},
				priceData:{
					totalcount:'0',
				},
				deliveryData:{
					totalpurcount:'0',
					totalsalecount:'0',
					totalworkcount:'0',
				},
				tabCurrentIndex: 0,
				navList: [
					{
						state: 0,
						text: '接单',
						loadingType: 'more',
						loaded: false
					},
					{
						state: 1,
						text: '库存',
						loadingType: 'more',
						loaded: false
					},
					{
						state: 2,
						text: '收款',
						loadingType: 'more',
						loaded: false
					},
					{
						state: 3,
						text: '价格',
						loadingType: 'more',
						loaded: false
					},
					{
						state: 4,
						text: '交期',
						loadingType: 'more',
						loaded: false
					},
					{
						state: 5,
						text: '生产',
						loadingType: 'more',
						loaded: false
					}
				],
				flist: [ // 今日播报，菜单选项
					{ id:1, label: '接单', loaded: false },
					{ id:2, label: '库存', loaded: false },
					{ id:3, label: '收款', loaded: false },
					{ id:4, label: '价格', loaded: false },
					{ id:5, label: '交期', loaded: false },
					{ id:6, label: '生产', loaded: false }
				],
				currentleftId: 1,//当前一级id
				leftTabs:[
					{ id:1, label: '功能报表', loaded: false },
					{ id:2, label: '数据考核', loaded: false },
					{ id:3, label: '功能操作', loaded: false },
				],
				currentId: 1,//当前一级id
				reportManagement: [
					{
						name: '销售',
						index: 0,
						stemp: false,
						url: '', // 如果如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '销售订单', url: '/pages/sale/order', icon:'/static/icon_1.png' },
							{ name: '销售出库', url: '/pages/sale/checkout', icon:'/static/icon_2.png' },
							{ name: '应收账款', url: '/pages/sale/bill', icon:'/static/icon_3.png' },
						]
					},
					{
						name: '采购',
						index: 1,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '采购订单', url: '/pages/purchase/order', icon:'/static/icon_4.png' },
							{ name: '采购入库', url: '/pages/purchase/laidup', icon:'/static/icon_5.png' },
							{ name: '应付账款', url: '/pages/purchase/bill', icon:'/static/icon_6.png' },
						]
					},
					{
						name: '库存',
						index: 2,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '即时库存', url: '/pages/stock/stock', icon:'/static/icon_7.png' },
						]
					},
					{
						name: '生产',
						index: 3,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '自制计划单', url: '/pages/produce/selfmade', icon:'/static/icon_8.png' },
							{ name: '委外加工单', url: '/pages/produce/entrust', icon:'/static/icon_9.png' }
						]
					}
				],
				fuctionList: [
					{
						name: '功能操作',
						index: 0,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '采购入库', url: '', icon:'/static/icon_3.png' },
							{ name: '销售出库', url: '', icon:'/static/icon_5.png' },
							{ name: '完工入库', url: '', icon:'/static/icon_6.png' },
							{ name: '审核待办', url: '', icon:'/static/icon_8.png' },
						]
					},
					{
						name: '销售出库',
						index: 1,
						stemp: false,
						url: '/pages/table/table?type=Receipt', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
					},
					{
						name: '完工入库',
						index: 2,
						stemp: false,
						url: '/pages/table/table?type=Receipt', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
					},
					{
						name: '审核待办',
						index: 3,
						stemp: false,
						url: '/pages/table/table?type=Receipt', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
					}
				],
				dataCheck: [
					{
						name: '数据考核',
						index: 0,
						stemp: false,
						url: '/pages/ranking/ranking', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '销售排名', url: '/pages/ranking/ranking', icon:'/static/data_1.png' },
							{ name: '客户获利', url: '/pages/interest/analyse', icon:'/static/data_2.png' },
							{ name: 'costdown', url: '/pages/costdown/costdown', icon:'/static/data_3.png' },
							{ name: '库存趋势', url: '/pages/trend/trend', icon:'/static/data_4.png' },
						]
					},
					{
						name: '客户获利',
						index: 1,
						stemp: false,
						url: '/pages/interest/analyse', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
					},
					{
						name: 'costdown',
						index: 2,
						stemp: false,
						url: '/pages/costdown/costdown', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
					},
					{
						name: '库存趋势',
						index: 3,
						stemp: false,
						url: '/pages/trend/trend', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
					}
				],
				shopList:[],
				shopid: '',
				shopname: ''
			}
		},
		computed: {
			...mapState(['forcedLogin', 'hasLogin', 'userName'])
		},
		onShow(){
			if(this.shopname){
				console.log(this.shopname)
			}
			this.shopname = uni.getStorageSync('shopname')

			// 变相可刷新今日播报各板块
			let flist = this.flist
			flist.forEach(item => {
				item.loaded = false
			});
			this.flist = flist

			// 提示去登录
			this.noticeToLogin()
			// 未登录不给过
			if(!uni.getStorageSync('token') && !uni.getStorageSync('shopid')) return

			if(uni.getStorageSync('token') && uni.getStorageSync('shopid')){ // 判断是否登录成功

				this.shopid = uni.getStorageSync('shopid')
				this.shopList = uni.getStorageSync('shopList')

				// 如果已经访问过
				if(this.navList[this.tabCurrentIndex].loaded) return
				// 接单请求
				this.getOrderInfo();
				
			} else {
				// 强制登录
				let url = '/pages/public/login';
				uni.redirectTo({
					url
				});
			}
		},
		async onLoad() {
			if(!uni.getStorageSync('token') && !uni.getStorageSync('shopid')){
				this.skeletonShow = false // 骨架屏 隐藏
			}
		},
		methods: {
			noticeToLogin(){
				if (!uni.getStorageSync('token') && !uni.getStorageSync('shopid')) {
					uni.showModal({
						title: '未登录',
						content: '您未登录，需要登录后才能继续体验小程序',
						/**
						 * 如果需要强制登录，不显示取消按钮
						 */
						showCancel: !this.forcedLogin,
						success: (res) => {
							if (res.confirm) {
								/**
								 * 如果需要强制登录，使用reLaunch方式
								 */
								if (this.forcedLogin) {
									uni.reLaunch({
										url: '../public/login'
									});
								} else {
									uni.navigateTo({
										url: '../public/login'
									});
								}
							}
						}
					});
					return true
				}
			},
			leftTabsClick(item){
				this.currentleftId = item.id
				this.clickType = item.id+''
			},
			//顶部tab点击
			tabClick(fitem,index) {
				// this.stocktype = (index + 1) + ''
				if(this.noticeToLogin()){
					console.log('未登录')
					return
				}
				this.tabCurrentIndex = index;
				switch (index) {
					case 0:
						this.currentType = "Receipt"
						if(fitem.loaded) return
						this.getOrderInfo()
						break;
					case 1:
						this.currentType = "Stock"
						if(fitem.loaded) return
						this.getngstockInfo()
						break;
					case 2:
						this.currentType = "Money"
						if(fitem.loaded) return
						this.getrecInfo()
						break;
					case 3:
						this.currentType = "Price"
						if(fitem.loaded) return
						this.getpriceInfo()
						break;
					case 4:
						this.currentType = "Delivery"
						if(fitem.loaded) return
						this.getoverdateInfo()
						break;
					case 5:
						this.currentType = "Produce"
						if(fitem.loaded) return
						// 与交期同一接口，取值为接口返回的第三个参数
						this.getoverdateInfo() 
						break;
				
					default:
						break;
				}
			},
			async	getOrderInfo(){
				// 初始接单接口
				const result = await this.$api.interfaceApi('getorder')({
					token: uni.getStorageSync('token'),
					shopid: uni.getStorageSync('shopid')
				});
				console.log(result,'接单')
				if (result.ret === 1) {
					this.skeletonShow = false // 骨架屏 隐藏
					this.$api.msg(result.erroinfo);
					this.navList[this.tabCurrentIndex].loaded = true
					// console.log(result.data)
					// util.convertDigital(parseFloat(result.data.todayamount))
					this.getorderData.todayamount = result.data.todayamount
					this.getorderData.last5amount = result.data.last5amount
					this.getorderData.lastmonthamount = result.data.lastmonthamount
				} else {
					this.$api.msg(result.erroinfo);
				}
			},
			async	getngstockInfo(){
				// 初始库存
				const result = await this.$api.interfaceApi('getngstock')({
					token: uni.getStorageSync('token'),
					shopid: uni.getStorageSync('shopid')
				});
				console.log(result,'库存')
				if (result.ret === 1) {
					this.$api.msg(result.erroinfo);
					this.navList[this.tabCurrentIndex].loaded = true
					// console.log(result.data)
					console.log(parseFloat(result.data.last30amount))
					this.getngstockData.last30amount = result.data.last30amount?parseFloat(result.data.last30amount).toFixed(2):'0'
					this.getngstockData.last60amount = result.data.last60amount?parseFloat(result.data.last60amount).toFixed(2):'0'
					this.getngstockData.last90amount = result.data.last90amount?parseFloat(result.data.last90amount).toFixed(2):'0'
				} else {
					this.$api.msg(result.erroinfo);
				}
			},
			async	getrecInfo(){
				// 初始收款
				const result = await this.$api.interfaceApi('getrec')({
					token: uni.getStorageSync('token'),
					shopid: uni.getStorageSync('shopid')
				});
				console.log(result,'收款')
				if (result.ret === 1) {
					this.navList[this.tabCurrentIndex].loaded = true
					// console.log(result.data)
					this.getrecData.payamount = result.data.payamount?parseFloat(result.data.payamount).toFixed(2):'0'
					this.getrecData.recamount = result.data.recamount?parseFloat(result.data.recamount).toFixed(2):'0'
				} else {
					this.$api.msg(result.erroinfo);
				}
			},
			async	getpriceInfo(){
				// 初始价格波动
				const result = await this.$api.interfaceApi('getprice')({
					token: uni.getStorageSync('token'),
					shopid: uni.getStorageSync('shopid')
				});
				console.log(result,'价格')
				if (result.ret === 1) {
					this.navList[this.tabCurrentIndex].loaded = true
					this.priceData.totalcount = result.data.result[0].totalcount?parseFloat(result.data.result[0].totalcount).toFixed(2):'0'
					// util.round(parseFloat(result.data.result[0].totalcount), result.data.result[0].totalcount.split('.')[1].length)
				} else {
					this.$api.msg(result.erroinfo);
				}
			},
			async	getoverdateInfo(){
				// 初始交期
				const result = await this.$api.interfaceApi('getoverdate')({
					token: uni.getStorageSync('token'),
					shopid: uni.getStorageSync('shopid')
				});
				// console.log(result,'交期')
				if (result.ret === 1) {
					this.navList[this.tabCurrentIndex].loaded = true
					this.deliveryData.totalpurcount = parseFloat(result.data.totalpurcount).toFixed(2)
					this.deliveryData.totalsalecount = parseFloat(result.data.totalsalecount).toFixed(2)
					this.deliveryData.totalworkcount = parseFloat(result.data.totalworkcount).toFixed(2)
				} else {
					this.$api.msg(result.erroinfo);
				}
			},
			loginout(){
				let that = this;
				uni.showModal({
					content: '确定退出登录？',
					confirmColor:'#EF8200',
					success: function (res) {
						if (res.confirm) {
							uni.setStorageSync('token', '');
							uni.setStorageSync('shopid', '');
							uni.setStorageSync('shopname', '');
							// 隐藏 Toast
							that.toggleSpec();
							uni.redirectTo({
								url:'/pages/public/login'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			selectShop(item){
				// 切换店铺 更改shopid
				uni.setStorageSync('shopid', item.shopid);
				// 重新刷新首页接单等的数据
				this.getOrderInfo()

				// uni.navigateTo({
				// 	url:'/pages/shop/shop'
				// });
			},
			//阻止穿透滑动
			stopPrevent() {},
			//规格弹窗开关
			toggleSpec() {
				if(this.noticeToLogin()){
					console.log('未登录')
					return
				}
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			// 跳转链接
			navTo(url){
				var url = url + '?type=' + this.currentType
				uni.navigateTo({
					url
				});
			},
			// 跳转链接
			navTo2(url){
				if(this.noticeToLogin()){
					console.log('未登录')
					return
				}
				if(!url){
					this.$api.msg('开发中，敬请期待~')
					return
				}
				uni.navigateTo({
					url
				});
			},
			tabtap(fitem, index){
				if(this.noticeToLogin()){
					console.log('未登录')
					return
				}
				// 设置当前 tab id 
				this.currentId = fitem.id
				switch (index) {
					case 0:
						this.currentType = "Receipt"
						console.log(fitem)
						if(fitem.loaded) return
						this.getOrderInfo()
						break;
					case 1:
						this.currentType = "Stock"
						console.log(fitem)
						if(fitem.loaded) return
						this.getngstockInfo()
						break;
					case 2:
						this.currentType = "Money"
						if(fitem.loaded) return
						this.getrecInfo()
						break;
					case 3:
						this.currentType = "Price"
						if(fitem.loaded) return
						this.getpriceInfo()
						break;
					case 4:
						this.currentType = "Delivery"
						if(fitem.loaded) return
						this.getoverdateInfo()
						break;
					case 5:
						this.currentType = "Produce"
						if(fitem.loaded) return
						// 与交期同一接口，取值为接口返回的第三个参数
						this.getoverdateInfo() 
						break;
				
					default:
						break;
				}
			},
			clickDownGo(type, index, url){
				if(this.noticeToLogin()){
					console.log('未登录')
					return
				}
				switch(type){
					case '1':
						if(url){// 说明只有一级菜单
							uni.navigateTo({
								url
							});
						} else {
							// 如果已经打开
							if(this.reportManagement[index].stemp){
								this.reportManagement[index].stemp = false
								return
							}
							// 遍历循环
							this.reportManagement.map( (item)=>{
								if( index==item.index ){
									item.stemp = true
								} else{
									item.stemp = false
								}
								return item
							})
						}
						break;
					case '2':
						this.$api.msg('开发中，敬请期待~')
						return
						if(url){// 说明只有一级菜单
							uni.navigateTo({
								url
							});
						} else {
							// 如果已经打开
							if(this.fuctionList[index].stemp){
								this.fuctionList[index].stemp = false
								return
							}
							// 遍历循环
							this.fuctionList.map( (item)=>{
								if( index==item.index ){
									item.stemp = true
								} else{
									item.stemp = false
								}
								return item
							})
						}
						break;
					case '3':
						if(url){// 说明只有一级菜单
							uni.navigateTo({
								url
							});
						} else {
							// 如果已经打开
							if(this.dataCheck[index].stemp){
								this.dataCheck[index].stemp = false
								return
							}
							// 遍历循环
							this.dataCheck.map( (item)=>{
								if( index==item.index ){
									item.stemp = true
								} else{
									item.stemp = false
								}
								return item
							})
						}
						break;

					default:
				}
				
			}
		}
	}
</script>

<style lang="scss">
page{
	height: 100%;
}
view {
	box-sizing: border-box;
}

/* 规格选择弹窗 */
.attr-content {
	padding: 0;
	.a-t {
		display: flex;
		image {
			width: 170upx;
			height: 170upx;
			flex-shrink: 0;
			margin-top: -40upx;
			border-radius: 8upx;
		}
		.right {
			display: flex;
			flex-direction: column;
			padding-left: 24upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
			line-height: 42upx;
			.price {
				font-size: $font-lg;
				color: $uni-color-primary;
				margin-bottom: 10upx;
			}
			.selected-text {
				margin-right: 10upx;
			}
		}
	}
	.common-box {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30upx;
		height: 110upx;
		background: #fff;
		.image {
			width: 48upx;
			height: 48upx;
			position: absolute;
			right: 30upx;
			top: 12upx;
		}
	}
	.select-title {
		color: #333;
		font-size: 32upx;
		position: relative;
		height: 110upx;
		.close{
			font-size: 32upx;
			color: #666666;
			position: absolute;
			right: 32upx;
			top: 32upx;
		}
	}
	.content-list{
		background: #fff;
		border-top: 1rpx solid #E5E5E5;
		font-size: 36upx;
		.item {
			height: 110upx;
			line-height: 114upx;
			border-bottom: 1upx solid #f5f5f5;
			text-align: center;
		}
		.item.active{
			color: $base-color;
		}
		.item:last-child{
			border-bottom: 0;
		}
	}
	.no-login {
		color: red;
		margin-top: 10upx;
	}
}
	.main-box {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		.data-news {
			flex: 1;
			display: flex;
			background: #F5F5F5;
			width: 100%;
			padding-top: 20upx;
			overflow: hidden;
		}
		.news-notice-view{
			background: #fff;
			.navbar {
				display: flex;
				height: 40px;
				padding: 0 5px;
				background: #fff;
				box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
				position: relative;
				z-index: 10;
				padding-bottom: 18upx;
				.nav-item {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					font-size: 28upx;
					color: $font-color-dark;
					position: relative;
					&.current {
						color: $base-color;
						&:after {
							content: '';
							width: 50%;
							height: 6upx;
							border-radius: 20upx;
							background: $base-color;
							position: absolute;
							left: 50%;
							bottom: 0;
							transform: translateX(-50%);
							// width: 44px;
							// height: 0;
							// border-bottom: 2px solid $base-color;
						}
					}
				}
			}

			.news-view{
				height: 340upx;
				display: flex;
				align-items: center;
				position: relative;
				color: #fff;
				.banner{
					width: 100%;
					height: 340upx;
				}
				.absolute-view{
					position: absolute;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					font-size: 26upx;
				}

				.news-box{
					// height: 100%;
					padding: 0 40upx;
					.font-color{
						font-size: 28upx;
						color: $base-color;
					}
				}
				.boss {
					font-size: 32upx;
					margin-bottom: 30upx;
				}
				.notice {
					margin-top: 20upx;
				}
				.select-company{
					position: absolute;
					top: 20upx;
					right: 30upx;
					font-size: 26upx;
					height: 54upx;
					border-radius: 32upx;
					background: #18559E;
					color: #fff;
					display: flex;
					align-items: center;
					padding: 0 20upx;

					overflow: hidden;
					.flex-box{
						max-width: 180upx;
						overflow:hidden;
						word-break:break-all;
						display:-webkit-box;
						-webkit-line-clamp:1;
						-webkit-box-orient:vertical;
					}
					
					.image {
						width: 28upx;
						height: 28upx;
						margin-left: 10upx;
					}
				}
			}
		}

		.left-view {
			width: 180upx;
			background: #fff;
			.f-item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 122upx;
				font-size: 28upx;
				color: #333333;
				position: relative;
				&.active {
					// background: rgba( 00, 00, 00, .2);
					background:rgba(239,130,0,0.06);
					color: $base-color;
					&:before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						height: 100%;
						width: 8upx;
						background-color: $base-color;
						border-radius: 0 4px 4px 0;
						// opacity: 0.8;
					}
				}
			}
		}
		.right-view {
			flex: 1;
			padding: 0 30upx;
			font-size: 26upx;
			color: #fff;
			height: 100%;
			position: relative;
			overflow-y: scroll;
			.lalala{
				position: relative;
				width: 100%;
				height: 100%;
				overflow: hidden;
			}
			.fang-list-box{
				background: #fff;
				border-radius: 12upx;
				margin-bottom: 24upx;
				.title{
					font-size: 28upx;
					color: #333;
					padding: 20upx;
					font-weight: 600;
				}
				.item-list{
					display: grid;
					grid-template-columns:repeat(3,1fr); //等分几修改
					grid-gap:10px;
					padding: 20upx;
					.item{
						color: #333;
						text-align: center;
						font-size: 24upx;
						image{
							width: 60upx;
							height: 60upx;
						}
					}
				}
			}
		}
	}

	.fuction-box{
		padding: 40upx 30UPx 0;
		display: flex;
		.item-list-box {
			min-height: 480upx;
			flex: 1;
			margin-right: 20upx;
			overflow: hidden;
			.blue-view {
				width: 100%;
				height: 90upx;
				line-height: 90upx;
				border-radius: 10upx;
				background: #1775E6;
				text-align: center;
				font-size: 30upx;
				color: #fff;
			}
			.item-box {
				border-radius: 10upx;
				border: 2upx solid #1775E6;
				position: relative;
				margin-top: -20upx;
				.item-btn{
					.item-btn-title{
						font-size: 28upx;
						height: 66upx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						margin: 20upx 20upx 0 20upx;
						border-radius: 10upx;
						background: #537093;
					}
					
					.item-child{
						.item{
							font-size: 26upx;
							color: #333;
							margin-top: 20upx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
				.item-btn:first-child .item-btn-title{
					margin-top: 40upx;
				}
				.item-btn:last-child .item-btn-title{
					margin-bottom: 20upx;
				}
				.item-btn:last-child .item:last-child{
					padding-bottom: 20upx;
				}
			}
			
		}
		.item-list-box:last-child{
			margin-right: 0upx;
		}
	}
</style>
