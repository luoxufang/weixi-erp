const baseUrl = 'https://wechat.yiyuanerp.com';
const version = '/v1'

function requestAction(options) {
	let { ...reqOptions
	} = options;
	let tolen = '';
	if (!reqOptions.notoken) {//这是判断token是否过期，
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo) {
			// #ifndef MP-WEIXIN
			tolen = userInfo.token_type + ' ' + userInfo.access_token;
			// #endif 
			// #ifndef H5
			tolen = 'bearer ' + userInfo.token;
			// #endif  
		}
	}
	let header = {
		'content-type': 'application/x-www-form-urlencoded'
	}
	reqOptions.url = baseUrl + reqOptions.url;
	return new Promise((resolve, reject) => {
		uni.showLoading();
		let reqConfig = Object.assign({
			url: "",
			data: "",
			method: "POST",
			header: header,
			success: function(res) {
				resolve(res.data);
				uni.hideLoading();
			},
			fail: function(res) {
				reject(res);
				uni.hideLoading();
			}
		}, reqOptions);
		uni.request(reqConfig);
	})
}

// code获取openid
const codeReplaceOpenid = params => {
	let options = {
		url: '/home/login/getOpenId',
		data: params
	};
	return requestAction(options)
}

const wxlogin = params => {
	let options = {
		url: '/home/login/login',
		data: params
	};
	return requestAction(options)
}

const getUserInfo = params => {
	let options = {
		url: '/user/getUserInfo',
		data: params,
	};
	return requestAction(options)
}
// 切换店铺  token，page，limit
const getShopIndex = params => {
	let options = {
		url: '/home/shop/index',
		data: params,
	};
	return requestAction(options)
}
// 退出  token
const logout = params => {
	let options = {
		url: '/home/login/logout',
		data: params,
	};
	return requestAction(options)
}
// ----------------------------------------------

// 接单 token , shopid
const getorder = params => {
	let options = {
		url: '/home/report/getorder',
		data: params,
	};
	return requestAction(options)
}
// 接单明细  token, shopid,startdate,enddate,keyword,billtype: 11销售订单 12采购订单
const getorderlist = params => {
	let options = {
		url: '/home/report/getorderlist',
		data: params,
	};
	return requestAction(options)
}
// 呆滞库存  token,shopid
const getngstock = params => {
	let options = {
		url: '/home/report/getngstock',
		data: params,
	};
	return requestAction(options)
}

// 呆滞库存明细 
const getngstocklist = params => {
	let options = {
		url: '/home/report/getngstocklist',
		data: params,
	};
	return requestAction(options)
}

// 逾期收款
const getrec = params => {
	let options = {
		url: '/home/report/getrec',
		data: params,
	};
	return requestAction(options)
}
// 价格波动 
const getprice = params => {
	let options = {
		url: '/home/report/getprice',
		data: params,
	};
	return requestAction(options)
}
// 交期 
const getoverdate = params => {
	let options = {
		url: '/home/report/getoverdate',
		data: params,
	};
	return requestAction(options)
}

export default {
	baseUrl,version,
	codeReplaceOpenid,
	wxlogin,
	getUserInfo,
	getShopIndex,
	logout,
	getorder,
	getorderlist,
	getngstock,
	getngstocklist,
	getrec,
	getprice,
	getoverdate
}
