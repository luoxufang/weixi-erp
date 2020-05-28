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

		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
		</view>

		<view class="time-btn">
			<text style="font-size:28upx;">日期范围</text>
			<button class="mini-btn" :class="timeType=='week'?'active':''" @click="changeData('week')" type="default" size="mini" hover-class="cell-hover" :hover-stay-time="50">前四周</button>
			<button class="mini-btn" :class="timeType=='month'?'active':''" @click="changeData('month')" type="default" size="mini" hover-class="cell-hover" :hover-stay-time="50">前十天</button>
			<!-- <button class="mini-btn" :class="timeType=='year'?'active':''" @click="changeData('year')" type="default" size="mini" hover-class="cell-hover" :hover-stay-time="50">按今年</button> -->
		</view>

		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">基本柱状图</view>
			<view v-if="categories.length>6" class="changeChart" @click="changeChart()">{{chartType=='1'?'切换竖屏':'切换横屏'}}</view>
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
	import util from '@/util.js';
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

				stocktype: '1',

				startDate:'',
				endDate:'',
				today:'',
				// categories:['2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'],
				// series:[
				// 	{
				// 		name:'成交量1',
				// 		data: [15,20,45,37,43,34,35,21,18,20]
				// 	},
				// 	{
				// 		name:'成交量2',
				// 		data: [30,40,25,14,34,18,34,19,24,20]
				// 	},
				// 	{
				// 		name:'成交量3',
				// 		data: [16,27,63,40,37,25,15,45,36,20]
				// 	},
				// ],
				categories:[],
				series:[],
				commonSeries:[],
				dataList:[], // 公共时间数组
				monthTimeList:[], // 半个月前 时间数组
				weekTimeList:[], // 四周前 时间数组
				yearTimeList:[], // 一整年

		   	timeType: 'week',// week, month, year
				tabCurrentIndex: 0,
				navList: [
					{
						state: 0,
						text: '原材料存货金额',
						loadingType: 'more',
						rankList: []
					},
					{
						state: 1,
						text: '半成品存货金额',
						loadingType: 'more',
						rankList: []
					},
					{
						state: 2,
						text: '成品存货金额',
						loadingType: 'more',
						rankList: []
					}
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
			this.weekTimeList.push(this.today)
			this.startDate = today
			this.endDate = today
			
			// 循环获取当前 前四周
			for(var i=1;i<4;i++){
				this.weekTimeList.push(util.getymd(util.yugi(i*7)))
			}
			console.log( util.getAll( util.getymd(util.yugi(6)), this.today) )

			this.dataList = this.weekTimeList
			this.monthTimeList = util.getAll( util.getymd(util.yugi(9)), this.today)

// ------------------------------------------
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.cWidth2=uni.upx2px(700);
			this.cHeight2=uni.upx2px(1000)
			// 测试数据
			// this.getServerData();
// ------------------------------------------

			// 趋势区间
			this.getstocktrendlist(today, today)
		},
		methods: {
			getData(dataList){
				var that = this
				return new Promise((resolve, reject) => {
					uni.showLoading();
					uni.request({
						url: "https://wechat.yiyuanerp.com/home/report/getstocktrendlist",
						data: {
							token: uni.getStorageSync('token'),
							shopid: uni.getStorageSync('shopid'),
							startdate: '',
							enddate: dataList,
							stocktype: that.stocktype
						},
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: function(result) {
							var data = result.data.data.result
							var bbbb = util.deepClone(that.commonSeries) // 数组深拷贝
							for(var i=0;i<data.length;i++){
								let temp = Math.abs(parseFloat(data[i].prodcount))
								// console.log(temp)
								bbbb[i].name = data[i].prodtypefullname
								bbbb[i].data.push(temp)
							}
							that.commonSeries = bbbb
							// debugger
							resolve(bbbb);
							uni.hideLoading();
							// console.log(that.commonSeries)
							// resolve(result.data);
						},
						fail: function(res) {
							reject(res);
							uni.hideLoading();
						}
					});
				})
			},
			deleteArr(){
				var that = this
				var i = 1;
				return new Promise((resolve, reject)=>{
					var isStemp = util.deepClone(that.commonSeries)
					let i= isStemp.length;
					while(i--) {
				　　if (!isStemp[i].name) {
							isStemp.splice(i, 1);
				　　}
					}

					that.commonSeries = isStemp
					// console.log(isStemp, '110')
					resolve(isStemp)
				})
			},
			async getstocktrendlist(startdate, enddate){
				
				let that = this
				let dataList = this.dataList
				this.categories = dataList //-----------------------------------
				let series = []
				let stemp = {
					name:'',
					data:[]
				}
				// 循环添加 stemp 对象
				var commonSeries = dataList.map((item)=>{
					series.push(stemp)
					return item
				})
				that.commonSeries = series

				for ( let i=0; i< dataList.length; i++ ) {
					//await的必须是个Promise
					await that.getData(dataList[i]).then((data)=>{
						console.log("当前异步完成了，可以进行下次循环", i);
						// console.log(data)
					});
				}

				// 去除 空数据的item
				await that.deleteArr().then((deleteArr)=>{
					// console.log(deleteArr, '999999999999')
					that.commonSeries = deleteArr
				})

				let Column={categories:[],series:[]};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				Column.categories=that.categories; // 各类时间
				Column.series=that.commonSeries // 颜色各类
				that.commonColumn = Column // 存储公共图表数据
				// 初始 为横屏
				that.showColumn("canvasColumn",Column);
				
				console.log(that.commonSeries)
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
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
				this.stocktype = (index + 1) + ''
				if(this.navList[index].loadingType=='none') return
				this.getstocktrendlist();
			},
			changeData(type){
				// 请求 相关 table :  today, week, month, year
				if(this.timeType==type) return  // 处理重复点击

				if(type=='week'){
					this.dataList = this.weekTimeList
					this.getstocktrendlist()
				}else if(type=='month'){
					this.dataList = this.monthTimeList
					this.getstocktrendlist()

				}else if(type=='year'){
					this.dataList = this.monthTimeList
					this.getstocktrendlist()
				}
				this.timeType = type
				
			},
			getServerData(){
				uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data:{},
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
.cell-hover{
	background:#fafafa;
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

.navbar {
	display: flex;
	height: 40px;
	padding: 0 5px;
	background: #fff;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 10;
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 15px;
		color: $font-color-dark;
		position: relative;
		&.current {
			color: $base-color;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 44px;
				height: 0;
				border-bottom: 2px solid $base-color;
			}
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
	margin-left: 30upx;
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
