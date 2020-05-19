<template>
	<view class="table-box" style="background:#fff;">

    <view class="notice-text">
      公司久滞留库存30天以上<text class="red">{{last30amount}}</text>万元，
      60以上<text class="red">{{last60amount}}</text>万元，
      90天以上<text class="red">{{last90amount}}</text>万元</view>
		
		<view class="selectPeople" @click.stop="toggleSelect()">
      <view class="title">选择滞留天数</view>
      <view class="right">
        <button type="default" size="mini">{{showData}}</button>
        <image class="image" src="/static/xiala2.png" />

        <view class="toggle-view" :class="selectClass">
          <view class="item-scroll-view">
            <view class="item" @click="selectTime(1)">30天</view>
            <view class="item" @click="selectTime(2)">60天</view>
            <view class="item" @click="selectTime(3)">90天</view>
          </view>
        </view>

      </view>
    </view>

    <view class="table">
			<z-table :tableData='StockTableData' :columns='StockColumns' stickSide='true'></z-table>
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
      selectClass: 'none',
      showData: '30天',
      last30amount:'0',
      last60amount:'0',
      last90amount:'0',
			startDate: '',
			endDate: '',
			showCalendar: false,
			info: {
				date: '',
				startDate: '2019-06-15',
				endDate: '2019-10-15',
				lunar: true,
				range: false,
				insert: false,
				selected: []
			},
			timeType: 'today',// week, month, year
			tableType: '',// 固定左侧

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
      }],

      StockColumns2: [{
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
        title: "60天以上金额",
        key: "itemdiscountamount",
        width: 200
      }],

      StockColumns3: [{
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
        title: "90天以上金额",
        key: "itemdiscountamount",
        width: 200
      }],
			
			StockTableData: [
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
      StockTableData1:[],
      StockTableData2:[],
      StockTableData3:[],

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
    this.last30amount = options.todayamount
    this.last60amount = options.last5amount
    this.last90amount = options.lastmonthamount

		this.getngstocklist(today,today)
		
	},
  methods:{
    async getngstocklist(today){
			var that = this;
			const result = await that.$api.interfaceApi('getngstocklist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid')
			});
			if (result.ret === 1) {
          that.$api.msg(result.erroinfo);
          console.log(result.data.last30amount, '789789789')
					if(result.data.last30amount.length){
            that.StockTableData = result.data.last30amount
            that.StockTableData1 = result.data.last30amount
            that.StockTableData2 = result.data.last60amount
            that.StockTableData3 = result.data.last90amount
          }
          console.log(that.StockTableData, '99999999')
				} else {
					that.$api.msg(result.erroinfo);
				}
		},
    selectTime(type){
      console.log(type)

      if(type==1){
        this.showData = '30天'
        this.StockColumns = this.StockColumns
        this.StockTableData = this.StockTableData
      }else if(type==2){
        this.showData = '60天'
        this.StockColumns = this.StockColumns2
        this.StockTableData = this.StockTableData2
      }else if(type==3){
        this.showData = '90天'
        this.StockColumns = this.StockColumns3
        this.StockTableData = this.StockTableData3
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
</style>