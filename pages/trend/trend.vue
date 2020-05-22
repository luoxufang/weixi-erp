<template>
	<view class="qiun-columns">
		<!-- <view class="data-box" @click="open">
      <text style="font-size:28upx;">选择时间</text>
			<view class="firstTime">{{startDate}}</view>
			<image class="image" src="/static/xiala.png" />
			<text>到</text>
			<view class="endTime">{{endDate}}</view>
			<image class="image" src="/static/xiala.png" />
		</view> -->

		<view class="time-btn">
			<text style="font-size:28upx;">日期范围</text>
			<button class="mini-btn" :class="timeType=='today'&&today==startDate&&today==endDate?'active':''" @click="changeData('today')" type="default" size="mini">本日</button>
			<button class="mini-btn" :class="timeType=='week'?'active':''" @click="changeData('week')" type="default" size="mini">本周</button>
			<button class="mini-btn" :class="timeType=='month'?'active':''" @click="changeData('month')" type="default" size="mini">本月</button>
			<button class="mini-btn" :class="timeType=='year'?'active':''" @click="changeData('year')" type="default" size="mini">本年</button>
		</view>


		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
			<view class="qiun-title-dot-light">基本柱状图</view>
			<view class="changeChart" @click="changeChart()">{{chartType=='1'?'切换竖屏':'切换横屏'}}</view>
		</view>
		<view class="qiun-charts" v-if="chartType=='1'">
			<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
		</view>
		<view class="qiun-charts-rotate" v-else>
			<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts-rotate" @touchstart="touchColumn2"></canvas>
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
  import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaColumn=null;
	export default {
		components:{
			uniCalendar
		},
		data() {
			return {
				cWidth:'',
				cHeight:'',
				cWidth2:'',//横屏图表
				cHeight2:'',//横屏图表
				pixelRatio:1,
				serverData:'',
				chartType: '1', // 横屏或者竖屏
				commonColumn: {},

				dataList:'',
				stocktype: '1',

				startDate:'',
				endDate:'',
				today:'',
				categories:['2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'],
				series:[
					{
						name:'成交量1',
						data: [15,20,45,37,43,34,35,21,18,20]
					},
					{
						name:'成交量2',
						data: [30,40,25,14,34,18,34,19,24,20]
					},
					{
						name:'成交量3',
						data: [16,27,63,40,37,25,15,45,36,20]
					},
				]
			}
		},
		onLoad() {
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

// ------------------------------------------
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.cWidth2=uni.upx2px(700);
			this.cHeight2=uni.upx2px(1000)
			// 测试数据
			this.getServerData();
// ------------------------------------------

			// 趋势区间
			this.getstocktrendlist(today, today)
		},
		methods: {
			async getstocktrendlist(startdate, enddate){
				const result = await this.$api.interfaceApi('getstocktrendlist')({
					token: uni.getStorageSync('token'),
					shopid: uni.getStorageSync('shopid'),
					startdate: startdate,
					enddate: '2020-05-17',
					stocktype: this.stocktype
				});
				
				if (result.ret === 1) {
					if(result.data.result.length>0){
						this.$api.msg(result.erroinfo);
						this.dataList = result.data.result
					}else{
						this.dataList = []
						this.$api.msg('暂无数据');
					}
				} else {
					this.$api.msg(result.erroinfo);
				}
			},
			changeChart(){
				if(this.chartType=='1'){
					this.chartType = '2'
					// 竖屏
						_self.showColumnColumn("canvasColumn",this.commonColumn);
				}else if(this.chartType == '2'){
					this.chartType = '1'
					this.showColumn("canvasColumn",this.commonColumn);
				}
			},
			getServerData(){
				uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data:{
					},
					success: function(res) {
						console.log(res.data.data)
						//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
						_self.serverData=res.data.data;

						let Column={categories:[],series:[]};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Column.categories=_self.categories;
						Column.series=_self.series;
						_self.commonColumn = Column
						// 横屏
						_self.showColumn("canvasColumn",Column);

					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
			},
			showColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					legend:{show:true},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid:true,
					},
					yAxis: {
						//disabled:true
					},
					dataLabel: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						column: {
							type:'group',
							width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length
						}
					}
				});
				
			},
			touchColumn(e){
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						if(typeof item.data === 'object'){
							return category + ' ' + item.name + ':' + item.data.value 
						}else{
							return category + ' ' + item.name + ':' + item.data 
						}
					}
				});
			},
			showColumnColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					legend:{show:true},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					rotate:true,
					// #ifdef MP-ALIPAY || MP-BAIDU
					rotateLock:true,//百度及支付宝需要锁定旋转
					// #endif
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid:true,
					},
					yAxis: {
						//disabled:true
					},
					dataLabel: true,
					width: _self.cWidth2*_self.pixelRatio,
					height: _self.cHeight2*_self.pixelRatio,
					extra: {
						column: {
							type:'group',
							width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length,
							meter:{
								//这个是外层边框的宽度
								border:4,
								//这个是内部填充颜色
								fillColor:'#E5FDC3'
							}
						}
					  }
				});
				
			},
			touchColumn2(e){
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
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
						// this.getmrpitemlist(e.range.before,e.range.after)
					}else{
						this.startDate = e.range.after
						this.endDate = e.range.before
						// this.getmrpitemlist(e.range.after,e.range.before)
					}
					
				} else {
					this.startDate = e.fulldate
					this.endDate = e.fulldate
					// this.getmrpitemlist(e.fulldate,e.fulldate)
				}
			}
		}
	}
</script>

<style lang='scss'>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/

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

.time-btn{
	display: flex;
	align-items: center;
	padding: 0 20upx;
	margin: 30upx 0;
}

page{background:#F2F2F2;width: 750upx;overflow-x: hidden;}
.qiun-padding{padding:2%; width:96%;}
.qiun-wrap{display:flex; flex-wrap:wrap;}
.qiun-rows{display:flex; flex-direction:row !important;}
.qiun-columns{display:flex; flex-direction:column !important;}
.qiun-common-mt{margin-top:10upx;}
.qiun-bg-white{
	background:#FFFFFF;
	display: flex;
	align-items: center;
	.changeChart{
		color: red;
		font-size: 28upx;
		font-weight: 600;
	}
}
.qiun-title-bar{width:96%; padding:10upx 2%; flex-wrap:nowrap;}
.qiun-title-dot-light{border-left: 10upx solid #0ea391; padding-left: 10upx; font-size: 32upx;color: #000000;flex: 1;}
.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.charts{width: 750upx; height:500upx;background-color: #FFFFFF;}



/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
.qiun-charts-rotate {
	width: 700upx;
	height: 1000upx;
	background-color: #FFFFFF;
	padding: 25upx;
}

.charts-rotate {
	width: 700upx;
	height: 1000upx;
	background-color: #FFFFFF;
}


</style>
