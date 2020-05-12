<template>
	<view class="main-box">
		<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>
		<!-- @click="navTo('/pages/public/login')" -->
		<view class="data-news">
			<view class="left-view">
				<view v-for="(fitem, index) in flist" :key="fitem.id" class="f-item b-b" :class="{ active: fitem.id === currentId }" @click="tabtap(fitem, index)">{{ fitem.label }}</view>
			</view>
			<view class="right-view" @click="navTo(`/pages/table/table`)">
				<view class="" v-if="currentType=='Receipt'">
					<view class="boss">BOSS:</view>
					<view class="notice">恭喜你今天又接了0.00元订单</view>
					<view class="notice">近五日接了0.00元订单</view>
					<view class="notice">近一个月接了0.00元订单</view>
				</view>
				<view class="" v-if="currentType=='Stock'">
					<view class="boss">BOSS:</view>
					<view class="notice">公司久滞库存30天以上0.00元</view>
					<view class="notice">60天以上0.00元</view>
					<view class="notice">90天以上0.00元</view>
				</view>
				<view class="" v-if="currentType=='Money'">
					<view class="boss">BOSS:</view>
					<view class="notice">你的过期应收款是0.00元</view>
					<view class="notice">逾期付款0.00元</view>
				</view>
				<view class="" v-if="currentType=='Price'">
					<view class="boss">BOSS:</view>
					<view class="notice">你的价格波动超过5%的有0条</view>
					<view class="notice">请点开核实一下呀！</view>
				</view>
				<view class="" v-if="currentType=='Delivery'">
					<view class="boss">BOSS:</view>
					<view class="notice">你的超过交期的销售订单是0.00元</view>
					<view class="notice">超过交期的采购订单0.00元</view>
					<view class="notice">是否忘记出入库还是真的超交期？</view>
				</view>
				<view class="" v-if="currentType=='Produce'">
					<view class="boss">BOSS:</view>
					<view class="notice">你的超过交期的生产订单有0条</view>
					<view class="notice">是否忘记入库还是真的超交期？</view>
				</view>

				<view class="select-company"  @click.stop="toggleSpec()">
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
				<view class="blue-view">报表管理</view>
				<view class="item-box">
					<view class="item-btn" v-for="(itemf, index) in reportManagement" :key="itemf.index">
						<view class="item-btn-title" @click="clickDownGo('1', itemf.index, itemf.url)">
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
				<view class="blue-view">功能操作</view>
				<view class="item-box">
					<view class="item-btn" v-for="(itemf, index) in fuctionList" :key="itemf.index">
						<view class="item-btn-title" @click="clickDownGo('2', itemf.index, itemfurl)">
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
				<view class="blue-view">数据考核</view>
				<view class="item-box">
					<view class="item-btn" v-for="(itemf, index) in dataCheck" :key="itemf.index">
						<view class="item-btn-title" @click="clickDownGo('3', itemf.index, itemf.url)">
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
	import {
		mapState
	} from 'vuex'

	export default {
		data(){
			return {
				skeletonShow: true,
				currentType: 'Receipt',
				specClass: 'none',
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
							{ name: '采购入库', url: '/pages/purchase/laiup' },
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
		},
		async onLoad() {
			setTimeout(() => {
				this.skeletonShow = false
			}, 1800);
			
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
					this.flist[this.currentId].loaded = true
					console.log(result.data)
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
					console.log(result.data)
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
					console.log(result.data)
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
					console.log(result.data)
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
				console.log(result,'交期')
				if (result.ret === 1) {
					console.log(result.data)
				} else {
					this.$api.msg(result.erroinfo);
				}
			},
			loginout(){
				uni.showModal({
					content: '确定退出登录？',
					success: function (res) {
						if (res.confirm) {
							uni.setStorageSync('token', '');
							uni.setStorageSync('shopid', '');
							// 隐藏 Toast
							this.toggleSpec();
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
			tabtap(fitem, index){
				
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

						break;
				
					default:
						break;
				}
				// 设置当前 tab id 
				this.currentId = fitem.id
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
