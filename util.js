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
  },
  //dates为数字类型，0代表今日,-1代表昨日，1代表明日，返回yyyy-mm-dd格式字符串，dates不传默认代表今日。
  getDate(dates) {
    var dd = new Date();
    var n = dates || 0;
    dd.setDate(dd.getDate() + n);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    m = m < 10 ? "0" + m: m;
    d = d < 10 ? "0" + d: d;
    var day = y + "-" + m + "-" + d;
    return day;
  },
  // 得到本周、上周、下周的起始、结束日期
  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
  getMonday(type, dates) {
    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var longTime = 24 * 60 * 60 * 1000;
    var n = longTime * 7 * (dates || 0);
    if (type == "s") {
        var dd = nowTime - (day - 1) * longTime + n;
    };
    if (type == "e") {
        var dd = nowTime + (7 - day) * longTime + n;
    };
    dd = new Date(dd);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    m = m < 10 ? "0" + m: m;
    d = d < 10 ? "0" + d: d;
    var day = y + "-" + m + "-" + d;
    return day;
  },
  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，months为数字类型，不传或0代表本月，-1代表上月，1代表下月
  // 例如 得到下月第一天的yyyy-mm-dd格式日期
  getMonth(type, months) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (Math.abs(months) > 12) {
        months = months % 12;
    };
    if (months != 0) {
        if (month + months > 12) {
            year++;
            month = (month + months) % 12;
        } else if (month + months < 1) {
            year--;
            month = 12 + month + months;
        } else {
            month = month + months;
        };
    };
    month = month < 10 ? "0" + month: month;
    var date = d.getDate();
    var firstday = year + "-" + month + "-" + "01";
    var lastday = "";
    if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
        lastday = year + "-" + month + "-" + 31;
    } else if (month == "02") {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
            lastday = year + "-" + month + "-" + 29;
        } else {
            lastday = year + "-" + month + "-" + 28;
        };
    } else {
        lastday = year + "-" + month + "-" + 30;
    };
    var day = "";
    if (type == "s") {
        day = firstday;
    } else {
        day = lastday;
    };
    return day;
  },
  // type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
  // 得到明年第一天的yyyy-mm-dd格式日期
  getYear(type, dates) {
    var dd = new Date();
    var n = dates || 0;
    var year = dd.getFullYear() + Number(n);
    if (type == "s") {
        var day = year + "-01-01";
    };
    if (type == "e") {
        var day = year + "-12-31";
    };
    if (!type) {
        var day = year + "-01-01/" + year + "-12-31";
    };
    return day;
  },
  round(v,e){
    var t=1;
    for(;e>0;t*=10,e--);
    // for(;e<0;t/=10,e++);
    return Math.round(v*t)/t;
  },
  GetNumberOfDays(date1,date2){//获得两日期之间的天数
    //date1：开始日期，date2结束日期
    var a1 = Date.parse(new Date(date1));
    var a2 = Date.parse(new Date(date2));
    var day = parseInt((a2-a1)/ (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数
    return day
  },
  yugi(n){ // 获取N天前的日期（国际日期）
    var now = new Date;
    now.setDate(now.getDate() - n);
    return now;
  },
  // getymd(dateStr) {
  //   var d = new Date(dateStr);
  //   var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  //   return resDate;
  // },
  getymd(dateStr) { // js将国际日期字符串转成日期格式，返回年月日
    var d = new Date(dateStr);　　　
    var s = '';　
    var mouth = (d.getMonth() + 1)>=10?(d.getMonth() + 1):('0'+(d.getMonth() + 1));　
    var day = d.getDate()>=10?d.getDate():('0'+d.getDate());　
    s += d.getFullYear() + '-'; // 获取年份。	
    s += mouth + "-"; // 获取月份。	　　
    s += day; // 获取日。　
    return (s); // 返回日期。		    　　
  },
  getAll(begin, end) { // 初始时间和结束时间的所以日期
    var arr = [];
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
    var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
    for (var k = unixDb; k <= unixDe;) {
      //console.log((new Date(parseInt(k))).format());
      k = k + 24 * 60 * 60 * 1000;
      arr.push(this.getymd( new Date(parseInt(k)) ) );
    }
    return arr;		    
  }
}