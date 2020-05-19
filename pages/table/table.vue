<template>
	<view class="table-box" style="background:#fff;">
		<view class="notice-text" v-if="tableType =='Receipt'">今天接了<text class="red">0.00</text>万元订单，近5日接了<text class="red">0.00</text>万订单，近一个月0</view>
		<view class="notice-text" v-else-if="tableType =='Stock'">公司久滞留库存30天以上<text class="red">0.00</text>万元，60以上<text class="red">0.00</text>万元，90天以上<text class="red">0.00</text>万元</view>
		<view class="notice-text" v-else-if="tableType =='Money'">过期应收款是<text class="red">0.00</text>万元，逾期付款<text class="red">0.00</text>万元</view>
		<view class="notice-text" v-else-if="tableType =='Price'">你的价格波动<text class="red">0.00</text>%</view>
		<view class="notice-text" v-else-if="tableType =='Delivery'">
			你的超过交期的订单是<text class="red">0.00</text>万元，超过交期的采购订单<text class="red">0.00</text>万元，是否忘入库还是真的超交期？
		</view>
		<view class="notice-text" v-else-if="tableType =='Produce'">你超过的交期生产订单是<text class="red">0.00</text>，是否忘记入库还是真的超交期？</view>
    <!-- 接单的时间组件 -->
		<!-- <view class="data-box" @click="open">
			<view class="firstTime">{{startDate}}</view>
			<image class="image" src="/static/xiala.png" />
		</view> -->
		<!-- 价格 选择 -->
		<view class="btn-box" v-if="commomType=='Price'||commomType=='PriceSupplier'">
			<view class="commomStyle left" :class="commomType=='Price'?'active':''" @click="changePriceType(1)">客户</view>
			<view class="commomStyle right" :class="commomType=='Price'?'':'active'" @click="changePriceType(2)">供应商</view>
		</view>
		<!-- 交期 选择 -->
		<view class="btn-box" v-if="commomType=='Delivery'||commomType=='DeliverySupplier'">
			<view class="commomStyle left" :class="commomType=='Delivery'?'active':''" @click="changeDeliveryType(1)">客户</view>
			<view class="commomStyle right" :class="commomType=='Delivery'?'':'active'" @click="changeDeliveryType(2)">供应商</view>
		</view>
		
		<view class="table">
			<!-- <z-table
			  :textAlign="selectContent[nowType].textAlign" 
				:titleTextAlign="selectContent[nowType].titleTextAlign" 
				:tableData="nowData" 
				:columns="nowColumn" 
				@onSort="doSort" 
				:stickSide="selectContent[nowType].stickSide" 
				:showBottomSum="selectContent[nowType].showBottomSum" 
				:showLoading="false" 
				:emptyText='selectContent[nowType].emptyText'
				:tableHeight='selectContent[nowType].tableHeight' 
				@onClick="rowClick" :singleSelect="singleSelect" 
				:showSelect="selectContent[nowType].showSelect" 
				@onSelect="tableSelect">
			</z-table> -->
			<z-table :tableData="allTableData[commomType+'TableData']" :columns="allTableData[commomType+'Columns']" stickSide='true'></z-table>
		</view>

		<uni-calendar ref="calendar" 
		:date="info.date" 
		:insert="info.insert" 
		:lunar="info.lunar" 
		:startDate="info.startDate" 
		:endDate="info.endDate" 
		:range="info.range" 
		@confirm="confirm" />

  </view>
