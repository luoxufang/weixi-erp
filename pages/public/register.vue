<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign"></view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">云账号</text>
					<input type="number" :value="email" placeholder="请输入云账号" data-key="email" @input="inputChange" placeholder-class="input-empty" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="number" :value="mobile" placeholder="密码" maxlength="11" data-key="mobile" @input="inputChange" placeholder-class="input-empty" />
				</view>
				<view class="input-item">
					<text class="tit">确认密码</text>
					<input
						type="mobile"
						value=""
						placeholder="请输入确认密码"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>

				<view class="input-item">
					<text class="tit">总店名称</text>
					<input type="number" :value="mobile" placeholder="总店名称" maxlength="11" data-key="mobile" @input="inputChange" placeholder-class="input-empty" />
				</view>
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="mobile" placeholder="手机号" maxlength="11" data-key="mobile" @input="inputChange" placeholder-class="input-empty" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input type="number" :value="mobile" placeholder="验证码" maxlength="11" data-key="mobile" @input="inputChange" placeholder-class="input-empty" />
					<view class="codeBox" :class="changeColor?'changeColor':''" @click="getValidCode">
						<view class="childBox">{{count!=60? '重新获取('+count+'s)':'获取验证码'}}</view>
					</view>
				</view>

			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">注册</button>
			<!-- <view class="forget-section">注册用户</view> -->
		</view>
		<!-- <view class="register-section">
			还没有账号?
			<text @click="toRegist('/pages/login')" >马上注册</text>
		</view> -->
	</view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	data() {
		return {
			mobile: '',
			email: '',
			password: '123456',
			logining: false,
			changeColor: false,
			count: 60,
			phoneNumber: ''
		};
	},
	onLoad() {},
	methods: {
		...mapMutations(['saveUserInfo']),
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		navBack() {
			uni.navigateBack();
		},
		// 跳转链接
		toRegist() {
			uni.navigateTo({
				url
			});
		},
    phoneChange(event){
      this.phoneNumber = event.detail.value
    },
    getValidCode() {
      var RegExp = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
      if (!this.phoneNumber || !RegExp.test(this.phoneNumber)) {
        this.$api.msg('请正确填写号码')
      } else {
        if (this.count == 60) {
          this.tick();
          // this.send_message();
          this.changeColor = true;
        }
      }
    },
    tick() {
      var vm = this;
      if (vm.count > 0) {
        var count = vm.count - 1;
        vm.count = count;
        setTimeout(function() {
          return vm.tick();
        }, 1000);
      } else {
        (vm.count = 60), (vm.changeColor = false);
      }
    },
		async toLogin() {
			this.logining = true;
			const { email, password } = this;
			//数据验证模块
			// if (
			// 	!this.$api.match({
			// 		email,
			// 		password
			// 	})
			// ) {
			// 	this.logining = false;
			// 	return;
			// }
			if (!email || !password) return;

			const sendData = {
				email,
				password
			};

			const result = await this.$api.interfaceApi('h5login')(sendData);
			const result1 = await this.$api.json('userInfo');

			if (result.access_token && result1.status === 1) {
				let data = Object.assign(result, result1.data);
				this.saveUserInfo(data);
				uni.navigateBack();
			} else {
				this.$api.msg(result.msg);
				this.logining = false;
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
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
	.input-empty{
		font-size: 26upx;
		color: #999;
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
	padding: 160upx 60upx 0;
}
.input-item {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 0 30upx;
	background: $page-color-light;
	height: 90upx;
	border-radius: 4px;
	margin-bottom: 28upx;
	&:last-child {
		margin-bottom: 0;
	}
	.tit {
		width: 126upx;
		line-height: 90upx;
		font-size: $font-sm + 4upx;
		color: $font-color-base;
	}
	input {
		height: 90upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		flex: 1;
		// margin-left: 40upx;
	}
	.codeBox{
		display: flex;
		align-items:center;
		height: 90upx;
		color: #666;
		font-size: 28upx;
		.childBox{
			width: 210upx;
			height: 40upx;
			display: flex;
			align-items:center;
			justify-content:center;
			border-left: 1upx solid #eee;
		}
	}
	.codeBox.changeColor{ color: #999;}
}

.confirm-btn {
	width: 630upx;
	height: 76upx;
	line-height: 76upx;
	border-radius: 50px;
	margin-top: 70upx;
	background: #1775E6;
	color: #fff;
	font-size: $font-lg;
	&:after {
		border-radius: 100px;
	}
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
