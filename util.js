export default {
	// 迭代递归法：深拷贝对象与数组
	deepClone(obj) {
		// 判断是否为对象
		function isObject(o) {
			return (typeof o === 'object' || typeof o === 'function') && o !== null;
		}
		if (!isObject(obj)) {
			throw new Error('obj 不是一个对象！');
		}
	
		let isArray = Array.isArray(obj);
		let cloneObj = isArray ? [] : {};
		for (let key in obj) {
			cloneObj[key] = isObject(obj[key]) ? this.deepClone(obj[key]) : obj[key];
		}
	
		return cloneObj;
	},
	//获取url变量对象
  getUriParam(str){
    let arr = str.split("&");
    let obj = new Object();
    for(var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj;
  },
  // 处理数字 保留两位小数点
// 1到4位数字  1234
// 5位数字	   2.51万
// 6位数字	   23.22万
// 7位数字	   123.62万
// 8位数字	   1234.74万
// 9位数字以上  1.31亿
  convertDigital(num) {
    if (typeof num !== 'number' || !isFinite(num)) {
      return 0
    }
    var i, text
    if (num > 99999999) {
      i = num / 100000000
      text = '亿'
    } else if (num > 9999) {
      i = num / 10000
      text = '万'
    } else {
      return num
    }
    return Math.round(i * 100) / 100 + text
  }
		  
}