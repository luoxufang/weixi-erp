<template>
	<view class="table-box" style="background:#fff;">

    <view class="notice-text">你超过的交期生产订单是<text class="red">{{totalworkcount}}</text>，是否忘记入库还是真的超交期？</view>

    <!-- 价格 选择 -->
		<!-- <view class="btn-box">
			<view class="commomStyle left" :class="billtype=='1'?'active':''" @click="changePriceType(1)">客户</view>
			<view class="commomStyle right" :class="billtype=='2'?'active':''" @click="changePriceType(2)">供应商</view>
		</view> -->

    <view class="table">
			<z-table :tableData='DeliveryTableData' :columns='DeliveryColumns' stickSide='true'></z-table>
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
			today: '', // 今天
      billtype: '3',
      selectClass: 'none',
      totalworkcount: '0', // 生产
      totalsalecount:'0', // 交期销售订单额
      totalpurcount:'0', // 交期采购订单额
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
        // 
				DeliveryColumns: [{
					title: "生产订单",
					key: "billcode"
				}, {
					title: "日期",
					key: "billdate",
					width: 200
				}, {
					title: "物料编码",
					key: "prodno",
					width: 200
				}, {
					title: "商品名称",
					key: "prodname",
					width: 240
				}, {
					title: "生产数量",
					key: "outprodcount",
					width: 150
				}, {
					title: "超过交期天数",
					key: "nextcomudate", // 今天 - nextcomudate
					width: 200
				}],
        DeliveryTableData: [],
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
    this.totalworkcount = options.totalworkcount

		this.getoverdatelist(today,today)
		
	},
  methods:{
    // 交期
		async getoverdatelist(today){
			var that = this; 
			const result = await that.$api.interfaceApi('getoverdatelist')({
				token: uni.getStorageSync('token'),
				shopid: uni.getStorageSync('shopid'),
				overtype: this.billtype, //1 销售订单 2采购订单 3生产订单
			});
			// console.log(result)
			if (result.ret === 1) {
					that.$api.msg(result.erroinfo);
					if(result.data.result.length){
            if(that.billtype=='1'){ // 客户
							that.DeliveryColumns = that.DeliveryColumns
							var data = result.data.result.map((item)=>{
								item.nextcomudate = util.GetNumberOfDays(item.txt_12, that.today)
								return item
							})
              that.DeliveryTableData = data

            }else if(that.billtype=='2'){ // 供应商
							that.DeliveryColumns = that.DeliverySupplierColumns
							var data = result.data.result.map((item)=>{
								item.nextcomudate = util.GetNumberOfDays(item.txt_12, that.today)
								return item
							})
              that.DeliveryTableData = data

            }else if(that.billtype=='3'){ // 生产
							that.DeliveryColumns = that.DeliverySupplierColumns
							var data = result.data.result.map((item)=>{
								item.nextcomudate = util.GetNumberOfDays(item.finishdate, that.today)
								return item
							})
              that.DeliveryTableData = data
              
            }
					}else{
            that.DeliveryTableData = []
					  that.$api.msg('暂无数据');
          }
				} else {
					this.$api.msg(result.erroinfo);
				}
		},
    changePriceType(type){
      if(type==1){
        if(this.billtype=='1') return
        // this.showData = '客户'
        this.billtype = '1'
        this.getoverdatelist()
      }else if(type==2){
        if(this.billtype=='2') return
        // this.showData = '供应商'
        this.billtype = '2'
        this.getoverdatelist()
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

.btn-box{
	margin: 20upx 100upx;
	height: 60upx;
	display: flex;
	.commomStyle{
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1upx solid #0084FF;
		font-size: 28upx;
		&.right{
			background: #fff;
			color: #0084FF;
			&.active{
				background: #0084FF;
				color: #fff;
			}
		}
		&.left{
			&.active{
				background: #0084FF;
				color: #fff;
			}
		}
	}
}
</style>