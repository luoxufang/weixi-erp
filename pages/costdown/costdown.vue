<template>
	<view class="table-box" style="background:#fff;">

    <!-- 基本用法 -->
    <uni-search-bar @confirm="search" @input="input" radius="32" placeholder="搜索客户"></uni-search-bar>

    <!-- <view class="selectPeople" @click.stop="toggleSelect()">
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
    </view> -->
		
		<view class="data-box">

      <view class="item-view left">
        <text style="margin-left:0;">选择期间</text>
        <image class="image" src="/static/tiem.png" />
        <view class="aaaa">
          <view class="firstTime" @click="open">{{startDate}}</view>
          <view class="firstTime" @click="open">{{endDate}}</view>
        </view>
      </view>

      <view class="item-view right">
        <text style="margin-left:0;">对比期间</text>
        <image class="image" src="/static/tiem.png" />
        <view class="aaaa">
          <view class="endTime" @click="open2">{{startDate2}}</view>
          <view class="endTime" @click="open2">{{endDate2}}</view>
        </view>
      </view>
      
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

    <uni-calendar ref="calendar2" 
		:date="info2.date" 
		:insert="info2.insert" 
		:lunar="info2.lunar" 
		:startDate="info2.startDate" 
		:endDate="info2.endDate" 
		:range="info2.range" 
		@confirm="confirm2" />

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
      keyword: '',
      selectClass: 'none',
      candidates: ['北京', '南京', '东京'],
			city: '',
			startDate: '',
      endDate: '',
      startDate2: '',
			endDate2: '',
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
      info2: {
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
					width: 240
				}, {
					title: "C/DRate", // ((totalamount/totalcount) -lastavgprice)/lastavgprice * 100  显示%
					key: "totalamount",
					width: 160
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
    
    // 初始为本月的第一天
    var firstTime = day2.getFullYear()+"-" + Month + "-01";
		this.startDate = firstTime
    this.endDate = today
    
    var nowdays = new Date(); 
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if(month==0){
      month = 12;
      year = year-1;
    }
    if(month<10){  month = '0'+month; }
    var myDate = new Date(year,month,0);

    var startDate2 = year+'-'+month+'-01'; //上个月第一天
    var endDate2 = year+'-'+month+'-'+myDate.getDate();//上个月最后一天
    
		this.startDate2 = startDate2
    this.endDate2 = endDate2
    // -----------------------------
		this.tableType = options.type
    
    this.getcostdownlist(today,today)
	},
  methods:{
    // getcostdownlist
    async getcostdownlist(){
      const result = await this.$api.interfaceApi('getcostdownlist')({
				token: uni.getStorageSync('token'),
        shopid: uni.getStorageSync('shopid'),
        startdate: this.startDate,
        enddate: this.endDate,
        startdate2: this.startDate2,
        enddate2: this.endDate2,
        keyword: this.keyword
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
			console.log(this.keyword)
			// if(!this.keyword) return
			this.getcostdownlist(this.startDate, this.endDate)
		},
		input(e){
			// console.log(e)
			this.keyword = e.value
		},
		changeData(type){
			this.timeType = type
			// 请求 相关 table
		},
		open() {
			this.$refs.calendar.open()
		},
		open2() {
			this.$refs.calendar2.open()
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
    },
    confirm2(e){
			if(e.range.before && e.range.after){
        var time1=new Date(e.range.before);
        var time2=new Date(e.range.after);
        if(time2>time1){
          this.startDate2 = e.range.before
          this.endDate2 = e.range.after
          this.getcostdownlist()
        }else{
          this.startDate2 = e.range.after
          this.endDate2 = e.range.before
          this.getcostdownlist()
        }
        
      } else {
        this.startDate2 = e.fulldate
        this.endDate2 = e.fulldate
        this.getcostdownlist()
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
  margin-top: 30upx;
  .item-view{
    flex: 1;
    display: flex;
    &.right{
      justify-content: flex-end;
    }
  }
	text{
		margin: 0 20upx;
	}
	.image{
		width: 28upx;
    height: 28upx;
    position: relative;
    top: 6upx;
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