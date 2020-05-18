<template>
	<view class="content">
		<view class="shop-list">
      <view class="item" v-for="(item, index) in shopList" :key="index" @click="selectShop(item)">{{index+1}}、{{item.shopname}}</view>
    </view>

    <view class="tuichu-btn-box">
      <view class="tuichu-btn" @click="loginout()">退出登录</view>
    </view>
    
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
    data(){
      return{
        shopList:[]
      }
    },
		computed: {
			...mapState(['hasLogin', 'forcedLogin', 'shopName'])
    },
    onLoad(){
      if(uni.getStorageSync('shopList')){
        this.shopList = uni.getStorageSync('shopList')
      }
      
    },
		methods: {
			...mapMutations(['logout', 'changeShopName']),
			bindLogin() {
				uni.navigateTo({
					url: '../login/login',
				});
			},
			selectShop(item) {
        uni.showLoading();
        uni.setStorageSync('shopid', item.shopid);
        uni.setStorageSync('shopname', item.shopname);
        this.changeShopName(item.shopname);
        setTimeout(() => {
          uni.hideLoading();
          uni.redirectTo({
            url: '/pages/main/main'
          });
        }, 500);
				
			}
    },
    loginout(){
      let that = this;
      uni.showModal({
        content: '确定退出登录？',
        success: function (res) {
          if (res.confirm) {
            uni.setStorageSync('token', '');
            uni.setStorageSync('shopid', '');
            uni.redirectTo({
              url:'/pages/public/login'
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
      
    },
	}
</script>

<style lang="scss">
.content{
  background: #fff;
  position: relative;
}
.shop-list{
  height: 100upx;
  line-height: 100upx;
  font-size: 30upx;
  color: #333;
  .item {
    border-bottom: 2upx solid #f5f5f5;
  }
}
.shop-list .item:last-child{
  border-bottom: 0;
}
.tuichu-btn-box{
  position: fixed;
  background-color: #fff;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30upx;
  box-sizing: border-box;
  .tuichu-btn{
    width: 100%;
    height: 78upx;
    line-height: 78upx;
    background-color: #18559E;
    text-align: center;
    color: #fff;
    border-radius: 12upx;
  }
}
</style>
