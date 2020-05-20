<template>
	<view class="main-box tui-skeleton">
		<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>
		<!-- @click="navTo('/pages/public/login')" -->
		<view class="data-news tui-skeleton-rect">
			<view class="left-view">
				<view v-for="(fitem, index) in flist" :key="fitem.id" class="f-item b-b" :class="{ active: fitem.id === currentId }" @click="tabtap(fitem, index)">{{ fitem.label }}</view>
			</view>
			<!-- @click="navTo(`/pages/table/table`)" -->
			<view class="right-view">
				<view class="news-box" v-if="currentType=='Receipt'" 
				@click.stop="navTo2(`/pages/sale/indexOrder?todayamount=`+getorderData.todayamount+'&last5amount='+getorderData.last5amount+'&lastmonthamount='+getorderData.lastmonthamount)">
					<view class="boss">BOSS:</view>
					<view class="notice">恭喜你今天又接了{{getorderData.todayamount}}元订单</view>
					<view class="notice">近五日接了{{getorderData.last5amount}}元订单</view>
					<view class="notice">近一个月接了{{getorderData.lastmonthamount}}元订单</view>
				</view>
				<view class="news-box" v-if="currentType=='Stock'" @click.stop="navTo2('/pages/stock/indexStock?todayamount='+getngstockData.last30amount+'&last5amount='+getngstockData.last60amount+'&lastmonthamount='+getngstockData.last90amount)">
					<view class="boss">BOSS:</view>
					<view class="notice">公司久滞库存30天以上{{getngstockData.last30amount}}元</view>
					<view class="notice">60天以上{{getngstockData.last60amount}}元</view>
					<view class="notice">90天以上{{getngstockData.last90amount}}元</view>
				</view>
				<view class="news-box" v-if="currentType=='Money'" @click.stop="navTo2('/pages/main/receipt?payamount='+getrecData.payamount+'&recamount='+getrecData.recamount)">
					<view class="boss">BOSS:</view>
					<view class="notice">你的过期应收款是{{getrecData.payamount}}元</view>
					<view class="notice">逾期付款{{getrecData.recamount}}元</view>
				</view>
				<view class="news-box" v-if="currentType=='Price'" @click.stop="navTo2('/pages/main/priceList?totalcount='+priceData.totalcount)">
					<view class="boss">BOSS:</view>
					<view class="notice">你的价格最大波动率为{{priceData.totalcount}}%</view>
					<view class="notice">请点开核实一下呀！</view>
				</view>
				<view class="news-box" v-if="currentType=='Delivery'" @click.stop="navTo2('/pages/main/delivery?totalsalecount='+deliveryData.totalsalecount+'&totalpurcount='+deliveryData.totalpurcount)">
					<view class="boss">BOSS:</view>
					<view class="notice">你的超过交期的销售订单是{{deliveryData.totalsalecount}}元</view>
					<view class="notice">超过交期的采购订单{{deliveryData.totalpurcount}}元</view>
					<view class="notice">是否忘记出入库还是真的超交期？</view>
				</view>
				<view class="news-box" v-if="currentType=='Produce'" @click.stop="navTo2('/pages/main/order?totalworkcount='+deliveryData.totalworkcount)">
					<view class="boss">BOSS:</view>
					<view class="notice">你的超过交期的生产订单有{{deliveryData.totalworkcount}}条</view>
					<view class="notice">是否忘记入库还是真的超交期？</view>
				</view>

				<view class="select-company" @click.stop="toggleSpec()">
					<view class="flex-box">
						{{shopname}}
					</view>
					<image class="image" src="/static/la.png" />
				</view>
			</view>
		</view>

		<!-- 数据管理 -->
		<view class="fuction-box">
			<view class="item-list-box">
				<view class="blue-view tui-skeleton-fillet">报表管理</view>
				<view class="item-box">
					<view class="item-btn" v-for="(itemf, index) in reportManagement" :key="itemf.index">
						<view class="item-btn-title tui-skeleton-fillet" @click="clickDownGo('1', itemf.index, itemf.url)">
							<text>{{itemf.name}}</text>
							<!-- <text class="yticon icon-you"></text> -->
						</view>
				
						<view class="item-child" v-if="itemf.stemp">
							<view class="item"  v-for="(itemc, index) in itemf.child" :key="index" @click="navTo(itemc.url)">
								<text>{{itemc.name}}</text>
								<text class="yticon icon-you"></text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="item-list-box">
				<view class="blue-view tui-skeleton-fillet">功能操作</view>
				<view class="item-box">
					<view class="item-btn" v-for="(itemf, index) in fuctionList" :key="itemf.index">
						<view class="item-btn-title tui-skeleton-fillet" @click="clickDownGo('2', itemf.index, itemfurl)">
							<text>{{itemf.name}}</text>
							<!-- <text class="yticon icon-you"></text> -->
						</view>
				
						<view class="item-child" v-if="itemf.stemp">
							<view class="item"  v-for="(itemc, index) in itemf.child" :key="index">
								<text>{{itemc.name}}</text>
								<text class="yticon icon-you"></text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="item-list-box">
				<view class="blue-view tui-skeleton-fillet">数据考核</view>
				<view class="item-box">
					<view class="item-btn" v-for="(itemf, index) in dataCheck" :key="itemf.index">
						<view class="item-btn-title tui-skeleton-fillet" @click="clickDownGo('3', itemf.index, itemf.url)">
							<text>{{itemf.name}}</text>
							<!-- <text class="yticon icon-you"></text> -->
						</view>
				
						<view class="item-child" v-if="itemf.stemp">
							<view class="item"  v-for="(itemc, index) in itemf.child" :key="index">
								<text>{{itemc.name}}</text>
								<text class="yticon icon-you"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" style="width:100%;" @click.stop="stopPrevent">
				<view class="common-box select-title">
					<text>请选择店铺</text>
					<image @click="toggleSpec" class="image" src="/static/delete.png" />
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
				skeletonShow: true,
				currentType: 'Receipt',
				specClass: 'none',
				getorderData:{
					todayamount:'0',
					last5amount:'0',
					lastmonthamount:'0',
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
				flist: [ // 今日播报，菜单选项
					{ id:1, label: '接单', loaded: false },
					{ id:2, label: '库存', loaded: false },
					{ id:3, label: '收款', loaded: false },
					{ id:4, label: '价格', loaded: false },
					{ id:5, label: '交期', loaded: false },
					{ id:6, label: '生产', loaded: false }
				],
				currentId: 1,//当前一级id
				reportManagement: [
					{
						name: '销售',
						index: 0,
						stemp: false,
						url: '', // 如果如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '销售订单', url: '/pages/sale/order' },
							{ name: '销售出库', url: '/pages/sale/checkout' },
							{ name: '应收帐数', url: '/pages/sale/bill' },
						]
					},
					{
						name: '采购',
						index: 1,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '采购订单', url: '/pages/purchase/order' },
							{ name: '采购入库', url: '/pages/purchase/laidup' },
							{ name: '应收账款', url: '/pages/purchase/bill' },
						]
					},
					{
						name: '库存',
						index: 2,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '即时库存', url: '/pages/stock/stock' },
						]
					},
					{
						name: '生产',
						index: 3,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: [
							{ name: '自制计划单', url: '/pages/produce/selfmade' },
							{ name: '委外计划单', url: '/pages/produce/entrust' }
						]
					}
				],
				fuctionList: [
					{
						name: '采购入库',
						index: 0,
						stemp: false,
						url: '', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
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
						name: '销售排名',
						index: 0,
						stemp: false,
						url: '/pages/ranking/ranking', // 如果有二级nav菜单,url为空；否则填写跳转页面
						child: []
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
		},
		async onLoad() {
			// if (this.hasLogin) {
			// 	uni.showModal({
			// 		title: '未登录',
			// 		content: '您未登录，需要登录后才能继续',
			// 		/**
			// 		 * 如果需要强制登录，不显示取消按钮
			// 		 */
			// 		showCancel: !this.forcedLogin,
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				/**
			// 				 * 如果需要强制登录，使用reLaunch方式
			// 				 */
			// 				if (this.forcedLogin) {
			// 					uni.reLaunch({
			// 						url: '../public/login'
			// 					});
			// 				} else {
			// 					uni.navigateTo({
			// 						url: '../public/login'
			// 					});
			// 				}
			// 			}
			// 		}
			// 	});
			// }

			if(uni.getStorageSync('token') && uni.getStorageSync('shopid')){ // 判断是否登录成功
				// 接单请求
				this.getOrderInfo();

				this.shopid = uni.getStorageSync('shopid')
				this.shopList = uni.getStorageSync('shopList')
			} else {
				// 强制登录
				let url = '/pages/public/login';
				uni.redirectTo({
					url
				});
			}
		},
		methods: {
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
					this.flist[this.currentId-1].loaded = true
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
					this.flist[this.currentId-1].loaded = true
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
					this.flist[this.currentId-1].loaded = true
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
					this.flist[this.currentId-1].loaded = true
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
					this.flist[this.currentId-1].loaded = true
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
					success: function (res) {
						if (res.confirm) {
							uni.setStorageSync('token', '');
							uni.setStorageSync('shopid', '');
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
				console.log(url)
				uni.navigateTo({
					url
				});
			},
			tabtap(fitem, index){
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
		height: 90upx;
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
		position: relative;
		height: 110upx;
	}
	.content-list{
		padding: 0 20upx;
		margin-top: 10upx;
		background: #fff;
		.item {
			height: 86upx;
			line-height: 86upx;
			border-bottom: 1upx solid #f5f5f5;
			text-align: center;
		}
		.item.active{
			color: #1775E6;
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
		.data-news {
			display: flex;
			background: #1775E6;
			width: 100%;
		}
		.left-view {
			width: 180upx;
			.f-item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 78upx;
				font-size: 28upx;
				color: #fff;
				position: relative;
				&.active {
					background: rgba( 00, 00, 00, .2);
					&:before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						height: 36upx;
						width: 8upx;
						background-color: #fff;
						border-radius: 0 4px 4px 0;
						opacity: 0.8;
					}
				}
			}
		}
		.right-view {
			flex: 1;
			padding: 20upx 30upx;
			font-size: 26upx;
			border-left: 2upx solid #999;
			color: #fff;
			position: relative;
			.news-box{
				height: 100%;
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

				height: 60upx;
				border-radius: 12upx;
				background: #18559E;
				color: #fff;
				display: flex;
				align-items: center;
				padding: 0 20upx;
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
