<template>
	<view class="table-box" style="background:#fff;">

		<!-- 基本用法 -->
    <uni-search-bar @confirm="search" @input="input" ></uni-search-bar>

		<!-- <view class="time-btn">
			<text style="font-size:28upx;">日期范围</text>
			<button class="mini-btn" style="margin-left: 40upx" :class="timeType=='month'?'active':''" @click="changeData('month')" type="default" size="mini">本月</button>
			<button class="mini-btn" style="margin-left: 40upx" :class="timeType=='year'?'active':''" @click="changeData('year')" type="default" size="mini">本年</button>
		</view> -->
		
		<view class="data-box" @click="open">
      <text style="font-size:28upx;">选择时间</text>
			<view class="firstTime">{{startDate}}</view>
			<image class="image" src="/static/xiala.png" />
			<!-- <text>到</text>
			<view class="endTime">{{endDate}}</view>
			<image class="image" src="/static/xiala.png" /> -->
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
			startDate: '',
			endDate: '',
			showCalendar: false,
			info: {
				date: '',
				startDate: '2019-06-15',
				endDate: '2019-010-15',
				lunar: true,
				range: false,
				insert: false,
				selected: []
			},
			timeType: 'month',// week, month, year
			tableType: '',// 固定左侧

			SaleOrderColumns: [
				{
					title: "料号",
					key: "prodno",
					width: 200
				}, {
					title: "品名规格",
					key: "skuvalfull",
					width: 320
				}, {
					title: "库存数量",
					key: "curstock",
					width: 200
				}
				// , {
				// 	title: "在途数量",
				// 	key: "prodcount",
				// 	width: 180
				// }
			],
			
			SaleOrderTableData: [
				// {
				// 	wucode: "123456",
        //   shopsku: '伊利纯正牛奶奥运品质全新升级',
        //   stocknumber: '4555',
        //   ingnumber: '4555',
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
		this.nowToStock(today,today)
	},
  methods:{
		async nowToStock(startdate,enddate){
			var that = this
			const result = await that.$api.interfaceApi('nowToStock')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				startdate: startdate,
				enddate: enddate,
				keyword: '',
				billtype:'1',
				condition: ''
			});
			if (result.ret === 1) {
				
				if(result.data.res_prodshop.length>0){
					that.$api.msg(result.erroinfo);
					var dddd = result.data.res_prodshop.map((item)=>{
						item.skuvalfull = item.prodname+' '+item.skuvalfull
						return item
					})
					that.SaleOrderTableData = dddd
				}else{
					that.SaleOrderTableData = []
					that.$api.msg('暂未无数据');
				}
			} else {
				that.$api.msg(result.erroinfo);
			}
	  },
    search(e){
			console.log(e)
		},
		input(e){
			// console.log(e)
		},
		changeData(type){
			this.timeType = type
			// 请求 相关 table
		},
		open() {
			this.$refs.calendar.open()
		},
		confirm(e){
			console.log(e)
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
        this.endDate = e.fulldate
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
  margin-top: 30upx;
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