<template>
	<view class="table-box" style="background:#fff;">

		<!-- 基本用法 -->
    <uni-search-bar @confirm="search" @input="input" ></uni-search-bar>

		<view class="time-btn">
			<text style="font-size:28upx;">日期范围</text>
			<button class="mini-btn" :class="timeType=='today'&&today==startDate&&today==endDate?'active':''" @click="changeData('today')" type="default" size="mini">本日</button>
			<button class="mini-btn" :class="timeType=='week'?'active':''" @click="changeData('week')" type="default" size="mini">本周</button>
			<button class="mini-btn" :class="timeType=='month'?'active':''" @click="changeData('month')" type="default" size="mini">本月</button>
			<button class="mini-btn" :class="timeType=='year'?'active':''" @click="changeData('year')" type="default" size="mini">本年</button>
		</view>
		
		<view class="data-box" @click="open">
			<view class="firstTime">{{startDate}}</view>
			<image class="image" src="/static/xiala.png" />
			<text>到</text>
			<view class="endTime">{{endDate}}</view>
			<image class="image" src="/static/xiala.png" />
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
import util from '@/util.js';
export default {
    components: {
			zTable,
			uniSearchBar,
			uniCalendar
    },
  data(){
    return{
			startDate: '',
			endDate: '',
			keyword: '',
			showCalendar: false,
			info: {
				date: '',
				startDate: '2019-06-15',
				endDate: '2019-10-15',
				lunar: true,
				range: true,
				insert: false,
				selected: []
			},
			timeType: 'today',// week, month, year
			today: '',
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
		this.today = today
		this.startDate = today
		this.endDate = today
		console.log(options)
		this.tableType = options.type
		this.getTableData(today,today)
		
	},
  methods:{
		async getTableData(startdate,enddate){
			var that = this
			const result = await that.$api.interfaceApi('getorderlist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				startdate: startdate,
				enddate: enddate,
				keyword: this.keyword,
				billtype:'11', // 11销售订单 12采购订单
			});
			if (result.ret === 1) {
				
				if(result.data.result.length>0){
					that.$api.msg(result.erroinfo);
					that.SaleOrderTableData = result.data.result
				}else{
					that.SaleOrderTableData = []
					that.$api.msg('暂未无数据');
				}
			} else {
				that.$api.msg(result.erroinfo);
			}
	  },
    search(e){
			console.log(this.keyword)
			// if(!this.keyword) return
			this.getTableData(this.startDate, this.endDate)
		},
		input(e){
			// console.log(e.value)
			this.keyword = e.value
		},
		changeData(type){
			// 请求 相关 table :  today, week, month, year
			if(this.timeType==type) return  // 处理重复点击

			if(type=='today'){
				this.getTableData(this.today, this.today)
				this.startDate = this.today
				this.endDate = this.today
			}else if(type=='week'){
				this.getTableData(util.getMonday("s",0), util.getMonday("e",0))
				this.startDate = util.getMonday("s",0)
				this.endDate = util.getMonday("e",0)
			}else if(type=='month'){
				this.getTableData(util.getMonth("s",0), util.getMonth("e",0))
				this.startDate = util.getMonth("s",0)
				this.endDate = util.getMonth("e",0)
			}else if(type=='year'){
				this.getTableData(util.getYear("s",0), util.getYear("e",0))
				this.startDate = util.getYear("s",0)
				this.endDate = util.getYear("e",0)
			}
			this.timeType = type
			
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
	&.active{
		border: 1upx solid #0084FF;
		color: #0084FF;
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