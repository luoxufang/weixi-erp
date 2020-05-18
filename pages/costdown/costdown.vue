<template>
	<view class="table-box" style="background:#fff;">

		<!-- <view class="time-btn">
			<text style="font-size:28upx;">日期范围</text>
			<button class="mini-btn" style="margin-left: 40upx" :class="timeType=='month'?'active':''" @click="changeData('month')" type="default" size="mini">本月</button>
			<button class="mini-btn" style="margin-left: 40upx" :class="timeType=='year'?'active':''" @click="changeData('year')" type="default" size="mini">本年</button>
		</view> -->

    <view class="selectPeople" @click.stop="toggleSelect()">
      <view class="title">选择客户</view>
      <view class="right">
        <button type="default" size="mini">全部</button>
        <image class="image" src="/static/xiala2.png" />

        <view class="toggle-view" :class="selectClass">
          <view class="item-scroll-view">
            <view class="item">物料一</view>
            <view class="item">物料一</view>
            <view class="item">物料一</view>
            <view class="item">物料一</view>
            <view class="item">物料一</view>
            <view class="item">物料一</view>
            <view class="item">物料一</view>
            <view class="item">物料一</view>
          </view>
        </view>

      </view>
    </view>
		
		<view class="data-box" @click="open">
      <text style="margin-left:0;">选择期间</text>
			<view class="firstTime">{{startDate}}</view>
			<image class="image" src="/static/xiala.png" />
			<text>到</text>
			<view class="endTime">{{endDate}}</view>
			<image class="image" src="/static/xiala.png" />
		</view>

    <!-- <view class="selectPeople">
      <view class="title">选择客户</view>
      <view class="right">
        <uni-combox :candidates="candidates" placeholder="全部" v-model="city"></uni-combox>
      </view>
    </view> -->

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
      selectClass: 'none',
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
					title: "产品名称",
					key: "prodname",
					width: 200
				}, {
					title: "产品编号",
					key: "prodno",
					width: 160
				}, {
					title: "选择期间",
					key: "prodno", // 自己加
					width: 160
				}, {
					title: "采购数量",
					key: "totalcount",
					width: 150
				}, {
					title: "采购价格",
					key: "totalamount",  // totalamount / totalcount
					width: 150
				}, {
					title: "对比期间",
					key: "prodno", // 自己 加时间
					width: 160
				}, {
					title: "对比期间采购均价",
					key: "lastavgprice",
					width: 240
        }, 
        // {
				// 	title: "采购成本",
				// 	key: "caigouchengben",
				// 	width: 100
        // }, 
        {
					title: "C/D金额",
					key: "lastavgprice", // （lastavgprice*totalcount）-totalamount
					width: 120
				}, {
					title: "C/DRate", // ((totalamount/totalcount) -lastavgprice)/lastavgprice * 100  显示%
					key: "totalamount",
					width: 120
				}
			],
			
			SaleOrderTableData: [
				// {
				// 	produceNmae: "伊利纯正牛奶",
        //   produceCode: '123456789',
        //   selectTime: '2020-05-01',
        //   caigouNumber: '8888',
        //   caigouMoney: '999.99',
        //   duibiTime: '2020-05-01',
        //   aaaaa: '1000',
        //   caigouchengben: '1000.00',
        //   cdMoney: '1000.00',
        //   cdRate: '100%',
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
    
    this.getcostdownlist(today,today)
	},
  methods:{
    // getcostdownlist
    async getcostdownlist(startdate,enddate){
      const result = await this.$api.interfaceApi('getcostdownlist')({
				token: uni.getStorageSync('token'),
        shopid: uni.getStorageSync('shopid'),
        startdate: startdate,
        enddate: enddate,
        startdate2: startdate,
        enddate2: enddate,
        keyword: ''
      });
      
      if (result.ret === 1) {
				if(result.data.result.length>0){
					this.$api.msg(result.erroinfo);
					this.SaleOrderTableData = result.data.result
				}else{
					this.custList = []
					this.$api.msg('暂无数据');
				}
			} else {
				this.$api.msg(result.erroinfo);
			}
    },
    toggleSelect(){
      if (this.selectClass === 'show') {
        this.selectClass = 'hide';
        setTimeout(() => {
          this.selectClass = 'none';
        }, 250);
      } else if (this.selectClass === 'none') {
        this.selectClass = 'show';
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
          this.getcostdownlist(e.range.before,e.range.after)
        }else{
          this.startDate = e.range.after
          this.endDate = e.range.before
          this.getcostdownlist(e.range.after,e.range.before)
        }
        
      } else {
        this.startDate = e.fulldate
        this.endDate = e.fulldate
        this.getcostdownlist(e.fulldate,e.fulldate)
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


    .toggle-view{
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: #fff;
      border-radius: 0 0 10upx 10upx;
      border: 1upx solid #f5f5f5;
      z-index: 999;
      box-sizing: border-box;
      &.show {
        display: block;
        .item-scroll-view {
          animation: showPopup 0.2s linear both;
        }
      }
      &.hide {
        .item-scroll-view {
          animation: hidePopup 0.2s linear both;
        }
      }
      &.none {
        display: none;
      }

      .item-scroll-view{
        max-height: 340upx;
        overflow-y: scroll;
        padding: 0 20upx;
        font-size: 26upx;
        box-sizing: border-box;
        .item{
          line-height: 68upx;
        }
      }
      @keyframes showPopup {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      @keyframes hidePopup {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    }

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