</template>
<script>
import zTable from "../../components/z-table/z-table.vue";
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
export default {
    components: {
			zTable,
			uniCalendar
    },
  data(){
    return{
			startDate: '2020-5-10',
			info: {
				date: '',
				startDate: '',
				endDate: '',
				lunar: true,
				range: false,
				insert: false,
				selected: []
			},
			commomType: '',
			tableType: '',
			// 固定左侧
			allTableData:{
				TableData:[], // 占位
				Columns:[], // 占位

				//  接单
				ReceiptColumns: [{
					title: "客户",
					key: "custname",
					width: 100
				}, {
					title: "日期",
					key: "billdate",
					width: 250
				}, {
					title: "业务员",
					key: "username",
					width: 100
				}, {
					title: "订单号",
					key: "custbillcode",
					width: 200
				}, {
					title: "物料编码",
					key: "prodcode",
					width: 200
				}, {
					title: "商品名称",
					key: "prodname",
					width: 200
				}, {
					title: "订单数量",
					key: "prodcount",
					width: 200
				}, {
					title: "销售价格",
					key: "prodprice",
					width: 200
				}, {
					title: "订单金额",
					key: "amounttax",
					width: 200
				}],
				ReceiptTableData: [
					// {
					// 	custname: "秦天明",
					// 	billdate: "2020-04-28",
					// 	username: "张坤",
					// 	custbillcode: '454155',
					// 	prodcode: "20201122",
					// 	prodname: "西瓜",
					// 	prodcount: "123456",
					// 	num_10: "2000",
					// 	amounttax: "1000.00",
					// 	aaaaa: '55666'
					// }
				],

				// 库存
				StockColumns: [{
					title: "物料编码",
					key: "prodno",
					width: 200
				}, {
					title: "商品名称",
					key: "prodname",
					width: 200
				}, {
					title: "库存数量",
					key: "curstock",
					width: 200
				}, {
					title: "30天以上金额",
					key: "itemdiscountamount",
					width: 200
				}, {
					title: "60天以上金额",
					key: "itemdiscountamount",
					width: 200
				}, {
					title: "90天以上金额",
					key: "itemdiscountamount",
					width: 200
				}],
				StockTableData: [],

				// 收款
				MoneyColumns2: [{
					title: "客户名称",
					key: "custname",
					width: 140
				}, {
					title: "本期应收余额",
					key: "num_10-getamount",
					width: 200
				}, {
					title: "当期逾期款",
					key: "getamount",
					width: 200
				}],
				MoneyTableData: [],
				MoneyColumns: [{
					title: "供应商名称",
					key: "custname",
					width: 200
				}, {
					title: "本期应付余额",
					key: "num_10",
					width: 200
				}, {
					title: "当期逾期款",
					key: "num_10-getamount",
					width: 200
				}],
				
				// 价格-客户
				PriceColumns: [{
					title: "客户",
					key: "custname",
					width: 120
				}, {
					title: "日期",
					key: "billdate",
					width: 200
				}, {
					title: "业务员",
					key: "username",
					width: 150
				}, {
					title: "订单号",
					key: "custbillcode",
					width: 200
				}, {
					title: "物料编码",
					key: "prodno",
					width: 200
				}, {
					title: "商品名称",
					key: "prodname",
					width: 240
				}, {
					title: "订单数量",
					key: "prodcount",
					width: 120
				}, {
					title: "销售价格",
					key: "mallprice",
					width: 180
				}, {
					title: "近期均价", ///  --------------------
					key: "dataprice",
					width: 150
				}, {
					title: "波动比例",
					key: "proportion",
					width: 150
				}],
				PriceTableData: [],

				// 价格-供应商
				PriceSupplierColumns: [{
					title: "供应商",
					key: "name",
					width: 120
				}, {
					title: "日期",
					key: "time",
					width: 200
				}, {
					title: "采购员",
					key: "people",
					width: 150
				}, {
					title: "订单号",
					key: "ordercode",
					width: 200
				}, {
					title: "物料编码",
					key: "wucode",
					width: 200
				}, {
					title: "商品名称",
					key: "shopname",
					width: 240
				}, {
					title: "订单数量",
					key: "ordernum",
					width: 120
				}, {
					title: "销售价格",
					key: "mallprice",
					width: 180
				}, {
					title: "近期均价",
					key: "dataprice",
					width: 150
				}, {
					title: "波动比例",
					key: "proportion",
					width: 150
				}],
				PriceSupplierTableData: [
					// {
					// 	name: "张三",
					// 	time: "2020-05-01",
					// 	people: "张三丰",
					// 	ordercode: '12345678',
					// 	wucode: "123456789",
					// 	shopname: "高帮特步青少年布鞋",
					// 	ordernum: "9999",
					// 	mallprice: "9999",
					// 	dataprice: "9999",
					// 	proportion: "100%",
					// }
				],

				// 交期-客户
				DeliveryColumns: [{
					title: "客户",
					key: "name",
					width: 120
				}, {
					title: "日期",
					key: "time",
					width: 200
				}, {
					title: "业务员",
					key: "people",
					width: 150
				}, {
					title: "订单号",
					key: "ordercode",
					width: 200
				}, {
					title: "物料编码",
					key: "wucode",
					width: 200
				}, {
					title: "商品名称",
					key: "shopname",
					width: 240
				}, {
					title: "订单数量",
					key: "ordernum",
					width: 120
				}, {
					title: "销售价格",
					key: "mallprice",
					width: 180
				}, {
					title: "订单金额",
					key: "dataprice",
					width: 150
				}, {
					title: "超过交期天数",
					key: "proportion",
					width: 200
				}],
				DeliveryTableData: [],


				// 交期-供应商
				DeliverySupplierColumns: [{
					title: "供应商",
					key: "name",
					width: 120
				}, {
					title: "日期",
					key: "time",
					width: 200
				}, {
					title: "采购员",
					key: "people",
					width: 150
				}, {
					title: "订单号",
					key: "ordercode",
					width: 200
				}, {
					title: "物料编码",
					key: "wucode",
					width: 200
				}, {
					title: "商品名称",
					key: "shopname",
					width: 240
				}, {
					title: "订单数量",
					key: "ordernum",
					width: 120
				}, {
					title: "采购价格",
					key: "mallprice",
					width: 180
				}, {
					title: "订单金额",
					key: "dataprice",
					width: 150
				}, {
					title: "超过交期天数",
					key: "proportion",
					width: 200
				}],
				DeliverySupplierTableData: [{
					name: "张三",
					time: "2020-05-01",
					people: "张三丰",
					ordercode: '12345678',
					wucode: "123456789",
					shopname: "高帮特步青少年布鞋",
					ordernum: "9999",
					mallprice: "9999",
					dataprice: "9999",
					proportion: "100%",
				}],
				// 生产
				ProduceColumns: [{
					title: "生产订单",
					key: "name",
					width: 200
				}, {
					title: "日期",
					key: "time",
					width: 200
				}, {
					title: "物料编码",
					key: "wucode",
					width: 200
				}, {
					title: "商品名称",
					key: "shopname",
					width: 240
				}, {
					title: "生产数量",
					key: "ordernum",
					width: 150
				}, {
					title: "超过交期天数",
					key: "proportion",
					width: 100
				}],
				ProduceTableData: [{
					name: "12345678",
					time: "2020-05-01",
					wucode: "123456789",
					shopname: "高帮特步青少年布鞋",
					ordernum: "9999",
					proportion: "10",
				},{
					name: "12345678",
					time: "2020-05-01",
					wucode: "123456789",
					shopname: "高帮特步青少年布鞋",
					ordernum: "9999",
					proportion: "10",
				},{
					name: "12345678",
					time: "2020-05-01",
					wucode: "123456789",
					shopname: "高帮特步青少年布鞋",
					ordernum: "9999",
					proportion: "10",
				}]
			},
			
    }
  },
	onLoad(options){
		//今天的时间
		let day2 = new Date();
		if(day2.getMonth()+1<10){
			var Month = '0'+(day2.getMonth()+1)
		}else{
      var Month = (day2.getMonth()+1)
		}
		if(day2.getDate()<10){
			var date = '0'+day2.getDate()
		}else{
      var date = day2.getDate()
		}
		var today = day2.getFullYear()+"-" + Month + "-" + date;
		this.startDate = today
		console.log(this.startDate)


		console.log(options)
		this.tableType = options.type
		this.commomType = options.type
		switch (options.type) {
			case 'Receipt':
				var title = '接单'
				this.getTableData(today)
				break;
			case "Stock":
				var title = '库存'
				this.getngstocklist(today)
				break;
			case "Money":
				var title = '收款'
				this.getreclist(today)
				break;
			case "Price":
				var title = '价格'
				this.getpricelist(today)
				break;
			case "Delivery":
				var title = '交期'
				this.getoverdatelist(today)
				break;
			case "Produce":
				var title = '生产'
				break;
			default:
				break;
		}
		
		uni.setNavigationBarTitle({
			title
		});


	},
  methods:{
	  async getTableData(today){
			var that = this;
			const result = await that.$api.interfaceApi('getorderlist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				startdate: today,
				enddate: today,
				keyword: '',
				billtype:'11', // 11销售订单 12采购订单
			});
			console.log(result)
			if (result.ret === 1) {
					that.$api.msg(result.erroinfo);
					if(result.data.result.length){
						that.ReceiptTableData = result.data.result
					}
					console.log(that.ReceiptTableData)
				} else {
					that.$api.msg(result.erroinfo);
				}
		},
		async getngstocklist(today){
			var that = this;
			const result = await that.$api.interfaceApi('getngstocklist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid')
			});
			console.log(result,'库存')
			if (result.ret === 1) {
					that.$api.msg(result.erroinfo);
					if(result.data.result.length){
						that.StockTableData = result.data.result
					}
					console.log(that.ReceiptTableData)
				} else {
					that.$api.msg(result.erroinfo);
				}
		},
		// 价格波动
		async getpricelist(today){
			var that = this; 
			const result = await that.$api.interfaceApi('getpricelist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				billtype:'1',   //1销售 2采购
			});
			console.log(result)
			if (result.ret === 1) {
					that.$api.msg(result.erroinfo);
					if(result.data.result.length){
						// that.ReceiptTableData = result.data.result
					}
					console.log(that.ReceiptTableData)
				} else {
					that.$api.msg(result.erroinfo);
				}
		},

		//交期明细 overtype:1 销售订单 2采购订单 3生产订单  
		async getoverdatelist(today){
			var that = this; 
			const result = await that.$api.interfaceApi('getoverdatelist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				overtype:'1', //1 销售订单 2采购订单 3生产订单
			});
			console.log(result)
			if (result.ret === 1) {
				that.$api.msg(result.erroinfo);
				if(result.data.result.length){
					// that.ReceiptTableData = result.data.result
				}
				console.log(that.ReceiptTableData)
			} else {
				that.$api.msg(result.erroinfo);
			}
		},
		// 收款 
		async getreclist(today){
			var that = this; 
			const result = await that.$api.interfaceApi('getreclist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				rectype:'39', // 39应收款  40应付款
			});
			console.log(result)
			if (result.ret === 1) {
					that.$api.msg(result.erroinfo);
					if(result.data.result.length){
						// that.ReceiptTableData = result.data.result
					}
					console.log(that.ReceiptTableData)
				} else {
					that.$api.msg(result.erroinfo);
				}
		},
    changePriceType(type){
			if(type===1 && this.commomType=='PriceSupplier'){
				console.log(type)
				this.commomType = 'Price'
			} else if(type===2 && this.commomType=='Price'){
				this.commomType = 'PriceSupplier'
			}
		},
		changeDeliveryType(type){
			if(type===1 && this.commomType=='DeliverySupplier'){
				console.log(type)
				this.commomType = 'Delivery'
			} else if(type===2 && this.commomType=='Delivery'){
				this.commomType = 'DeliverySupplier'
			}
		},
		open() {
			this.$refs.calendar.open()
		},
		confirm(e){
			console.log(e.range)
			if(e.range.before && e.range.after){
        var time1=new Date(e.range.before);
        var time2=new Date(e.range.after);
        if(time2>time1){
          this.startDate = e.range.before
          this.endDate = e.range.after
        }else{
          this.startDate = e.range.after
          this.endDate = e.range.before
        }
        
      } else {
        this.startDate = e.fulldate
				// this.endDate = e.fulldate
				this.getTableData(e.fulldate)
      }
		}
  }
}
</script>
<style lang='scss'>
.table-box{
	width: 100%;
	.table{
		text-align: center;
		padding: 20upx;
	}
	.notice-text{
		padding: 20upx;
		font-size: 28upx;
		.red{
			color: red;
		}
	}
}
.btn-box{
	margin: 10upx 100upx;
	height: 60upx;
	display: flex;
	.commomStyle{
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1upx solid #0084FF;
		font-size: 28upx;
		&.right{
			background: #fff;
			color: #0084FF;
			&.active{
				background: #0084FF;
				color: #fff;
			}
		}
		&.left{
			&.active{
				background: #0084FF;
				color: #fff;
			}
		}
	}
}
.data-box{
	display: flex;
	align-items: center;
	padding: 0 20upx;
	font-size: 28upx;
	margin-bottom: 20upx;
	margin-top: 20upx;
	text{
		margin: 0 20upx;
	}
	.image{
		width: 28upx;
		height: 28upx;
	}
}

</style>