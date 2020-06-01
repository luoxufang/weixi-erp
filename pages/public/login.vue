<template>
	<view class="container">
		<!-- <view class="left-bottom-sign"></view> -->
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- <view class="right-top-sign"></view> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="logo-view">
			<image class="logo" src="/static/logo.png" mode="aspectFill" />
		</view>
		<view class="wrapper">
			<!-- <view class="left-top-sign">LOGIN</view>
			<view class="welcome">欢迎回来！</view> -->
			<view class="input-content">
				<view class="input-item">
					<!-- <text class="tit">云账号</text> -->
					<view class="input-img">
						<image class="image" src="/static/logo_yun.png" mode="aspectFill" />
					</view>
					<input v-model="cloudusername" placeholder="请输入云账号" placeholder-class="input-empty" />
				</view>
					<view class="input-item">
					<!-- <text class="tit">用户名</text> -->
					<view class="input-img">
						<image class="image" src="/static/logo_user.png" mode="aspectFill" />
					</view>
					<input v-model="username" placeholder="请输入用户名" placeholder-class="input-empty" />
				</view>
				<view class="input-item">
					<view class="input-img">
						<image class="image" src="/static/logo_password.png" mode="aspectFill" />
					</view>
					<input
						type="mobile"
						v-model="password"
						placeholder="请输入密码"
						placeholder-class="input-empty"
						maxlength="20"
						@confirm="toLogin"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin">登录</button>
			<!-- <view class="forget-section">注册用户</view> -->
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegist('/pages/public/register')" >马上注册</text>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	data() {
		return {
			cloudusername: '',
			username: '',
			password: '',
			logining: false,
			code: ''
		};
	},
	onLoad() {},
	methods: {
		...mapMutations(['login', 'getShopList']),
		inputChange(e) {
			console.log(e)
		},
		navBack() {
			uni.navigateBack();
		},
		toRegist(url) {
			// 跳转链接
			uni.navigateTo({
				url
			});
		},
		async toLogin() {
			var RegExp = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
			const { cloudusername, username, password } = this;
			//数据验证模块
      if(!cloudusername){
				this.$api.msg('请输入云账号')
      }else if(!username){
				this.$api.msg('请输入用户名')
      }else if (!password) {
				this.$api.msg('请输入密码')
      }else {
				let that = this;
				/* 微信登录 */
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success (res) {
									if (res.code) {
										console.log(res.code, 'code')
										that.code = res.code
										// 根据code 获取openid
										that.getCode()
									} else {
										console.log('登录失败！' + res.errMsg)
										this.$api.msg(res.errMsg);
									}
								}
							})

						}
					}
				})
			}

		},
		async getCode(){
			//发起网络请求
			const result = await this.$api.interfaceApi('codeReplaceOpenid')({
				cloudusername: this.cloudusername,
				username: this.username,
				password: this.password,
				code: this.code
			});

			if ( result.ret === 1) {
				// uni.navigateBack();
				// 根据openid 获取登录态 token
				this.goToLogin(result.data.openid)
			} else {
				this.$api.msg(result.msg);
			}
		},
	 	async goToLogin(openid){
			//请求登录 获取登录态 token
			const result = await this.$api.interfaceApi('wxlogin')({
				cloudusername: this.cloudusername,
				username: this.username,
				password: this.password,
				code: this.code,
				openid
			});
			if (result.ret === 1) {
				let data = Object.assign({ openid:openid },result.data)
				this.login(result.data);
				uni.setStorageSync('token', result.data.token);
				
				uni.showLoading();
				this.selectShops(result.data.token) // 选择店铺
			} else {
				uni.hideLoading();
				this.$api.msg(result.erroinfo);
			}
		},
	  async selectShops(token){
			const result = await this.$api.interfaceApi('getShopIndex')({
				token: token
			});
			if (result.ret === 1) {
				uni.hideLoading();
				// uni.setStorageSync('shopid', result.data.id);
				uni.setStorageSync('shopList', result.data.res_shop);
				this.getShopList(result.data.res_shop)
				uni.redirectTo({
					url: '/pages/shop/shop'
				});
			} else {
				uni.hideLoading();
				this.$api.msg(result.erroinfo);
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.container {
	padding-top: 45px;
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
	.input-empty{
		font-size: 26upx;
		color: #999;
	}
	.logo-view{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 200upx;
		image{
			width: 408upx;
			height: 90upx;
		}
	}
}
.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
}
.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	padding-top: var(--status-bar-height);
	top: 40upx;
	font-size: 40upx;
	color: $font-color-dark;
}
.left-top-sign {
	font-size: 120upx;
	color: $page-color-base;
	position: relative;
	left: -16upx;
}
.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;
	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #b4f3e2;
	}
	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}
	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	position: relative;
	left: 50upx;
	top: -90upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
	padding: 0 60upx;
}
.input-item {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	// padding: 0 30upx;
	// background: $page-color-light;
	height: 90upx;
	// border-radius: 4px;
	border-bottom: 2upx solid #EEEEEE;
	margin-bottom: 28upx;
	&:last-child {
		margin-bottom: 0;
	}
	.tit {
		width: 120upx;
		line-height: 90upx;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}
	.input-img{
		// width: 80upx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30upx;
		image{
			width: 60upx;
			height: 60upx;
		}
	}
	input {
		height: 90upx;
		font-size: $font-base + 4upx;
		color: $font-color-dark;
		flex: 1;
		// margin-left: 40upx;
	}
}

.confirm-btn {
	width: 630upx;
	height: 76upx;
	line-height: 76upx;
	margin-top: 70upx;
	background: $base-color;
	color: #fff;
	font-size: $font-lg;
	border-radius:8upx;
	&:after {
		border-radius: 100px;
	}
}
button::after{
	border: 0;
}
.forget-section {
	font-size: $font-sm + 2upx;
	color: #333;
	text-align: right;
	margin-top: 40upx;
	padding-right: 100upx;
}
.register-section {
	// position: absolute;
	// left: 0;
	// bottom: 50upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;
	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
</style>
