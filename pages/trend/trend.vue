<template>
	<view class="qiun-columns">
		<view class="data-box" @click="open">
      <text style="font-size:28upx;">选择时间</text>
			<view class="firstTime">{{startDate}}</view>
			<image class="image" src="/static/xiala.png" />
			<text>到</text>
			<view class="endTime">{{endDate}}</view>
			<image class="image" src="/static/xiala.png" />
		</view>


		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
			<view class="qiun-title-dot-light" style="padding-left:20upx;">基本折线图</view>
		</view>
		<view class="qiun-charts" >
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
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
	var canvaLineA=null;
	export default {
		components:{
			uniCalendar
		},
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				dataList:'',

				startDate:'',
				endDate:'',
				today:'',
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


			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getServerData();

			// 趋势区间
			this.getstocktrendlist()
		},
		methods: {
    async getstocktrendlist(startdate,enddate){
      const result = await this.$api.interfaceApi('getstocktrendlist')({
				token: uni.getStorageSync('token'),
        shopid: uni.getStorageSync('shopid'),
        startdate: startdate,
        enddate: '2020-05-17',
				keyword: '',
				stocktype: '1'
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
			getServerData(){
				uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data:{
					},
					success: function(res) {
						console.log(res.data.data)
						let LineA={categories:[],series:[]};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						LineA.categories=res.data.data.LineA.categories;
						LineA.series=res.data.data.LineA.series;
						_self.showLineA("canvasLineA",LineA);
					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
			},
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'line',
					fontSize:11,
					legend:{show:true},
					dataLabel:false,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:8
					},
					yAxis: {
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:8,
						splitNumber:5,
						min:10,
						max:180,
						format:(val)=>{return val.toFixed(0)+'元'}
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					}
				});
				
			},
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
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
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	
	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
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

	
</style>
