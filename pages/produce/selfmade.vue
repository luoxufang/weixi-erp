<template>
	<view class="table-box" style="background:#fff;">

		<!-- 基本用法 -->
    <uni-search-bar @confirm="search" @input="input" radius="32"></uni-search-bar>

		<view class="time-btn">
			<text style="font-size:28upx;">日期范围</text>
			<button class="mini-btn" :class="timeType=='today'&&today==startDate&&today==endDate?'active':''" @click="changeData('today')" type="default" size="mini">本日</button>
			<button class="mini-btn" :class="timeType=='week'?'active':''" @click="changeData('week')" type="default" size="mini">本周</button>
			<button class="mini-btn" :class="timeType=='month'?'active':''" @click="changeData('month')" type="default" size="mini">本月</button>
			<button class="mini-btn" :class="timeType=='year'?'active':''" @click="changeData('year')" type="default" size="mini">本年</button>
		</view>
		
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
				endDate: '2019-010-15',
				lunar: true,
				range: true,
				insert: false,
				selected: []
			},
			timeType: 'today',// week, month, year
			today: '',
			tableType: '',// 固定左侧

			SaleOrderColumns: [{
				title: "生产订单号",
				key: "custbillcode",
				width: 150
			}, {
				title: "日期",
				key: "updatedate",
				width: 240
			}, {
				title: "料号",
				key: "prodno",
				width: 200
			}, {
				title: "品名规格",
				key: "skuvalfull",// prodname  相加
				width: 200
			}, {
				title: "计划数量",
				key: "prodcount",
				width: 150
			}, {
				title: "完工数量",
				key: "finishcount",
				width: 150
			}, {
				title: "未完工数量", // prodcount - finishcount
				key: "nonumber",
				width: 180
			}, {
				title: "预计完工时间",
				key: "finishdate",
				width: 200
			}],
			
			SaleOrderTableData: [
				// {
				// 	proorder: "123456",
				// 	data: '3月30号',
				// 	wucode: "12345678",
				// 	shopname: '华为手机p30',
				// 	number: "999",
				// 	isnumber: "566",
				// 	nonumber: "8888",
				// 	time: "5月1日"
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

		this.getmrpitemlist(today,today)
	},
  methods:{
		async getmrpitemlist(startdate,enddate){
			var that = this
			const result = await that.$api.interfaceApi('getmrpitemlist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				startdate: startdate,
				enddate: enddate,
				keyword: this.keyword,
				plantype:'1', // 1自制 2 外
			});
			if (result.ret === 1) {
				if(result.data.result.length>0){
					that.$api.msg(result.erroinfo);

					var aaa = result.data.result.map((item)=>{
						item.skuvalfull = item.prodname+' '+item.skuvalfull;
						item.nonumber = (parseFloat(item.prodcount) - parseFloat(item.finishcount))
						return item
					})

					that.SaleOrderTableData = aaa
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
			// if(!this.keyword) return
			this.getmrpitemlist(this.startDate, this.endDate)
		},
		input(e){
			// console.log(e)
			this.keyword = e.value
		},
		changeData(type){
			// 请求 相关 table :  today, week, month, year
			if(this.timeType==type) return  // 处理重复点击

			if(type=='today'){
				this.getmrpitemlist(this.today, this.today)
				this.startDate = this.today
				this.endDate = this.today
			}else if(type=='week'){
				this.getmrpitemlist(util.getMonday("s",0), util.getMonday("e",0))
				this.startDate = util.getMonday("s",0)
				this.endDate = util.getMonday("e",0)
			}else if(type=='month'){
				this.getmrpitemlist(util.getMonth("s",0), util.getMonth("e",0))
				this.startDate = util.getMonth("s",0)
				this.endDate = util.getMonth("e",0)
			}else if(type=='year'){
				this.getmrpitemlist(util.getYear("s",0), util.getYear("e",0))
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
					this.getmrpitemlist(e.range.before,e.range.after)
        }else{
          this.startDate = e.range.after
					this.endDate = e.range.before
					this.getmrpitemlist(e.range.after,e.range.before)
        }
        
      } else {
        this.startDate = e.fulldate
				this.endDate = e.fulldate
				this.getmrpitemlist(e.fulldate,e.fulldate)
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
	margin-top: 20upx;
	margin-bottom: 20upx;
	text{
		margin-left: 20upx;
		margin-right: 20upx;
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