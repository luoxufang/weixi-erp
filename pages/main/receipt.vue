<template>
	<view class="table-box" style="background:#fff;">

     <view class="notice-text">过期应收款是<text class="red">{{payamount}}</text>万元，逾期付款<text class="red">{{recamount}}</text>万元</view>

		<view class="selectPeople" @click.stop="toggleSelect()">
      <view class="title">请选择</view>
      <view class="right">
        <button type="default" size="mini">{{showData}}</button>
        <image class="image" src="/static/xiala2.png" />

        <view class="toggle-view" :class="selectClass">
          <view class="item-scroll-view">
            <view class="item" @click="selectTime(1)">客户</view>
            <view class="item" @click="selectTime(2)">供应商</view>
          </view>
        </view>

      </view>
    </view>

    <view class="table">
			<z-table :tableData='MoneyTableData' :columns='MoneyColumns' stickSide='true'></z-table>
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
      rectype: '39',
      selectClass: 'none',
      showData: '客户',
      payamount:'0', // 过期应收款
      recamount:'0',// 逾期付款
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

      // 收款
			MoneyColumns: [{
        title: "客户名称",
        key: "custname",
        width: 240
      }, {
        title: "本期应收余额",
        key: "num_10", //num_10-getamount
        width: 240
      }, {
        title: "当期逾期款",
        key: "getamount",
        width: 240
      }],

      MoneyTableData: [],

      MoneyColumns2: [{
        title: "供应商名称",
        key: "custname",
        width: 240
      }, {
        title: "本期应付余额",
        key: "num_10",
        width: 240
      }, {
        title: "当期逾期款",
        key: "getamount",  // num_10-getamount
        width: 240
      }],
      StockTableData1:[],
      StockTableData2:[]
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
    
    this.payamount = options.payamount
    this.recamount = options.recamount

		this.getreclist(today,today)
		
	},
  methods:{
    // 收款 
		async getreclist(today){
			var that = this; 
			const result = await that.$api.interfaceApi('getreclist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				rectype: this.rectype, // 39应收款  40应付款  num_10-getamount
			});
			console.log(result)
			if (result.ret === 1) {
					that.$api.msg(result.erroinfo);
					if(result.data.result.length){
            
            if(that.rectype=='39'){
              that.MoneyColumns = that.MoneyColumns
              var aaaa = result.data.result.map((item)=>{
                item.num_10 = parseFloat(item.num_10) - parseFloat(item.getamount)
                return item
              })
              that.MoneyTableData = aaaa

            }else if(that.rectype=='40'){
              that.MoneyColumns = that.MoneyColumns2

              var bbbb = result.data.result.map((item)=>{
                item.getamount = parseFloat(item.num_10) - parseFloat(item.getamount)
                return item
              })
              that.MoneyTableData = bbbb
            }
					}else{
            that.SaleOrderTableData = []
					  that.$api.msg('暂无数据');
          }
				} else {
					this.$api.msg(result.erroinfo);
				}
		},
    selectTime(type){
      if(type==1){
        if(this.rectype=='39') return
        this.showData = '客户'
        this.rectype = '39'
        this.getreclist()
      }else if(type==2){
        if(this.rectype=='40') return
        this.showData = '供应商'
        this.rectype = '40'
        this.getreclist()
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