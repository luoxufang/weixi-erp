<template>
	<view class="table-box" style="background:#fff;">
		<view class="notice-text" v-if="tableType =='Receipt'">今天接了<text class="red">（XXX）</text>万元订单，近5日接了<text class="red">（XX）</text>万订单，近一个月CXX</view>
		<view class="notice-text" v-else-if="tableType =='Stock'">公司久滞留库存30天以上<text class="red">（XXX）</text>万元，60以上<text class="red">（XXX）</text>万元，90天以上<text class="red">（XXX）</text>万元</view>
		<view class="notice-text" v-else-if="tableType =='Money'">过期应收款是<text class="red">（XXX）</text>万元，逾期付款<text class="red">（XXX）</text>万元</view>
		<view class="notice-text" v-else-if="tableType =='Price'">你的价格波动<text class="red">（XXX）</text>%</view>
		<view class="notice-text" v-else-if="tableType =='Delivery'">
			你的超过交期的订单是<text class="red">（XXX）</text>万元，超过交期的采购订单<text class="red">（XXX）</text>万元，是否忘入库还是真的超交期？
		</view>
		<view class="notice-text" v-else-if="tableType =='Produce'">你超过的交期生产订单是<text class="red">（XXX）</text>，是否忘记入库还是真的超交期？</view>
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

  </view>
</template>
<script>
import zTable from "../../components/z-table/z-table.vue";
export default {
    components: {
      zTable
    },
  data(){
    return{
			commomType: '',
			tableType: '',
			// 固定左侧
			allTableData:{
				TableData:[], // 占位
				Columns:[], // 占位
				ReceiptTableData: [{
					name: "李六",
					time: "2020-04-28",
					people: "小明",
					order: '454155',
					code: "20201122",
					proName: "西瓜",
					orderNumber: "123456",
					price: "2000",
					proMoney: "1000.00"
				}, {
					name: "李六",
					time: "2020-04-28",
					people: "小明",
					order: '454155',
					code: "20201122",
					proName: "西瓜",
					orderNumber: "123456",
					price: "2000",
					proMoney: "1000.00"
				}, {
					name: "李六",
					time: "2020-04-28",
					people: "小明",
					order: '454155',
					code: "20201122",
					proName: "西瓜",
					orderNumber: "123456",
					price: "2000",
					proMoney: "1000.00"
				}, {
					name: "李六",
					time: "2020-04-28",
					people: "小明",
					order: '454155',
					code: "20201122",
					proName: "西瓜",
					orderNumber: "123456",
					price: "2000",
					proMoney: "1000.00"
				}],
				ReceiptColumns: [{
					title: "客户",
					key: "name",
					width: 100
				}, {
					title: "日期",
					key: "time",
					width: 200
				}, {
					title: "业务员",
					key: "people",
					width: 100
				}, {
					title: "订单号",
					key: "order",
					width: 200
				}, {
					title: "物料编码",
					key: "code",
					width: 200
				}, {
					title: "商品名称",
					key: "proName",
					width: 200
				}, {
					title: "订单数量",
					key: "orderNumber",
					width: 200
				}, {
					title: "销售价格",
					key: "price",
					width: 200
				}, {
					title: "订单金额",
					key: "proMoney",
					width: 200
				}],
			},
			

    }
  },
	onLoad(options){
		console.log(options)
		this.tableType = options.type
		switch (options.type) {
			case 'Receipt':
				var title = '接单'
				break;
			case "Stock":
				var title = '库存'
				break;
			case "Money":
				var title = '收款'
				break;
			case "Price":
				var title = '价格'
				break;
			case "Delivery":
				var title = '交期'
				break;
			case "Produce":
				var title = '生产'
				break;
			default:
				break;
		}
		this.commomType = options.type
		uni.setNavigationBarTitle({
			title
		});
	},
  methods:{
    
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

</style>