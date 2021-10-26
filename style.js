
//cookie处理
var Cookie = {
    get: function (n) {
        var dc = "; " + document.cookie + "; ";
        var coo = dc.indexOf("; " + n + "=");
        if (coo != -1) {
            var s = dc.substring(coo + n.length + 3, dc.length);
            return unescape(s.substring(0, s.indexOf("; ")));
        } else {
            return null;
        }
    },
    set: function (name, value, expires, path, domain, secure) {
        var expDays = expires * 24 * 60 * 60 * 3;
        var expDate = new Date();
        expDate.setTime(expDate.getTime() + expDays);
        var expString = expires ? "; expires=" + expDate.toGMTString() : "";
        var pathString = "; path=" + (path || "/");
        var domain = domain ? "; domain=" + domain : "";
        document.cookie = name + "=" + escape(value) + expString + domain + pathString + (secure ? "; secure" : "");
    },
    del: function (n) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.get(n);
        if (cval != null) document.cookie = n + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

//增加阅读数
function readbook(bookid) {
    $.get("/modules/article/articlevisit.php?id=" + bookid);
}

function vote_nomsg(aid) {
    $.get('/modules/article/uservote.php?id=' + aid + '&ajax_request=1');
}

function addBookmark(title, url) {
    if (!title) {
        title = document.title
    }
    if (!url) {
        url = window.location.href
    }
    if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    } else if (document.all) {
        window.external.AddFavorite(url, title);
    } else if (window.opera || window.print) {
        alert('浏览器不支持，请使用Ctrl + D 收藏！');
        return true;
    }
}

function killErrors() {
    return true;
}
window.onerror = killErrors;

/**
 * 用户信息Cookie显示
 */
var jieqiUserInfo = new Array();
jieqiUserInfo['jieqiUserId'] = 0;
jieqiUserInfo['jieqiUserUname'] = '';
jieqiUserInfo['jieqiUserName'] = '';
jieqiUserInfo['jieqiUserGroup'] = 0;
if (document.cookie.indexOf('jieqiUserInfo') >= 0) {
    var cookieInfo = get_cookie_value('jieqiUserInfo');
    start = 0;
    offset = cookieInfo.indexOf(',', start);
    while (offset > 0) {
        tmpval = cookieInfo.substring(start, offset);
        tmpidx = tmpval.indexOf('=');
        if (tmpidx > 0) {
            tmpname = tmpval.substring(0, tmpidx);
            tmpval = tmpval.substring(tmpidx + 1, tmpval.length);
            jieqiUserInfo[tmpname] = tmpval
        }
        start = offset + 1;
        if (offset < cookieInfo.length) {
            offset = cookieInfo.indexOf(',', start);
            if (offset == -1) offset = cookieInfo.length
        } else {
            offset = -1
        }
    }
}

function get_cookie_value(Name) {
    var search = Name + "=";
    var returnvalue = "";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) end = document.cookie.length;
            returnvalue = unescape(document.cookie.substring(offset, end))
        }
    }
    return returnvalue
}
var isLogin = jieqiUserInfo['jieqiUserId'] > 0;
function login() {
    if (isLogin) {
        document.writeln("<a href=\"\/history.html\">阅读历史</a> | <a href=\"\/modules\/article\/bookcase.php\" title='我的书架'>书架<\/a> | <a href=\"\/logout.php?jumpurl="+location.href+"\" title='退出登录'>退出<\/a>")
    } else {
        document.writeln("<a href=\"\/history.html\">阅读历史</a> | <a href=\"\/login.php?jumpurl="+location.href+"\">登录</a> | <a href=\"\/register.php\">注册</a>")
    }
}

// ie7以下的浏览器提示
var isIE = !!window.ActiveXObject;
var isIE6 = isIE && !window.XMLHttpRequest;
var isIE8 = isIE && !!document.documentMode;
var isIE7 = isIE && !isIE6 && !isIE8;
function tip_ie7() {
    if (isIE && (isIE6 || isIE7 || isIE8)) {
        document.writeln("<div class=\"tip-browser-upgrade\">");
        document.writeln("    你正在使用IE低级浏览器，如果你想有更好的阅读体验，<br />强烈建议您立即 <a class=\"blue\" href=\"https://windows.microsoft.com/zh-cn/internet-explorer/download-ie\" target=\"_blank\" rel=\"nofollow\">升级IE浏览器</a> 或者用更快更安全的 <a class=\"blue\" href=\"https://www.google.com/intl/zh-CN/chrome/browser/?hl=zh-CN\" target=\"_blank\" rel=\"nofollow\">谷歌浏览器Chrome</a> 。");
        document.writeln("</div>");
    }
}

