<template>
	<view class="table-box" style="background:#fff;">

    <view class="notice-text">
      今天接了<text class="red">{{todayamount}}</text>元订单，
      近5日接了<text class="red">{{last5amount}}</text>元订单，
      近一个月<text class="red">{{lastmonthamount}}</text>元订单</view>
		
		<view class="data-box" @click="open">
			<image class="image" src="/static/tiem.png" />
			<view class="firstTime">{{startDate}}</view>
      <text>到</text>
			<image class="image" src="/static/tiem.png" />
			<view class="endTime">{{endDate}}</view>
		</view>

    <view class="table">
			<z-table :tableData='SaleOrderTableData' :columns='SaleOrderColumns' stickSide='true'></z-table>
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
import uniSearchBar from '@/components/uni-search-bar.vue';
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
export default {
    components: {
			zTable,
			uniSearchBar,
			uniCalendar
    },
  data(){
    return{
      todayamount:'0',
      last5amount:'0',
      lastmonthamount:'0',
			startDate: '',
			endDate: '',
			showCalendar: false,
			info: {
				date: '',
				startDate: '2019-06-15',
				endDate: '2019-010-15',
				lunar: true,
				range: true,
				insert: false,
				selected: []
			},
			timeType: 'today',// week, month, year
			tableType: '',// 固定左侧

			SaleOrderColumns: [{
				title: "客户名称",
				key: "custname"
			}, {
				title: "订单号",
				key: "custbillcode",
				width: 200
			}, {
				title: "日期",
				key: "billdate",
				width: 200
			}, {
				title: "料号",
				key: "prodno",
				width: 200
			}, {
				title: "品名",
				key: "prodname",
				width: 200
			}, {
				title: "数量",
				key: "prodcount",
				width: 100
			}, {
				title: "单位",
				key: "produnitname",
				width: 120
			}, {
				title: "单价",
				key: "prodprice",
				width: 200
			}, {
				title: "金额",
				key: "amounttax",
				width: 200
			}],
			
			SaleOrderTableData: [
				// {
				// 	custname: "张三",
				// 	custbillcode: '12345678',
				// 	billdate: "2020-04-28",
				// 	prodno: "123456",
				// 	prodname: '华为手机p30',
				// 	count: "999",
				// 	prodshowunitname: "件",
				// 	num_10: "99.99",
				// 	amounttax: "2000.00"
				// }
			],

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
		this.endDate = today
		console.log(options)
    this.tableType = options.type
    this.todayamount = options.todayamount
    this.last5amount = options.last5amount
    this.lastmonthamount = options.lastmonthamount
		setTimeout(()=>{
			this.getTableData(today,today)
		},300)
		
	},
  methods:{
		async getTableData(startdate,enddate){
			var that = this
			const result = await that.$api.interfaceApi('getorderlist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				startdate: startdate,
				enddate: enddate,
				keyword: '',
				billtype:'11', // 11销售订单 12采购订单
			});
			if (result.ret === 1) {
				
				if(result.data.result.length>0){
					that.$api.msg(result.erroinfo);
					that.SaleOrderTableData = result.data.result
				}else{
					that.SaleOrderTableData = []
					that.$api.msg('暂无数据');
				}
			} else {
				that.$api.msg(result.erroinfo);
			}
	  },
    search(e){
			console.log(this.keyword)
			if(!this.keyword) return
			this.getTableData()
		},
		input(e){
			// console.log(e.value)
			this.keyword = e.value
		},
		changeData(type){
			this.timeType = type
			// 请求 相关 table
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
					this.getTableData(e.range.before,e.range.after)
        }else{
          this.startDate = e.range.after
					this.endDate = e.range.before
					this.getTableData(e.range.after,e.range.before)
				}
        
      } else {
        this.startDate = e.fulldate
				this.endDate = e.fulldate
				this.getTableData(e.fulldate,e.fulldate)
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
.time-btn{
	display: flex;
	align-items: center;
	padding: 0 20upx;
	margin: 30upx 0;
}
.mini-btn {
	margin-right: 10rpx;
	border: 1upx solid rgba(0,0,0,.2);
	background: #fff !important;
	line-height: 54upx !important;
	&.active{
		border: 1upx solid $base-color;
		color: $base-color;
	}
}
button::after{
	border: 0;
}
.data-box{
	display: flex;
	align-items: center;
	padding: 0 20upx;
	font-size: 28upx;
	margin-bottom: 20upx;
	text{
		margin: 0 20upx;
	}
	.image{
		width: 28upx;
		height: 28upx;
	}
}

.example-body {
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
	font-size: 14px;
	background-color: #ffffff;
}

</style>