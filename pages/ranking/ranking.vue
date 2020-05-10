<template>
  <view class="ranking-box">
    <view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
		</view>

    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.rankList.length === 0"></empty>

          <view class="cart-backgound-box">
            <image class="image" src="/static/cart.png" />
          </view>
          <view class="top-three-box">
            <view class="top-three-item two">
              <view class="image-box">
                <image class="image" src="/static/aa.png" />
              </view>
              <view class="name">张三</view>
              <view class="money">￥11111.00</view>
            </view>

            <view class="top-three-item one">
              <view class="image-box">
                <image class="image" src="/static/aa.png" />
              </view>
              <view class="name">李四</view>
              <view class="money">￥11111.00</view>
            </view>
            
            <view class="top-three-item three">
              <view class="image-box">
                <image class="image" src="/static/aa.png" />
              </view>
              <view class="name">王五</view>
              <view class="money">￥11111.00</view>
            </view>
          </view>

          <view class="rank-list">
            <view class="item">
              <view class="heard-view">
                <text class="number">3</text>
                <text style="margin-left:30upx;">亿源科技</text>
              </view>
              <view>￥7779.00</view>
            </view>
            <view class="item">
              <view class="heard-view">
                <text class="number">3</text>
                <text style="margin-left:30upx;">老北京布鞋</text>
              </view>
              <view>￥88888.00</view>
            </view>
            <view class="item">
              <view class="heard-view">
                <text class="number">4</text>
                <text style="margin-left:30upx;">传奇经典</text>
              </view>
              <view>￥66666.00</view>
            </view>
            <view class="item">
              <view class="heard-view">
                <text class="number">5</text>
                <text style="margin-left:30upx;">统一香飘飘</text>
              </view>
              <view>￥99999.00</view>
            </view>
          </view>

					<!-- 数据列表 -->
					<view v-for="(item, index) in tabItem.rankList" :key="index" class="order-item">

						
          

					</view>

					<!-- <uni-load-more :status="tabItem.loadingType"></uni-load-more> -->
				</scroll-view>
			</swiper-item>
		</swiper>


  </view>
</template>
<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty/empty.vue';
export default {
  components:{
    uniLoadMore,
    empty
  },
  data() {
    return {
      tabCurrentIndex: 0,
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
  methods: {
    //swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
      // this.loadData('tabChange');
    },
    //顶部tab点击
    tabClick(index) {
      this.tabCurrentIndex = index;
    }
  }
}
</script>
<style lang="scss">
.ranking-box{
  width: 100%;
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