//生成报错链接
function ErrorLink(articlename){
	var error_url='/newmessage.php?tosys=1&title=《'+ articlename+'》催更报错&content='+ location.href;
	$("#errorlink,.errorlink").attr('href',error_url);
}

//阅读页键盘操作事件
function ReadKeyEvent() {
    var index_page = $("#linkIndex").attr("href");
    var prev_page =  $("#linkPrev").attr("href");
    var next_page = $("#linkNext").attr("href");
    function jumpPage() {
        var event = document.all ? window.event : arguments[0];
        if (event.keyCode == 37) document.location = prev_page;
        if (event.keyCode == 39) document.location = next_page;
        if (event.keyCode == 13) document.location = index_page;
    }
    document.onkeydown = jumpPage;
}

//处理ajax返回的消息
function showMsg(msg){
    isLogin = isLogin && msg.indexOf("您需要登录")<=0;
    if(!isLogin){
        if(confirm("对不起，您需要登录才能使用本功能！点击确定立即登录。")){
            window.location.href = "/login.php?jumpurl="+location.href;
        }
        return false;
    }
    alert(msg.replace(/<br[^<>]*>/g, '\n'));
}

//推荐书籍
function BookVote(article_id) {
    $.get('/modules/article/uservote.php?id=' + article_id + '&ajax_request=1', function (data) {showMsg(data);});
}

//加入书架
function BookCaseAdd(article_id) {
    var url = '/modules/article/addbookcase.php?bid=' + article_id + '&ajax_request=1';
    $.get(url,function(res){showMsg(res);});
}

//加入书签
function BookCaseMark(article_id, chapter_id) {
    var url = '/modules/article/addbookcase.php?bid=' + article_id + '&cid=' + chapter_id + '&ajax_request=1';
    $.get(url,function(res){showMsg(res);});
}
//历史记录
var _num = 100;

function LastRead(){
	this.bookList="bookList"
	}
LastRead.prototype={	
	set:function(bid,tid,title,texttitle,author,sortname){
		if(!(bid&&tid&&title&&texttitle&&author&&sortname))return;
		var v=bid+'#'+tid+'#'+title+'#'+texttitle+'#'+author+'#'+sortname;
		this.setItem(bid,v);
		this.setBook(bid)		
		},
	
	get:function(k){
		return this.getItem(k)?this.getItem(k).split("#"):"";						
		},
	
	remove:function(k){
		this.removeItem(k);
		this.removeBook(k)			
		},
	
	setBook:function(v){
		var reg=new RegExp("(^|#)"+v); 
		var books =	this.getItem(this.bookList);
		if(books==""){
			books=v
			}
		 else{
			 if(books.search(reg)==-1){
				 books+="#"+v				 
				 }
			 else{
				  books.replace(reg,"#"+v)
				 }	 
			 }	
			this.setItem(this.bookList,books)
		
		},
	
	getBook:function(){
		var v=this.getItem(this.bookList)?this.getItem(this.bookList).split("#"):Array();
		var books=Array();
		if(v.length){
			
			for(var i=0;i<v.length;i++){
				var tem=this.getItem(v[i]).split('#');	
				if(i>v.length-(_num+1)){
					if (tem.length>3)	books.push(tem);
				}
				else{
					lastread.remove(tem[0]);
				}
			}		
		}
		return books		
	},
	
	removeBook:function(v){		
	    var reg=new RegExp("(^|#)"+v); 
		var books =	this.getItem(this.bookList);
		if(!books){
			books=""
			}
		 else{
			 if(books.search(reg)!=-1){	
			      books=books.replace(reg,"")
				 }	 
			 
			 }	
			this.setItem(this.bookList,books)		
		
		},
	
	setItem:function(k,v){
		if(!!window.localStorage){		
			localStorage.setItem(k,v);		
		}
		else{
			var expireDate=new Date();
			  var EXPIR_MONTH=30*24*3600*1000;			
			  expireDate.setTime(expireDate.getTime()+12*EXPIR_MONTH)
			  document.cookie=k+"="+encodeURIComponent(v)+";expires="+expireDate.toGMTString()+"; path=/";		
			}			
		},
		
	getItem:function(k){
		var value=""
		var result=""				
		if(!!window.localStorage){
			result=window.localStorage.getItem(k);
			 value=result||"";	
		}
		else{
			var reg=new RegExp("(^| )"+k+"=([^;]*)(;|\x24)");
			var result=reg.exec(document.cookie);
			if(result){
				value=decodeURIComponent(result[2])||""}				
		}
		return value
		
		},
	
	removeItem:function(k){		
		if(!!window.localStorage){
		 window.localStorage.removeItem(k);		
		}
		else{
			var expireDate=new Date();
			expireDate.setTime(expireDate.getTime()-1000)	
			document.cookie=k+"= "+";expires="+expireDate.toGMTString()							
		}
		},	
	removeAll:function(){
		if(!!window.localStorage){
		 window.localStorage.clear();		
		}
		else{
		var v=this.getItem(this.bookList)?this.getItem(this.bookList).split("#"):Array();
		var books=Array();
		if(v.length){
			for( i in v ){
				var tem=this.removeItem(v[k])				
				}		
			}
			this.removeItem(this.bookList)				
		}
		}	
	}
