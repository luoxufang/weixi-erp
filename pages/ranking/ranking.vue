<template>
  <view class="ranking-box">
    <view class="position-view">
      <view class="navbar">
        <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
      </view>

      <view class="data-box" @click="open">
        <!-- <text style="font-size:28upx;">选择时间</text> -->
        <view class="firstTime">{{startDate}}</view>
        <image class="image" src="/static/xiala.png" />
        <text>到</text>
        <view class="endTime">{{endDate}}</view>
        <image class="image" src="/static/xiala.png" />
      </view>
    </view>

    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 空白页 -->
					<empty v-if="tabItem.rankList.length === 0"></empty>

          <view class="cart-backgound-box">
            <image class="image" src="/static/cart.png" />
          </view>
          <view class="top-three-box" v-if="tabItem.rankList.length">
            <view class="top-three-item two" v-if="tabItem.rankList[1].username">
              <view class="image-box">
                <image class="image" src="/static/one.png" />
              </view>
              <view class="name">{{tabItem.rankList[1].username||'无名字'}}</view>
              <view class="money">￥{{tabItem.rankList[1].totalamount}}</view>
            </view>

            <view class="top-three-item one" v-if="tabItem.rankList[0].totalamount">
              <view class="image-box">
                <image class="image" src="/static/aa.png" />
              </view>
              <view class="name">{{tabItem.rankList[0].username||'无名字'}}</view>
              <view class="money">￥{{tabItem.rankList[0].totalamount}}</view>
            </view>
            
            <view class="top-three-item three" v-if="tabItem.rankList[2].username">
              <view class="image-box">
                <image class="image" src="/static/one.png" />
              </view>
              <view class="name">{{tabItem.rankList[2].username||'无名字'}}</view>
              <view class="money">￥{{tabItem.rankList[2].totalamount}}</view>
            </view>
          </view>

          <view class="rank-list">
            <block v-for="(item, index) in tabItem.rankList" :key="index">
              <view class="item" v-if="index>2">
                <view class="heard-view">
                  <text class="number">{{index+1}}</text>
                  <text style="margin-left:30upx;">{{item.username||'无名字'}}</text>
                </view>
                <view>￥{{item.totalamount}}</view>
              </view>
            </block>
          </view>

					<!-- 数据列表 -->
					<!-- <view v-for="(item, index) in tabItem.rankList" :key="index" class="order-item"></view> -->

					<!-- <uni-load-more :status="tabItem.loadingType"></uni-load-more> -->
				</scroll-view>
			</swiper-item>
		</swiper>

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
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty/empty.vue';
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
export default {
  components:{
    uniLoadMore,
    empty,
    uniCalendar
  },
  data() {
    return {
      startDate: '',
			endDate: '',
      showCalendar: false,
      toptype: '1', // tab类型
      info: {
				date: '',
				startDate: '2019-06-15',
				endDate: '2019-010-15',
				lunar: true,
				range: true,
				insert: false,
				selected: []
			},
      tabCurrentIndex: 0,
      dataList:[],
      navList: [
				{
					state: 0,
					text: '业务员排名',
					loadingType: 'more',
					rankList: []
				},
				{
					state: 1,
					text: '客户排名',
					loadingType: 'more',
					rankList: []
				},
				{
					state: 2,
					text: '部门排名',
					loadingType: 'more',
					rankList: []
				}
			]
    }
  },
  onLoad(){
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
    
    this.gettopsalelist(today,today)
  },
  
  methods: {
    async gettopsalelist(startdate,enddate){
      const result = await this.$api.interfaceApi('gettopsalelist')({
				token: uni.getStorageSync('token'),
        shopid: uni.getStorageSync('shopid'),
        startdate: startdate,
        enddate: enddate,
        toptype: this.toptype,//1业务员 2客户 3部门
      });
      if (result.ret === 1) {
				if(result.data.result.length>0){
          var aaaa = result.data.result.map((item)=>{
            item.totalamount = parseFloat(item.totalamount).toFixed(2)
            return item
          })
          switch (this.toptype) {
            case '1':
              this.navList[0].rankList = aaaa
              // this.navList[0].loadingType = 'none'
              break;
            case '2':
              this.navList[1].rankList = aaaa
              // this.navList[1].loadingType = 'none'
              break;
            case '3':
              this.navList[2].rankList = aaaa
              // this.navList[2].loadingType = 'none'
              break;
          
            default:
              break;
          }
          this.$api.msg(result.erroinfo);
          
				}else{
					switch (this.toptype) {
            case '1':
              // this.navList[0].loadingType = 'none'
              this.navList[0].rankList = []
              break;
            case '2':
              // this.navList[1].loadingType = 'none'
              this.navList[1].rankList = []
              break;
            case '3':
              // this.navList[2].loadingType = 'none'
              this.navList[2].rankList = []
              break;
          
            default:
              break;
          }
					this.$api.msg('暂无数据');
				}
			} else {
				this.$api.msg(result.erroinfo);
			}
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
          this.gettopsalelist(e.range.before,e.range.after)
        }else{
          this.startDate = e.range.after
          this.endDate = e.range.before
          this.gettopsalelist(e.range.after,e.range.before)
        }
        
      } else {
        this.startDate = e.fulldate
        this.endDate = e.fulldate
        this.gettopsalelist(e.fulldate,e.fulldate)
      }
		},
    //swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.detail.current;
      this.toptype = (e.detail.current + 1) + ''
      if(this.navList[e.detail.current].loadingType=='none') return
      this.gettopsalelist(this.startDate, this.endDate);
    },
    //顶部tab点击
    tabClick(index) {
      this.tabCurrentIndex = index;
      this.toptype = (index + 1) + ''
      if(this.navList[index].loadingType=='none') return
      this.gettopsalelist(this.startDate, this.endDate);
    }
  }
}
</script>
<style lang="scss">
.ranking-box{
  width: 100%;
  padding-top: 160upx;
  .position-view{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
  }
}
.swiper-box {
	height: calc(100% - 40px);
}
.list-scroll-content {
  height: 100%;
  .cart-backgound-box{
    background: #F3F2DE;
    height: 280upx;
    display: flex;
    // align-items: center;
    justify-content: center;
    .image{
      width: 140upx;
      height: 140upx;
      margin-top: 40upx;
    }
  }
  .top-three-box{
    position: relative;
    display: flex;
    flex-wrap: wrap-reverse;
    margin-top: -60upx;
    .top-three-item{
      flex: 1;
      height: 220upx;
      background: #fff;
      box-shadow: 0px 2px 10px 0px rgba(192, 192, 192, 0.3);
      border-radius: 20upx;
      .image-box {
        display: flex;
        justify-content: center;
      }
      .image {
        width: 60upx;
        height: 60upx;
        margin-top: -30upx;
      }
      .name {
        text-align: center;
        margin-top: 20upx;
      }
      .money {
        text-align: center;
        margin-top: 40upx;
        font-size: 26upx;
        color: #666;
      }
    }
    .one{
      height: 240upx;
      .name{
        margin-top: 40upx;
      }
    }
    .three{
      height: 210upx;
      .name{
        margin-top: 10upx;
      }
    }
  }
}

.data-box{
	display: flex;
	align-items: center;
	padding: 20upx;
	font-size: 28upx;
  justify-content: center;
  background: #fff;
	text{
		margin: 0 20upx;
	}
	.image{
		width: 28upx;
		height: 28upx;
	}
}
.rank-list{
  font-size: 30upx;
  color: #333;
  padding: 0 40upx;
  margin-top: 20upx;
  .item {
    border-bottom: 2upx solid #f5f5f5;
    height: 120upx;
    display: flex;
    align-items: center;
    .heard-view{
      flex: 1;
      .number{
        display: inline-block;
        width: 50upx;
        height: 50upx;
        line-height: 50upx;
        text-align: center;
        background: #DADADA;
        color: #333;
        border-radius: 12upx;
      }
    }
  }
}
.rank-list .item:last-child{
  border-bottom: 0;
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
</style>