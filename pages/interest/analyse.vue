<template>
	<view class="table-box" style="background:#fff;">

		<!-- <view class="time-btn">
			<text style="font-size:28upx;">日期范围</text>
			<button class="mini-btn" style="margin-left: 40upx" :class="timeType=='month'?'active':''" @click="changeData('month')" type="default" size="mini">本月</button>
			<button class="mini-btn" style="margin-left: 40upx" :class="timeType=='year'?'active':''" @click="changeData('year')" type="default" size="mini">本年</button>
		</view> -->
		
		<view class="data-box" @click="open">
      <text style="margin-left:0;">选择期间</text>
			<view class="firstTime">{{startDate}}</view>
			<image class="image" src="/static/xiala.png" />
			<text>到</text>
			<view class="endTime">{{endDate}}</view>
			<image class="image" src="/static/xiala.png" />
		</view>

    <view class="selectPeople" @click.stop="toggleSpec()">
      <view class="title">选择客户</view>
      <view class="right">
        <button type="default" size="mini">全部</button>
        <image class="image" src="/static/xiala2.png" />
      </view>
    </view>

    <view class="table">
			<z-table :tableData='SaleOrderTableData' :columns='SaleOrderColumns' stickSide='true'></z-table>
		</view>

    <!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" style="width:100%;" @click.stop="stopPrevent">
				<view class="kehu-title">请选择要查看的客户</view>

        <view class="people-list">
          <view class="item-btn-box">
            <button class="item-btn" type="default" size="mini">全部</button>
          </view>
          <view class="item-btn-box">
            <button class="item-btn" type="default" size="mini">客户一</button>
          </view>
          <view class="item-btn-box">
            <button class="item-btn" type="default" size="mini">客户一</button>
          </view>
          <view class="item-btn-box">
            <button class="item-btn" type="default" size="mini">客户一</button>
          </view>
          <view class="item-btn-box">
            <button class="item-btn" type="default" size="mini">客户一</button>
          </view>
          
        </view>
        <view @click="confirmSelectPeople" class="confirm-btn">确定</view>
			</view>
		
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
import uniCombox from "@/components/uni-combox/uni-combox"
export default {
    components: {
			zTable,
			uniSearchBar,
      uniCalendar,
      uniCombox
    },
  data(){
    return{
      specClass: 'none',
      candidates: ['北京', '南京', '东京'],
			city: '',
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
			timeType: 'month',// week, month, year
			tableType: '',// 固定左侧

			SaleOrderColumns: [
				{
					title: "客户名称",
					key: "name",
					width: 150
				}, {
					title: "客户代码",
					key: "peopleCode",
					width: 200
				}, {
					title: "销售数量",
					key: "saleNumber",
					width: 180
				}, {
					title: "销售金额",
					key: "saleMoney",
					width: 180
				}, {
					title: "BOM成本",
					key: "bom",
					width: 200
				}, {
					title: "毛利",
					key: "maoli",
					width: 180
				}, {
					title: "毛利率",
					key: "maolilv",
					width: 180
				}
			],
			
			SaleOrderTableData: [
				{
					name: "李青云",
          peopleCode: '123456789',
          saleNumber: '9999',
          saleMoney: '9999.99',
          bom: '888.88',
          maoli: '9999.99',
          maolilv: '9999.99',
				},
				{
					name: "李青云",
          peopleCode: '123456789',
          saleNumber: '9999',
          saleMoney: '9999.99',
          bom: '888.88',
          maoli: '9999.99',
          maolilv: '9999.99',
        },
        {
					name: "李青云",
          peopleCode: '123456789',
          saleNumber: '9999',
          saleMoney: '9999.99',
          bom: '888.88',
          maoli: '9999.99',
          maolilv: '9999.99',
        },
        {
					name: "李青云",
          peopleCode: '123456789',
          saleNumber: '9999',
          saleMoney: '9999.99',
          bom: '888.88',
          maoli: '9999.99',
          maolilv: '9999.99',
        },
        {
					name: "李青云",
          peopleCode: '123456789',
          saleNumber: '9999',
          saleMoney: '9999.99',
          bom: '888.88',
          maoli: '9999.99',
          maolilv: '9999.99',
				},
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
		console.log(today)
		this.tableType = options.type
		
	},
  methods:{
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
    },
    confirmSelectPeople(){
      this.toggleSpec()
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
.selectPeople{
  display: flex;
  align-items: center;
  padding: 0 20upx;
  margin: 10upx 0;
  .title{
    font-size: 28upx;
    color: #333;
  }
  .right{
    display: flex;
    align-items: center;
    padding: 10upx 20upx 10upx 10upx;
    border: 1upx solid #f8f8f8;
    border-radius: 10upx;
    margin-left: 20upx;
    position: relative;
    button{
      width: 160upx;
      height: 50upx;
      line-height: 50upx;
      font-size: 26rpx;
      margin-left: 0;
      margin-right: 20rpx;
      color: #999;
      background: #fff;
    }
    button::after{
      border: 0;
    }
    .image{
      width: 30upx;
      height: 30upx;
    }
  }
}

.attr-content{
  padding-bottom: 88upx;
  height: 40vh;
  .kehu-title{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88upx;
    font-size: 30upx;
    color: #333;
  }
  .people-list{
    display: flex;
    flex-wrap: wrap;
    padding: 10upx 20upx;
    .item-btn-box{
      width: 25%;
      padding-right: 20upx;
      box-sizing: border-box;
      margin-bottom: 16upx;
      .item-btn{
        width: 100%;
        font-size: 28upx;
      }
    }
    .item-btn-box:nth-child(4){
      padding-right: 0;
    }
  }
  .confirm-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88upx;
    font-size: 28upx;
    color: #fff;
    background: #0084FF;
  }
}

</style>