function showbook(){
	var showbook=document.getElementById('showbook');
	var bookhtml='';
	var books=lastread.getBook();
	var books=books.reverse();
	if(books.length){
		for(var i=0 ;i<books.length;i++){
			bookhtml+='<p class="line"><a class="del_but" href="javascript:removebook(\''+books[i][0]+'\')">【删除】</a> <span class="num">'+(i+1)+'、</span><a href="'+books[i][1]+'" class="blue">《'+books[i][2]+'》<span class="gray">已读到：</span>'+books[i][3]+'</a></p>';
		}
	}else{
		bookhtml+='<div style="height:100px;line-height:100px; text-align:center">还木有任何书籍( ˙﹏˙ )</div>'
	}
	showbook.innerHTML=bookhtml;
}
function removebook(k){
	lastread.remove(k);
	showbook()
}
window.lastread = new LastRead();



//统计代码
function tj() {
    /*var BcB1 = BcB1 || [];(function() {  var LHX2 = window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74"]("\x73\x63\x72\x69\x70\x74");  LHX2["\x73\x72\x63"] = "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x68\x6d\x2e\x62\x61\x69\x64\x75\x2e\x63\x6f\x6d\x2f\x68\x6d\x2e\x6a\x73\x3f\x62\x66\x63\x38\x66\x64\x66\x65\x37\x61\x32\x36\x61\x30\x30\x33\x31\x37\x34\x65\x62\x31\x64\x36\x31\x62\x32\x35\x34\x32\x38\x32";  var QZCivh3 = window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x73\x42\x79\x54\x61\x67\x4e\x61\x6d\x65"]("\x73\x63\x72\x69\x70\x74")[0];   QZCivh3["\x70\x61\x72\x65\x6e\x74\x4e\x6f\x64\x65"]["\x69\x6e\x73\x65\x72\x74\x42\x65\x66\x6f\x72\x65"](LHX2, QZCivh3);})();*/
}




// 百度自动推送
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'https://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();

//是否移动端
function is_mobile() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
        return true;
    }
    var result = regex_match.exec(u);
    if (null == result) {
        return false
    } else {
        return true
    }
}
//列表分页
  function aa() {
            var first = parseInt($("#pagelink .first").text());
            var last = parseInt($("#pagelink .last").text());
            var page = parseInt($("#pagelink strong").text());
            var next;
            var prev;
            if(page > 1){
                var prev = $("#pagelink .prev").attr("href");
                $(".index-listpage .before").attr("href",prev);
            }
            if(page < last){
                var next = $("#pagelink .next").attr("href");
                $(".index-listpage .onclick").attr("href",next);
            }
            var op = "";
            for(var i = 1; i < last+1; i++){
                var k = (i-1)*50+1; 
                var j = i*50;
                if(i==page){
                    op += "<option value=\""+i+"\" selected=\"selected\">第"+k+" - "+j+"章</option>";
                }else{
                    op += "<option value=\""+i+"\">第"+k+" - "+j+"章</option>";
                }
                
            }
            $("#pageselect").html(op);
            //alert(op);
    }
    
//转码
    function liulanqi() {
        eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('1 4=o;6(3.p.n>=0.b.a){0.d("8").7("9",""+4)}k{1 5=j;g h(){1 e=3.l||0.c.a||0.b.a;1 2=0.c.2||3.t||0.b.2;1 f=0.c.r;6(e+2>=f-i){0.d("8").7("9",""+4)}6(2>=s){0.d("8").7("9",""+4)}5=j}3.u=g(){6(5){q(h,i);5=m}k{}}}',31,31,'document|var|scrollTop|window|url|tur|if|setAttribute|linkNext|href|clientHeight|body|documentElement|getElementById|clients|wholeHeight|function|scrollBottomOrTop|500|true|else|innerHeight|false|availHeight|next_page|screen|setTimeout|scrollHeight|300|pageYOffset|onscroll'.split('|'),0,{}))
    }